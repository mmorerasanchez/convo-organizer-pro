
import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePromptImprovement } from '@/hooks/use-prompt-improvement';
import { PromptInputCard } from './PromptInputCard';
import { PromptOutputCard } from './PromptOutputCard';
import { FeedbackDialog } from './FeedbackDialog';
import { useToast } from '@/hooks/use-toast';
import { TokenUsageDisplay } from './designer/TokenUsageDisplay';

const PromptScanner = () => {
  const [promptInput, setPromptInput] = useState('');
  const [improvedPrompt, setImprovedPrompt] = useState('');
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState('');
  const [tokenUsage, setTokenUsage] = useState(0);
  const [tokenLimit] = useState(10); // Free tier limit
  const { toast } = useToast();
  
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
        
        // Increment token usage (approximation - we don't get actual token counts from the API)
        setTokenUsage(prev => prev + Math.ceil(promptInput.length / 4) + Math.ceil(result.length / 4));
      }
    } catch (error) {
      console.error('Error in handleImprovePrompt:', error);
    }
  };

  const handleInitialScan = () => {
    if (!promptInput.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a prompt to improve.",
      });
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
      
      toast({
        title: "Reverted to Previous Version",
        description: "You've returned to the previous prompt improvement.",
      });
    }
  };

  const handleAccept = () => {
    if (!improvedPrompt) return;
    
    navigator.clipboard.writeText(improvedPrompt).then(() => {
      toast({
        title: "Prompt Accepted",
        description: "The improved prompt has been copied to your clipboard and is ready to use.",
      });
    }).catch(err => {
      console.error('Failed to copy to clipboard:', err);
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Unable to copy to clipboard. Please try again or copy manually.",
      });
    });
  };

  const handleSubmitFeedback = () => {
    if (currentFeedback.trim()) {
      handleImprovePrompt(currentFeedback);
      setFeedbackDialogOpen(false);
      setCurrentFeedback('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Prompt Scanner</h2>
        <TokenUsageDisplay currentUsage={tokenUsage} limit={tokenLimit} />
      </div>
      
      {apiError && (
        <Alert variant="destructive" className="rounded-lg border shadow-sm">
          <AlertDescription>
            {apiError.includes("quota") 
              ? "OpenAI API quota exceeded. The service is temporarily unavailable. Please try again later."
              : apiError.includes("internet") || apiError.includes("connection") 
                ? "Error: Please make sure you have an active internet connection and try again."
                : `Error: ${apiError}. Please try again later.`
            }
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PromptInputCard
          promptInput={promptInput}
          onChange={setPromptInput}
          onScan={handleInitialScan}
          onClear={handleClear}
          isProcessing={isProcessing}
        />

        <PromptOutputCard
          improvedPrompt={improvedPrompt}
          onTryAgain={() => setFeedbackDialogOpen(true)}
          onRevert={handleRevertToPrevious}
          onAccept={handleAccept}
          isProcessing={isProcessing}
          canRevert={feedbackHistory.length > 0}
        />
      </div>

      <FeedbackDialog
        open={feedbackDialogOpen}
        onOpenChange={setFeedbackDialogOpen}
        feedback={currentFeedback}
        onFeedbackChange={setCurrentFeedback}
        onSubmit={handleSubmitFeedback}
      />
    </div>
  );
};

export default PromptScanner;
