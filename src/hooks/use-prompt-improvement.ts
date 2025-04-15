
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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
      const response = await fetch('https://lovable.app/functions/v1/improve-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalPrompt,
          feedback: userFeedback,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to improve prompt');
      }
      
      const data = await response.json();
      
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
    feedbackHistory,
    setFeedbackHistory,
    improvePrompt,
  };
}
