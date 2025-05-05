
import { supabase } from '@/integrations/supabase/client';
import { PromptState, TestPromptParams, TestPromptResult } from './types';
import { toast } from 'sonner';

export const fetchPrompts = async (userId?: string) => {
  if (!userId) return [];
  
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
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return [];
  }
};

export const createNewPrompt = async (promptData: PromptState, userId: string) => {
  // Insert the prompt first
  const { data: newPrompt, error: promptError } = await supabase
    .from('prompts')
    .insert({
      title: promptData.title,
      framework_id: promptData.frameworkId,
      owner_id: userId
    })
    .select()
    .single();
    
  if (promptError) throw promptError;
  
  // Then insert the initial version
  const { data: versionData, error: versionError } = await supabase
    .from('prompt_versions')
    .insert({
      prompt_id: newPrompt.id,
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
  
  return { ...newPrompt, version: versionData };
};

export const savePromptVersion = async (promptData: PromptState) => {
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
};

export const deletePromptById = async (promptId: string) => {
  const { error } = await supabase
    .from('prompts')
    .delete()
    .eq('id', promptId);
    
  if (error) throw error;
  
  return promptId;
};

export const testPromptRequest = async (params: TestPromptParams): Promise<TestPromptResult> => {
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
};

// Compile prompt text from field values
export const compilePromptText = (fieldValues: Record<string, string>) => {
  let compiledText = '';
  
  // Convert the field values to a formatted string
  Object.entries(fieldValues).forEach(([key, value]) => {
    if (value && value.trim()) {
      compiledText += `${key}:\n${value}\n\n`;
    }
  });
  
  return compiledText.trim();
};
