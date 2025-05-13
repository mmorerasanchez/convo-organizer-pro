
import { useState } from 'react';
import { usePromptImprovement } from '@/hooks/use-prompt-improvement';
import { toast } from 'sonner';

export function usePromptScanner() {
  const [promptInput, setPromptInput] = useState('');
  const [improvedPrompt, setImprovedPrompt] = useState('');
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState('');
  const [requestCount, setRequestCount] = useState(0);
  const [requestLimit] = useState(10); // Free tier limit
  
  const {
    isProcessing,
    apiError,
    setApiError,
    feedbackHistory,
    setFeedbackHistory,
    improvePrompt,
  } = usePromptImprovement();

  const handleImprovePrompt = async (feedback?: string) => {
    try {
      const result = await improvePrompt(promptInput, feedback);
      if (result) {
        if (improvedPrompt) {
          setFeedbackHistory([...feedbackHistory, { feedback: feedback || '', improvedPrompt }]);
        }
        setImprovedPrompt(result);
        
        // Increment request count
        setRequestCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error in handleImprovePrompt:', error);
    }
  };

  const handleInitialScan = () => {
    if (!promptInput.trim()) {
      toast.error("Please enter a prompt to improve.");
      return;
    }
    handleImprovePrompt();
  };

  const handleClear = () => {
    setPromptInput('');
    setImprovedPrompt('');
    setFeedbackHistory([]);
    setApiError(null);
  };

  const handleRevertToPrevious = () => {
    if (feedbackHistory.length > 0) {
      const previousState = feedbackHistory[feedbackHistory.length - 1];
      setImprovedPrompt(previousState.improvedPrompt);
      setFeedbackHistory(feedbackHistory.slice(0, -1));
      
      toast.info("Reverted to previous version");
    }
  };

  const handleAccept = () => {
    if (!improvedPrompt) return;
    
    navigator.clipboard.writeText(improvedPrompt).then(() => {
      toast.success("Improved prompt copied to clipboard");
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
      toast.error("Unable to copy to clipboard. Please try again or copy manually.");
    });
  };

  const handleSubmitFeedback = () => {
    if (currentFeedback.trim()) {
      handleImprovePrompt(currentFeedback);
      setFeedbackDialogOpen(false);
      setCurrentFeedback('');
    }
  };

  return {
    // State
    promptInput,
    setPromptInput,
    improvedPrompt,
    apiError,
    feedbackDialogOpen,
    setFeedbackDialogOpen,
    currentFeedback,
    setCurrentFeedback,
    requestCount,
    requestLimit,
    isProcessing,
    feedbackHistory,
    
    // Actions
    handleInitialScan,
    handleClear,
    handleRevertToPrevious,
    handleAccept,
    handleSubmitFeedback
  };
}
