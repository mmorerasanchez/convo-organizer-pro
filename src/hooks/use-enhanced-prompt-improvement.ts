
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useEnhancedPromptImprovement() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const improvePrompt = async (
    originalPrompt: string, 
    feedback?: string, 
    frameworkType: 'scanner' | 'designer' = 'scanner',
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
      console.log('Calling improve-prompt edge function:', {
        originalPrompt: originalPrompt.substring(0, 100) + '...',
        feedback: feedback || 'none',
        frameworkType,
        temperature,
        maxTokens
      });

      const { data, error } = await supabase.functions.invoke('improve-prompt', {
        body: { 
          originalPrompt,
          feedback: feedback || '',
          frameworkType,
          useSystemPrompt: true,
          temperature,
          maxTokens
        }
      });

      if (error) {
        console.error('Supabase edge function error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from edge function');
      }

      console.log('Edge function response received:', data);

      // Handle different response formats
      const improvedText = data.completion || data.generatedText || data.improvedPrompt;
      
      if (!improvedText) {
        console.error('No improved text in response:', data);
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
