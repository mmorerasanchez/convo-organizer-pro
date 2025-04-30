
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  versionNumber?: number;
}

export interface TestPromptParams {
  versionId?: string;
  prompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface TestPromptResult {
  completion: string;
  tokens_in: number;
  tokens_out: number;
  response_ms: number;
  cost_usd: number;
}

export function usePromptDesigner() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const defaultPrompt: PromptState = {
    title: 'Untitled Prompt',
    frameworkId: null,
    fieldValues: {},
    temperature: 0.7,
    maxTokens: 1000,
    modelId: null
  };
  
  const [activePrompt, setActivePrompt] = React.useState<PromptState>(defaultPrompt);
  
  // Fetch user's prompts
  const { data: prompts = [] } = useQuery({
    queryKey: ['prompts', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .from('prompts')
          .select(`
            id, 
            title, 
            framework_id,
            created_at,
            prompt_versions (
              id, 
              version_number,
              field_values,
              temperature,
              max_tokens,
              model_id,
              created_at
            )
          `)
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error('Error fetching prompts:', error);
        return [];
      }
    },
    enabled: !!user
  });
  
  // Create a new prompt
  const createPrompt = useMutation({
    mutationFn: async (promptData: PromptState) => {
      if (!user) throw new Error('User not authenticated');
      
      // Insert the prompt first
      const { data: promptData, error: promptError } = await supabase
        .from('prompts')
        .insert({
          title: promptData.title,
          framework_id: promptData.frameworkId,
          owner_id: user.id
        })
        .select()
        .single();
        
      if (promptError) throw promptError;
      
      // Then insert the initial version
      const { data: versionData, error: versionError } = await supabase
        .from('prompt_versions')
        .insert({
          prompt_id: promptData.id,
          version_number: 1,
          field_values: promptData.fieldValues,
          temperature: promptData.temperature,
          max_tokens: promptData.maxTokens,
          model_id: promptData.modelId,
          compiled_text: compilePromptText(promptData.fieldValues)
        })
        .select()
        .single();
        
      if (versionError) throw versionError;
      
      return { ...promptData, version: versionData };
    },
    onSuccess: () => {
      toast.success('Prompt created successfully');
      queryClient.invalidateQueries({ queryKey: ['prompts', user?.id] });
    },
    onError: (error) => {
      console.error('Error creating prompt:', error);
      toast.error('Failed to create prompt');
    }
  });
  
  // Save a new version of an existing prompt
  const saveVersion = useMutation({
    mutationFn: async (promptData: PromptState) => {
      if (!promptData.id) throw new Error('Prompt ID is required');
      
      // Get the latest version number
      const { data: versions, error: versionsError } = await supabase
        .from('prompt_versions')
        .select('version_number')
        .eq('prompt_id', promptData.id)
        .order('version_number', { ascending: false })
        .limit(1);
        
      if (versionsError) throw versionsError;
      
      const nextVersionNumber = versions && versions.length > 0 ? versions[0].version_number + 1 : 1;
      
      // Update the prompt title if needed
      await supabase
        .from('prompts')
        .update({ title: promptData.title })
        .eq('id', promptData.id);
      
      // Insert the new version
      const { data, error } = await supabase
        .from('prompt_versions')
        .insert({
          prompt_id: promptData.id,
          version_number: nextVersionNumber,
          field_values: promptData.fieldValues,
          temperature: promptData.temperature,
          max_tokens: promptData.maxTokens,
          model_id: promptData.modelId,
          compiled_text: compilePromptText(promptData.fieldValues)
        })
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      toast.success('New version saved');
      queryClient.invalidateQueries({ queryKey: ['prompts', user?.id] });
    },
    onError: (error) => {
      console.error('Error saving version:', error);
      toast.error('Failed to save version');
    }
  });
  
  // Delete a prompt
  const deletePrompt = useMutation({
    mutationFn: async (promptId: string) => {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', promptId);
        
      if (error) throw error;
      
      return promptId;
    },
    onSuccess: () => {
      toast.success('Prompt deleted');
      queryClient.invalidateQueries({ queryKey: ['prompts', user?.id] });
    },
    onError: (error) => {
      console.error('Error deleting prompt:', error);
      toast.error('Failed to delete prompt');
    }
  });
  
  // Test a prompt
  const testPrompt = useMutation({
    mutationFn: async (params: TestPromptParams): Promise<TestPromptResult> => {
      const { data, error } = await supabase.functions.invoke('test-prompt', {
        body: params
      });
      
      if (error) throw error;
      
      // If there's a versionId, record the test
      if (params.versionId) {
        await supabase
          .from('prompt_tests')
          .insert({
            version_id: params.versionId,
            response_ms: data.response_ms,
            tokens_in: data.tokens_in,
            tokens_out: data.tokens_out,
            cost_usd: data.cost_usd,
            raw_response: data.completion
          });
      }
      
      return data;
    },
    onError: (error) => {
      console.error('Error testing prompt:', error);
      toast.error('Failed to test prompt');
    }
  });
  
  // Compile prompt text from field values
  const compilePromptText = (fieldValues: Record<string, string>) => {
    let compiledText = '';
    
    // Convert the field values to a formatted string
    Object.entries(fieldValues).forEach(([key, value]) => {
      if (value && value.trim()) {
        compiledText += `${key}:\n${value}\n\n`;
      }
    });
    
    return compiledText.trim();
  };
  
  return {
    activePrompt,
    setActivePrompt,
    prompts,
    createPrompt,
    saveVersion,
    deletePrompt,
    testPrompt,
    compilePromptText
  };
}

// Add missing React import
import React from 'react';
