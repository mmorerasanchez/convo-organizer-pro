
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
      
      // Create improvement prompt based on model
      let improvementPrompt = `You are an expert prompt engineer. Please improve the following prompt to make it more effective, clear, and specific.`;
      
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

        if (error) {
          console.error('Gemini API error:', error);
          throw error;
        }
        result = data;
      } else {
        // Use OpenAI API (improve-prompt function)
        const { data, error } = await supabase.functions.invoke('improve-prompt', {
          body: { 
            prompt: improvementPrompt,
            feedback: feedback || '',
            temperature,
            maxTokens
          }
        });

        if (error) {
          console.error('OpenAI API error:', error);
          throw error;
        }
        result = data;
      }

      if (result.error) {
        console.error('API returned error:', result.error);
        throw new Error(result.error);
      }

      // Handle different response formats
      const improvedText = result.completion || result.generatedText || result.improvedPrompt;
      
      if (!improvedText) {
        console.error('No improved text in response:', result);
        throw new Error('No improvement data returned');
      }

      return improvedText;

    } catch (error: any) {
      console.error('Error improving prompt:', error);
      const errorMessage = error.message || 'Failed to improve prompt';
      setApiError(errorMessage);
      
      // More specific error messages
      if (errorMessage.includes("quota")) {
        toast.error("API quota exceeded. Please try again later.");
      } else if (errorMessage.includes("network") || errorMessage.includes("connection")) {
        toast.error("Network error. Please check your connection and try again.");
      } else if (errorMessage.includes("timeout")) {
        toast.error("Request timed out. Please try again.");
      } else {
        toast.error("Failed to improve prompt. Please try again.");
      }
      
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
