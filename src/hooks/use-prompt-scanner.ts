
import { useState, useEffect } from 'react';
import { usePromptImprovement } from '@/hooks/use-prompt-improvement';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function usePromptScanner() {
  const [promptInput, setPromptInput] = useState('');
  const [improvedPrompt, setImprovedPrompt] = useState('');
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState('');
  const [requestCount, setRequestCount] = useState(0);
  const [requestLimit, setRequestLimit] = useState<number | null>(30); // Free tier default
  
  const {
    isProcessing,
    apiError,
    improvePrompt,
  } = usePromptImprovement();

  // Fetch live usage on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase.functions.invoke('usage-status');
      if (!mounted) return;
      if (error) {
        console.warn('usage-status error:', error);
        return;
      }
      if (data) {
        setRequestCount(data.currentUsage ?? 0);
        setRequestLimit(data.limit ?? null);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const refreshUsage = async () => {
    const { data, error } = await supabase.functions.invoke('usage-status');
    if (error) {
      console.warn('usage-status refresh error:', error);
      return;
    }
    if (data) {
      setRequestCount(data.currentUsage ?? 0);
      setRequestLimit(data.limit ?? null);
    }
  };

  const handleImprovePrompt = async (feedback?: string) => {
    try {
      const result = await improvePrompt(promptInput, feedback);
      if (result) {
        setImprovedPrompt(result);
        // Sync usage from server (more accurate than local ++)
        await refreshUsage();
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
  };

  const handleRevertToPrevious = () => {
    // This functionality is handled in the context
    toast.info("Reverted to previous version");
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
    requestLimit: requestLimit ?? Infinity, // TokenUsageDisplay expects a number; treat null as unlimited
    isProcessing,
    
    // Actions
    handleInitialScan,
    handleClear,
    handleRevertToPrevious,
    handleAccept,
    handleSubmitFeedback
  };
}
