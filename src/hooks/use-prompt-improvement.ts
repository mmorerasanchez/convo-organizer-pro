
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PromptImprovement {
  feedback: string;
  improvedPrompt: string;
}

export function usePromptImprovement() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<PromptImprovement[]>([]);
  const { toast } = useToast();

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
        toast({
          title: "Limited Improvement",
          description: data.warning,
          variant: "default"
        });
      } else {
        toast({
          title: userFeedback ? "Prompt Refined" : "Prompt Enhanced",
          description: userFeedback 
            ? "Your prompt has been refined based on your feedback and best practices."
            : "Your prompt has been enhanced using our prompting guide and expert techniques.",
        });
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
        toast({
          variant: "destructive",
          title: "API Quota Exceeded",
          description: "OpenAI API quota exceeded. The service is temporarily unavailable. Please try again later.",
        });
      } else if (errorMessage.includes("internet") || errorMessage.includes("network") || errorMessage.includes("connection")) {
        toast({
          variant: "destructive",
          title: "Network Error",
          description: "Please check your internet connection and try again.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to improve your prompt. Please try again.",
        });
      }
      
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    apiError,
    setApiError,  // Exposing the setter
    feedbackHistory,
    setFeedbackHistory,
    improvePrompt,
  };
}
