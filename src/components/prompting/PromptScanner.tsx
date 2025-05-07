
import React, { useState } from 'react';
import { PromptInputCard } from './PromptInputCard';
import { PromptOutputCard } from './PromptOutputCard';
import { FeedbackDialog } from './FeedbackDialog';
import { PromptScannerHeader } from './scanner/PromptScannerHeader';
import { usePromptScanner } from '@/hooks/use-prompt-scanner';
import { SaveToProjectDialog } from './SaveToProjectDialog';
import { Dialog } from '@/components/ui/dialog';

const PromptScanner = () => {
  const [saveToProjectDialogOpen, setSaveToProjectDialogOpen] = useState(false);
  
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
          onSave={() => setSaveToProjectDialogOpen(true)}
        />
      </div>

      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <FeedbackDialog
          open={feedbackDialogOpen}
          onOpenChange={setFeedbackDialogOpen}
          feedback={currentFeedback}
          onFeedbackChange={setCurrentFeedback}
          onSubmit={handleSubmitFeedback}
        />
      </Dialog>
      
      <Dialog open={saveToProjectDialogOpen} onOpenChange={setSaveToProjectDialogOpen}>
        <SaveToProjectDialog
          open={saveToProjectDialogOpen}
          onOpenChange={setSaveToProjectDialogOpen}
          promptTitle="Improved Prompt"
          promptContent={improvedPrompt}
          responseContent={promptInput}
          onSaveComplete={() => {
            // Actions after saving if needed
          }}
        />
      </Dialog>
    </div>
  );
};

export default PromptScanner;
