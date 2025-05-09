
import React, { useState, useEffect } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { createEmptyPrompt } from '@/hooks/prompting/prompt-utils';
import { usePromptDesignerContext } from './context/usePromptDesigner';
import { AuthenticationRequired } from './designer/AuthenticationRequired';
import { PromptDesignerLayout } from './designer/PromptDesignerLayout';
import { PromptManagerModal } from './designer/PromptManagerModal';
import { AuthLoadingState } from './designer/AuthLoadingState';
import { SaveToProjectDialog } from './SaveToProjectDialog';

const PromptDesigner = () => {
  const { user, loading } = useRequireAuth();
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveToProjectDialogOpen, setSaveToProjectDialogOpen] = useState(false);
  
  const {
    activePrompt,
    setActivePrompt,
    promptResponse,
    setPromptResponse,
    compiledPrompt,
    setCompiledPrompt,
    isTestingPrompt,
    setIsTestingPrompt,
    requestCount,
    setRequestCount,
    createPrompt,
    saveVersion,
    testPrompt,
    compilePromptText,
    handleTestPrompt,
    handleClear
  } = usePromptDesignerContext();
  
  // Initialize with empty prompt if none exists
  useEffect(() => {
    if (!activePrompt && !loading && user) {
      setActivePrompt(createEmptyPrompt());
    }
  }, [activePrompt, loading, user, setActivePrompt]);
  
  // If loading auth, show spinner
  if (loading) {
    return <AuthLoadingState />;
  }
  
  // If user is not authenticated, show login message
  if (!user) {
    return <AuthenticationRequired />;
  }

  return (
    <>
      <PromptDesignerLayout
        activePrompt={activePrompt}
        setActivePrompt={setActivePrompt}
        promptResponse={promptResponse}
        setPromptResponse={setPromptResponse}
        isTestingPrompt={isTestingPrompt}
        setIsTestingPrompt={setIsTestingPrompt}
        requestCount={requestCount}
        setRequestCount={setRequestCount}
        requestLimit={10}
        saveModalOpen={saveModalOpen}
        setSaveModalOpen={setSaveModalOpen}
        compiledPrompt={compiledPrompt}
        setCompiledPrompt={setCompiledPrompt}
        createPrompt={createPrompt}
        saveVersion={saveVersion}
        testPrompt={testPrompt}
        compilePromptText={compilePromptText}
        onSaveToProject={() => setSaveToProjectDialogOpen(true)}
      />
      
      <PromptManagerModal
        open={saveModalOpen}
        onOpenChange={setSaveModalOpen}
        activePrompt={activePrompt}
        onSave={async () => {
          try {
            if (activePrompt.id) {
              await saveVersion.mutateAsync(activePrompt);
            } else {
              await createPrompt.mutateAsync(activePrompt);
            }
            return true;
          } catch (error) {
            console.error("Error saving prompt:", error);
            return false;
          }
        }}
      />
      
      <SaveToProjectDialog
        open={saveToProjectDialogOpen}
        onOpenChange={setSaveToProjectDialogOpen}
        promptTitle={activePrompt?.title || "Untitled Prompt"}
        promptContent={compiledPrompt}
        responseContent={promptResponse}
        onSaveComplete={() => {
          // Additional actions after saving if needed
        }}
      />
    </>
  );
};

export default PromptDesigner;
