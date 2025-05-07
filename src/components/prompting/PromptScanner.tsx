
import React from 'react';
import { PromptInputCard } from './PromptInputCard';
import { PromptOutputCard } from './PromptOutputCard';
import { FeedbackDialog } from './FeedbackDialog';
import { PromptScannerHeader } from './scanner/PromptScannerHeader';
import { usePromptScanner } from '@/hooks/use-prompt-scanner';

const PromptScanner = () => {
  const {
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
  } = usePromptScanner();

  return (
    <div className="space-y-6">
      <PromptScannerHeader 
        title="Prompt Scanner"
        currentUsage={requestCount}
        limit={requestLimit}
        apiError={apiError}
      />
      
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
          originalPrompt={promptInput}
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
