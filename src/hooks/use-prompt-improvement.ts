
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PromptImprovement {
  feedback: string;
  improvedPrompt: string;
}

interface ErrorDetails {
  message: string;
  code?: string;
  type?: string;
}

export function usePromptImprovement() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<PromptImprovement[]>([]);

  /**
   * Improves a prompt using the OpenAI API
   * @param originalPrompt - The original prompt to improve
   * @param userFeedback - Optional user feedback to guide the improvement
   * @returns The improved prompt or null if an error occurred
   */
  const improvePrompt = async (originalPrompt: string, userFeedback?: string) => {
    if (!originalPrompt.trim()) return;
    
    setIsProcessing(true);
    setApiError(null);
    
    try {
      // Check authentication status
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required to use this feature');
      }
      
      // Use Supabase client to call edge function
      const { data, error } = await supabase.functions.invoke('improve-prompt', {
        body: {
          originalPrompt,
          feedback: userFeedback || '',
        },
      });
      
      if (error) {
        const errorMsg = error.message || 'Failed to improve prompt';
        console.error('Edge function error:', errorMsg);
        throw new Error(errorMsg);
      }
      
      if (!data) {
        console.error('No response data returned');
        throw new Error('No response data returned');
      }
      
      if (data.error) {
        console.error('API error:', data.error);
        throw new Error(data.error);
      }
      
      if (!data.improvedPrompt) {
        console.error('No improvement data returned');
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
      
      // Store in feedback history if there was user feedback
      if (userFeedback) {
        setFeedbackHistory(prev => [
          { feedback: userFeedback, improvedPrompt: data.improvedPrompt },
          ...prev
        ]);
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
      } else if (errorMessage.includes("Authentication required")) {
        toast.error("Please sign in to use this feature");
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
