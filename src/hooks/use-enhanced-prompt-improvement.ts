
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getModelById } from '@/lib/modelData';

export function useEnhancedPromptImprovement() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const improvePrompt = async (
    originalPrompt: string, 
    feedback?: string, 
    modelId: string = 'gpt-4o-mini',
    temperature: number = 0.7,
    maxTokens: number = 1000
  ) => {
    if (!originalPrompt.trim()) {
      toast.error("Please enter a prompt to improve.");
      return null;
    }

    setIsProcessing(true);
    setApiError(null);

    try {
      const model = getModelById(modelId);
      const isGemini = model?.provider === 'google';
      
      // Create improvement prompt based on model capabilities
      let improvementPrompt = `You are an expert prompt engineer. Please improve the following prompt to make it more effective, clear, and specific.`;
      
      if (model?.capabilities?.includes('long-context')) {
        improvementPrompt += ` Take advantage of the model's large context window capabilities.`;
      }
      
      if (model?.capabilities?.includes('vision')) {
        improvementPrompt += ` Consider that this model can process visual content if relevant.`;
      }

      improvementPrompt += `\n\nOriginal prompt: "${originalPrompt}"`;
      
      if (feedback) {
        improvementPrompt += `\n\nUser feedback: "${feedback}"`;
      }

      improvementPrompt += `\n\nPlease provide an improved version that is:
1. More specific and actionable
2. Clearer in its instructions
3. Better structured for optimal results
4. Optimized for ${model?.displayName || 'the selected model'}

Return only the improved prompt without explanations.`;

      let result;

      if (isGemini) {
        // Use Gemini API
        const { data, error } = await supabase.functions.invoke('gemini-api', {
          body: { 
            prompt: improvementPrompt,
            model: modelId,
            temperature,
            maxTokens
          }
        });

        if (error) throw error;
        result = data;
      } else {
        // Use OpenAI API (existing improve-prompt function)
        const { data, error } = await supabase.functions.invoke('improve-prompt', {
          body: { 
            prompt: improvementPrompt,
            temperature,
            maxTokens
          }
        });

        if (error) throw error;
        result = data;
      }

      if (result.error) {
        throw new Error(result.error);
      }

      return result.completion || result.generatedText;

    } catch (error: any) {
      console.error('Error improving prompt:', error);
      const errorMessage = error.message || 'Failed to improve prompt';
      setApiError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    improvePrompt,
    isProcessing,
    apiError,
  };
}
