
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { usePromptImprovement } from '@/hooks/use-prompt-improvement';
import { toast } from 'sonner';

type PromptScannerContextValue = {
  // State
  promptInput: string;
  setPromptInput: (value: string) => void;
  improvedPrompt: string;
  apiError: string | null;
  feedbackDialogOpen: boolean;
  setFeedbackDialogOpen: (open: boolean) => void;
  currentFeedback: string;
  setCurrentFeedback: (feedback: string) => void;
  requestCount: number;
  requestLimit: number;
  isProcessing: boolean;
  feedbackHistory: Array<{ feedback: string; improvedPrompt: string }>;
  
  // Actions
  handleInitialScan: () => void;
  handleClear: () => void;
  handleRevertToPrevious: () => void;
  handleAccept: () => void;
  handleSubmitFeedback: () => void;
};

const PromptScannerContext = createContext<PromptScannerContextValue | undefined>(undefined);

export const PromptScannerProvider = ({ children }: { children: ReactNode }) => {
  const [promptInput, setPromptInput] = useState('');
  const [improvedPrompt, setImprovedPrompt] = useState('');
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState('');
  const [requestCount, setRequestCount] = useState(0);
  const [requestLimit] = useState(10); // Free tier limit
  const [feedbackHistory, setFeedbackHistory] = useState<Array<{ feedback: string; improvedPrompt: string }>>([]);
  
  const {
    isProcessing,
    apiError,
    improvePrompt,
  } = usePromptImprovement();

  const handleImprovePrompt = async (feedback?: string) => {
    try {
      if (!promptInput.trim()) {
        toast.error("Please enter a prompt to improve.");
        return;
      }
      
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
  };

  const handleRevertToPrevious = () => {
    if (feedbackHistory.length > 0) {
      const previousState = feedbackHistory[feedbackHistory.length - 1];
      setImprovedPrompt(previousState.improvedPrompt);
      setFeedbackHistory(feedbackHistory.slice(0, -1));
      
      toast.info("Reverted to previous version.");
    }
  };

  const handleAccept = () => {
    if (!improvedPrompt) return;
    
    navigator.clipboard.writeText(improvedPrompt).then(() => {
      toast.success("Prompt copied to clipboard.");
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
  
  const contextValue: PromptScannerContextValue = {
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
  
  return (
    <PromptScannerContext.Provider value={contextValue}>
      {children}
    </PromptScannerContext.Provider>
  );
};

export const usePromptScannerContext = () => {
  const context = useContext(PromptScannerContext);
  if (context === undefined) {
    throw new Error('usePromptScannerContext must be used within a PromptScannerProvider');
  }
  return context;
};
