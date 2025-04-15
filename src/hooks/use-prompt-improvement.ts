
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
      
      if (!data || !data.improvedPrompt) {
        throw new Error('No improvement data returned');
      }
      
      toast({
        title: userFeedback ? "Prompt Refined" : "Prompt Enhanced",
        description: userFeedback 
          ? "Your prompt has been refined based on your feedback."
          : "Your prompt has been enhanced using best practices.",
      });

      return data.improvedPrompt;
    } catch (error) {
      console.error('Error improving prompt:', error);
      setApiError(error instanceof Error ? error.message : 'An unexpected error occurred');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to improve your prompt. Please try again.",
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    apiError,
    setApiError,  // Now exposing the setter
    feedbackHistory,
    setFeedbackHistory,
    improvePrompt,
  };
}
