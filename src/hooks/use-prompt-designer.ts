
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface PromptState {
  id?: string;
  title: string;
  frameworkId: string | null;
  fieldValues: Record<string, string>;
  temperature: number;
  maxTokens: number;
  modelId: string | null;
}

export function usePromptDesigner(promptId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activePrompt, setActivePrompt] = useState<PromptState>({
    title: 'Untitled Prompt',
    frameworkId: null,
    fieldValues: {},
    temperature: 0.7,
    maxTokens: 1000,
    modelId: null
  });
  
  const { data: prompts } = useQuery({
    queryKey: ['prompts'],
    queryFn: async () => {
      try {
        if (!user) return [];
        
        const { data, error } = await supabase
          .from('prompts')
          .select('*, prompt_versions(*)')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        return data;
      } catch (error) {
        console.error("Error fetching prompts:", error);
        return [];
      }
    },
    enabled: !!user
  });
  
  const { data: promptDetail } = useQuery({
    queryKey: ['prompt', promptId],
    queryFn: async () => {
      if (!promptId || !user) return null;
      
      try {
        // Get prompt
        const { data: prompt, error } = await supabase
          .from('prompts')
          .select('*')
          .eq('id', promptId)
          .eq('owner_id', user.id)
          .single();
          
        if (error) throw error;
        
        // Get latest version
        const { data: versions, error: versionsError } = await supabase
          .from('prompt_versions')
          .select('*')
          .eq('prompt_id', promptId)
          .order('version_number', { ascending: false })
          .limit(1);
          
        if (versionsError) throw versionsError;
        
        const latestVersion = versions?.[0];
        
        if (latestVersion) {
          setActivePrompt({
            id: prompt.id,
            title: prompt.title,
            frameworkId: prompt.framework_id,
            fieldValues: latestVersion.field_values || {},
            temperature: latestVersion.temperature || 0.7,
            maxTokens: latestVersion.max_tokens || 1000,
            modelId: latestVersion.model_id
          });
        } else {
          setActivePrompt({
            id: prompt.id,
            title: prompt.title,
            frameworkId: prompt.framework_id,
            fieldValues: {},
            temperature: 0.7,
            maxTokens: 1000,
            modelId: null
          });
        }
        
        return prompt;
      } catch (error) {
        console.error("Error fetching prompt detail:", error);
        return null;
      }
    },
    enabled: !!promptId && !!user
  });
  
  // Create new prompt
  const createPrompt = useMutation({
    mutationFn: async (promptData: PromptState) => {
      if (!user) throw new Error("User must be authenticated");
      if (!promptData.frameworkId) throw new Error("Framework must be selected");
      
      const { data: prompt, error } = await supabase
        .from('prompts')
        .insert({
          owner_id: user.id,
          title: promptData.title,
          framework_id: promptData.frameworkId
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Create initial version
      const { error: versionError } = await supabase
        .from('prompt_versions')
        .insert({
          prompt_id: prompt.id,
          version_number: 1,
          field_values: promptData.fieldValues,
          temperature: promptData.temperature,
          max_tokens: promptData.maxTokens,
          model_id: promptData.modelId,
          compiled_text: compilePromptText(promptData.fieldValues)
        });
        
      if (versionError) throw versionError;
      
      return prompt;
    },
    onSuccess: () => {
      toast.success("Prompt created successfully");
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
    onError: (error) => {
      toast.error("Failed to create prompt");
      console.error("Error creating prompt:", error);
    }
  });
  
  // Save prompt version
  const saveVersion = useMutation({
    mutationFn: async (promptData: PromptState) => {
      if (!user) throw new Error("User must be authenticated");
      if (!promptData.id) throw new Error("Prompt ID is required");
      
      // Update prompt title
      const { error: promptError } = await supabase
        .from('prompts')
        .update({ title: promptData.title })
        .eq('id', promptData.id)
        .eq('owner_id', user.id);
        
      if (promptError) throw promptError;
      
      // Get current version count
      const { data: versions, error: countError } = await supabase
        .from('prompt_versions')
        .select('version_number')
        .eq('prompt_id', promptData.id)
        .order('version_number', { ascending: false })
        .limit(1);
        
      if (countError) throw countError;
      
      const nextVersion = (versions?.[0]?.version_number || 0) + 1;
      
      // Create new version
      const { error: versionError } = await supabase
        .from('prompt_versions')
        .insert({
          prompt_id: promptData.id,
          version_number: nextVersion,
          field_values: promptData.fieldValues,
          temperature: promptData.temperature,
          max_tokens: promptData.maxTokens,
          model_id: promptData.modelId,
          compiled_text: compilePromptText(promptData.fieldValues)
        });
        
      if (versionError) throw versionError;
      
      return { id: promptData.id, version: nextVersion };
    },
    onSuccess: () => {
      toast.success("Version saved successfully");
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      queryClient.invalidateQueries({ queryKey: ['prompt', activePrompt.id] });
    },
    onError: (error) => {
      toast.error("Failed to save version");
      console.error("Error saving version:", error);
    }
  });
  
  // Delete prompt
  const deletePrompt = useMutation({
    mutationFn: async (promptId: string) => {
      if (!user) throw new Error("User must be authenticated");
      
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', promptId)
        .eq('owner_id', user.id);
        
      if (error) throw error;
      
      return promptId;
    },
    onSuccess: () => {
      toast.success("Prompt deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
    onError: (error) => {
      toast.error("Failed to delete prompt");
      console.error("Error deleting prompt:", error);
    }
  });
  
  // Test prompt
  const testPrompt = useMutation({
    mutationFn: async ({ 
      versionId, 
      prompt, 
      model, 
      temperature, 
      maxTokens 
    }: { 
      versionId?: string; 
      prompt: string; 
      model: string; 
      temperature: number; 
      maxTokens: number; 
    }) => {
      try {
        // Call edge function to test the prompt
        const { data, error } = await supabase.functions.invoke('test-prompt', {
          body: {
            prompt,
            model,
            temperature,
            max_tokens: maxTokens
          }
        });
        
        if (error) throw error;
        
        // If we have a version ID, store the test results
        if (versionId) {
          await supabase
            .from('prompt_tests')
            .insert({
              version_id: versionId,
              response_ms: data.response_ms,
              tokens_in: data.tokens_in,
              tokens_out: data.tokens_out,
              cost_usd: data.cost_usd,
              raw_response: data.raw_response
            });
        }
        
        return data;
      } catch (error) {
        console.error("Error testing prompt:", error);
        throw error;
      }
    },
    onError: (error) => {
      toast.error("Prompt test failed");
      console.error("Error in prompt test:", error);
    }
  });

  // Helper function to compile prompt text from field values
  function compilePromptText(fieldValues: Record<string, string>): string {
    return Object.entries(fieldValues)
      .map(([field, value]) => `# ${field}\n${value}`)
      .join('\n\n');
  }
  
  return {
    activePrompt,
    setActivePrompt,
    prompts,
    promptDetail,
    createPrompt,
    saveVersion,
    deletePrompt,
    testPrompt,
    compilePromptText
  };
}
