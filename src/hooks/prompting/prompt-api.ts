
import { supabase } from '@/integrations/supabase/client';
import { PromptState, TestPromptParams, TestPromptResult } from './types';
import { toast } from 'sonner';
import { getModelById } from '@/lib/modelData';
import { logger } from '@/lib/utils/logger';
import { errorHandler } from '@/lib/utils/errorHandler';

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
    
    logger.debug('Fetched prompts successfully', { metadata: { count: data?.length || 0 } });
    return data || [];
  } catch (error) {
    logger.error('Error fetching prompts', error as Error, { userId });
    return [];
  }
};

export const createNewPrompt = async (promptData: PromptState, userId: string) => {
  try {
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
        compiled_text: compilePromptText(promptData)
      })
      .select()
      .single();
      
    if (versionError) throw versionError;
    
    logger.info('Created new prompt successfully', { metadata: { promptId: newPrompt.id } });
    return { ...newPrompt, version: versionData };
  } catch (error) {
    logger.error('Error creating new prompt', error as Error, { userId });
    throw error;
  }
};

export const savePromptVersion = async (promptData: PromptState) => {
  if (!promptData.id) throw new Error('Prompt ID is required');
  
  try {
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
        compiled_text: compilePromptText(promptData)
      })
      .select()
      .single();
      
    if (error) throw error;
    
    logger.info('Saved prompt version successfully', { metadata: { promptId: promptData.id, version: nextVersionNumber } });
    return data;
  } catch (error) {
    logger.error('Error saving prompt version', error as Error, { metadata: { promptId: promptData.id } });
    throw error;
  }
};

export const deletePromptById = async (promptId: string) => {
  try {
    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', promptId);
      
    if (error) throw error;
    
    logger.info('Deleted prompt successfully', { metadata: { promptId } });
    return promptId;
  } catch (error) {
    logger.error('Error deleting prompt', error as Error, { metadata: { promptId } });
    throw error;
  }
};

export const testPromptRequest = async (params: TestPromptParams): Promise<TestPromptResult> => {
  const model = getModelById(params.modelId);
  const isGemini = model?.provider === 'google';
  
  logger.debug('Testing prompt', { metadata: { modelId: params.modelId, provider: model?.provider } });
  
  try {
    let data, error;
    
    if (isGemini) {
      // Use Gemini API
      const response = await supabase.functions.invoke('gemini-api', {
        body: { 
          prompt: params.prompt,
          model: params.modelId,
          temperature: params.temperature || 0.7,
          maxTokens: params.maxTokens || 1000
        }
      });
      
      data = response.data;
      error = response.error;
    } else {
      // Use OpenAI API (existing test-prompt function)
      const response = await supabase.functions.invoke('test-prompt', {
        body: params
      });
      
      data = response.data;
      error = response.error;
    }
    
    if (error) throw error;
    
    // If there's a versionId, record the test
    if (params.versionId) {
      await supabase
        .from('prompt_tests')
        .insert({
          version_id: params.versionId,
          response_ms: data.response_ms || 0,
          tokens_in: data.tokens_in || 0,
          tokens_out: data.tokens_out || 0,
          cost_usd: data.cost_usd || 0,
          raw_response: data.completion || data.generatedText
        });
    }
    
    logger.info('Prompt test completed successfully', { 
      metadata: { 
        modelId: params.modelId, 
        responseTime: data.response_ms || 0 
      }
    });
    
    return {
      completion: data.completion || data.generatedText,
      tokens_in: data.tokens_in || 0,
      tokens_out: data.tokens_out || 0,
      response_ms: data.response_ms || 0,
      cost_usd: data.cost_usd || 0
    };
  } catch (error) {
    logger.error('Error testing prompt', error as Error, { metadata: { modelId: params.modelId } });
    throw error;
  }
};

// Compile prompt text from PromptState
export const compilePromptText = (promptState: PromptState): string => {
  let compiledText = '';
  
  // Convert the field values to a formatted string
  if (promptState.fieldValues) {
    Object.entries(promptState.fieldValues).forEach(([key, value]) => {
      if (value && value.trim()) {
        compiledText += `${key}:\n${value}\n\n`;
      }
    });
  }
  
  return compiledText.trim();
};
