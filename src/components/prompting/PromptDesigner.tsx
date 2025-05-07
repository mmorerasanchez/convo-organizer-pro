
import React, { useState } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { usePromptDesigner } from '@/hooks/prompting';
import { AuthenticationRequired } from './designer/AuthenticationRequired';
import { PromptDesignerLayout } from './designer/PromptDesignerLayout';
import { PromptManagerModal } from './designer/PromptManagerModal';
import { AuthLoadingState } from './designer/AuthLoadingState';

const PromptDesigner = () => {
  const { user, loading } = useRequireAuth();
  const [promptResponse, setPromptResponse] = useState<string>('');
  const [isTestingPrompt, setIsTestingPrompt] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [requestLimit] = useState(10); // Free tier limit
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [compiledPrompt, setCompiledPrompt] = useState('');
  
  const {
    activePrompt,
    setActivePrompt,
    createPrompt,
    saveVersion,
    testPrompt,
    compilePromptText
  } = usePromptDesigner();
  
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
        requestLimit={requestLimit}
        saveModalOpen={saveModalOpen}
        setSaveModalOpen={setSaveModalOpen}
        compiledPrompt={compiledPrompt}
        setCompiledPrompt={setCompiledPrompt}
        createPrompt={createPrompt}
        saveVersion={saveVersion}
        testPrompt={testPrompt}
        compilePromptText={compilePromptText}
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
    </>
  );
};

export default PromptDesigner;
