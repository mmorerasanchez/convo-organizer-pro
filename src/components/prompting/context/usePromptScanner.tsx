
import { useCallback } from 'react';
import { toast } from 'sonner';
import { usePromptingContext } from './PromptingContext';
import { usePromptImprovement } from '@/hooks/use-prompt-improvement';

export const usePromptScannerContext = () => {
  const { state, dispatch } = usePromptingContext();
  const promptImprovement = usePromptImprovement();
  
  const {
    promptInput,
    improvedPrompt,
    currentFeedback,
    feedbackHistory,
    requestCount,
    requestLimit,
    isProcessing,
    apiError,
  } = state;
  
  const setPromptInput = useCallback((input: string) => {
    dispatch({ type: 'SET_PROMPT_INPUT', payload: input });
  }, [dispatch]);
  
  const setCurrentFeedback = useCallback((feedback: string) => {
    dispatch({ type: 'SET_CURRENT_FEEDBACK', payload: feedback });
  }, [dispatch]);
  
  const handleInitialScan = useCallback(async () => {
    if (!promptInput.trim()) {
      toast.error('Please enter a prompt to scan');
      return;
    }
    
    try {
      dispatch({ type: 'SET_IS_PROCESSING', payload: true });
      dispatch({ type: 'SET_API_ERROR', payload: null });
      
      const result = await promptImprovement.improvePrompt(promptInput);
      
      if (result) {
        dispatch({ type: 'SET_IMPROVED_PROMPT', payload: result });
        dispatch({ type: 'SET_REQUEST_COUNT', payload: requestCount + 1 });
      }
    } catch (error) {
      console.error('Error improving prompt:', error);
      dispatch({ type: 'SET_API_ERROR', payload: 'Failed to improve prompt. Please try again.' });
      toast.error('Failed to improve prompt');
    } finally {
      dispatch({ type: 'SET_IS_PROCESSING', payload: false });
    }
  }, [promptInput, requestCount, promptImprovement, dispatch]);
  
  const handleSubmitFeedback = useCallback(async () => {
    if (!currentFeedback.trim()) {
      toast.error('Please enter feedback');
      return;
    }
    
    try {
      dispatch({ type: 'SET_IS_PROCESSING', payload: true });
      dispatch({ type: 'SET_API_ERROR', payload: null });
      
      // Use improvePrompt with feedback parameter instead of nonexistent improveWithFeedback
      const result = await promptImprovement.improvePrompt(improvedPrompt, currentFeedback);
      
      if (result) {
        dispatch({ 
          type: 'ADD_FEEDBACK_HISTORY', 
          payload: { feedback: currentFeedback, result: improvedPrompt } 
        });
        dispatch({ type: 'SET_IMPROVED_PROMPT', payload: result });
        dispatch({ type: 'SET_CURRENT_FEEDBACK', payload: '' });
        dispatch({ type: 'SET_REQUEST_COUNT', payload: requestCount + 1 });
      }
    } catch (error) {
      console.error('Error processing feedback:', error);
      dispatch({ type: 'SET_API_ERROR', payload: 'Failed to process feedback. Please try again.' });
      toast.error('Failed to process feedback');
    } finally {
      dispatch({ type: 'SET_IS_PROCESSING', payload: false });
    }
  }, [currentFeedback, improvedPrompt, requestCount, promptImprovement, dispatch]);
  
  const handleClear = useCallback(() => {
    dispatch({ type: 'RESET_SCANNER' });
  }, [dispatch]);
  
  const handleRevertToPrevious = useCallback(() => {
    if (feedbackHistory.length > 0) {
      const previousPrompt = feedbackHistory[feedbackHistory.length - 1].result;
      dispatch({ type: 'SET_IMPROVED_PROMPT', payload: previousPrompt });
      
      // Remove the last item from history
      const newHistory = [...feedbackHistory];
      newHistory.pop();
      dispatch({ 
        type: 'ADD_FEEDBACK_HISTORY', // Fixed: Changed from SET_FEEDBACK_HISTORY to ADD_FEEDBACK_HISTORY
        payload: newHistory[newHistory.length - 1] || { feedback: '', result: '' }
      });
    }
  }, [feedbackHistory, dispatch]);
  
  const handleAccept = useCallback(() => {
    toast.success('Prompt accepted!');
    // Additional actions when accepting the prompt could be added here
  }, []);
  
  return {
    // State
    promptInput,
    setPromptInput,
    improvedPrompt,
    currentFeedback,
    setCurrentFeedback,
    feedbackHistory,
    requestCount,
    requestLimit,
    isProcessing,
    apiError,
    
    // Actions
    handleInitialScan,
    handleClear,
    handleRevertToPrevious,
    handleAccept,
    handleSubmitFeedback,
  };
};
