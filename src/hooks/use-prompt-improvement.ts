
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PromptImprovement {
  feedback: string;
  improvedPrompt: string;
}

export function usePromptImprovement() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<PromptImprovement[]>([]);

  const improvePrompt = async (originalPrompt: string, userFeedback?: string) => {
    if (!originalPrompt.trim()) return;
    
    setIsProcessing(true);
    setApiError(null);
    
    try {
      // Use Supabase client to call edge function
      const { data, error } = await supabase.functions.invoke('improve-prompt', {
        body: {
          originalPrompt,
          feedback: userFeedback || '',
        },
      });
      
      if (error) {
        throw new Error(error.message || 'Failed to improve prompt');
      }
      
      if (!data) {
        throw new Error('No response data returned');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!data.improvedPrompt) {
        throw new Error('No improvement data returned');
      }
      
      // Show warning if it's a fallback response
      if (data.warning) {
        toast.warning(data.warning);
      } else {
        toast.success(userFeedback 
          ? "Prompt refined based on your feedback" 
          : "Prompt enhanced with best practices");
      }

      // Extract just the improved prompt if the response contains explanation
      let finalImprovedPrompt = data.improvedPrompt;
      if (finalImprovedPrompt.includes("Improved prompt:")) {
        const promptSection = finalImprovedPrompt.split("Improved prompt:")[1];
        if (promptSection) {
          finalImprovedPrompt = promptSection.trim();
        }
      }

      return finalImprovedPrompt;
    } catch (error) {
      console.error('Error improving prompt:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setApiError(errorMessage);
      
      // Different toast messages for different error types
      if (errorMessage.includes("quota")) {
        toast.error("API quota exceeded. Please try again later.");
      } else if (errorMessage.includes("internet") || errorMessage.includes("network") || errorMessage.includes("connection")) {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error("Failed to improve prompt. Please try again.");
      }
      
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    apiError,
    setApiError,
    feedbackHistory,
    setFeedbackHistory,
    improvePrompt,
  };
}
