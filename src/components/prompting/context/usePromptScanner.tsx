
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useEnhancedPromptImprovement } from '@/hooks/use-enhanced-prompt-improvement';
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
  
  // Model and parameters
  selectedModelId: string;
  setSelectedModelId: (modelId: string) => void;
  temperature: number;
  setTemperature: (temp: number) => void;
  maxTokens: number;
  setMaxTokens: (tokens: number) => void;
  showAdvancedParams: boolean;
  setShowAdvancedParams: (show: boolean) => void;
  
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
  
  // Model and parameters state
  const [selectedModelId, setSelectedModelId] = useState('gpt-4o-mini');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [showAdvancedParams, setShowAdvancedParams] = useState(false);
  
  const {
    isProcessing,
    apiError,
    improvePrompt,
  } = useEnhancedPromptImprovement();

  const handleImprovePrompt = async (feedback?: string) => {
    if (!promptInput.trim()) {
      toast.error("Please enter a prompt to improve.");
      return;
    }

    try {
      // Store current improved prompt in history before generating new one
      if (improvedPrompt && feedback) {
        setFeedbackHistory(prev => [...prev, { feedback: feedback, improvedPrompt }]);
      }
      
      const result = await improvePrompt(promptInput, feedback, 'scanner', temperature, maxTokens);
      
      if (result) {
        setImprovedPrompt(result);
        setRequestCount(prev => prev + 1);
        
        // Show success message
        if (feedback) {
          toast.success("Prompt refined based on your feedback");
        } else {
          toast.success("Prompt improved successfully");
        }
      }
    } catch (error) {
      console.error('Error in handleImprovePrompt:', error);
      // Error handling is already done in the hook
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
    setCurrentFeedback('');
  };

  const handleRevertToPrevious = () => {
    if (feedbackHistory.length > 0) {
      const previousState = feedbackHistory[feedbackHistory.length - 1];
      setImprovedPrompt(previousState.improvedPrompt);
      setFeedbackHistory(prev => prev.slice(0, -1));
      
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
    
    // Model and parameters
    selectedModelId,
    setSelectedModelId,
    temperature,
    setTemperature,
    maxTokens,
    setMaxTokens,
    showAdvancedParams,
    setShowAdvancedParams,
    
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
