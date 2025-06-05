
import React, { useEffect } from 'react';
import { useFrameworks, useFrameworkFields } from '@/hooks/use-frameworks';
import { PromptDesignerHeader } from './PromptDesignerHeader';
import { PromptState, TestPromptParams, TestPromptResult } from '@/hooks/prompting';
import { UseMutationResult } from '@tanstack/react-query';
import { PromptDesignerContainer } from './PromptDesignerContainer';
import { usePromptActions } from './usePromptActions';

interface PromptDesignerLayoutProps {
  activePrompt: PromptState;
  setActivePrompt: (prompt: PromptState) => void;
  promptResponse: string;
  setPromptResponse: (response: string) => void;
  isTestingPrompt: boolean;
  setIsTestingPrompt: (isTesting: boolean) => void;
  requestCount: number;
  setRequestCount: React.Dispatch<React.SetStateAction<number>>;
  requestLimit: number;
  saveModalOpen: boolean;
  setSaveModalOpen: (open: boolean) => void;
  compiledPrompt: string;
  setCompiledPrompt: (prompt: string) => void;
  createPrompt: UseMutationResult<any, any, any, any>;
  saveVersion: UseMutationResult<any, any, any, any>;
  testPrompt: UseMutationResult<TestPromptResult, Error, TestPromptParams, unknown>;
  compilePromptText: (promptState: PromptState) => string;
  onSaveToProject?: () => void;
}

export function PromptDesignerLayout({
  activePrompt,
  setActivePrompt,
  promptResponse,
  setPromptResponse,
  isTestingPrompt,
  setIsTestingPrompt,
  requestCount,
  setRequestCount,
  requestLimit,
  saveModalOpen,
  setSaveModalOpen,
  compiledPrompt,
  setCompiledPrompt,
  createPrompt,
  saveVersion,
  testPrompt,
  compilePromptText,
  onSaveToProject
}: PromptDesignerLayoutProps) {
  const { data: frameworks = [] } = useFrameworks();
  
  // Get framework-specific fields when framework changes
  const { data: frameworkFields = [] } = useFrameworkFields(
    activePrompt?.frameworkId || undefined
  );
  
  // Compile the prompt text whenever prompt state changes
  useEffect(() => {
    if (activePrompt) {
      const compiled = compilePromptText(activePrompt);
      setCompiledPrompt(compiled);
    }
  }, [activePrompt, compilePromptText, setCompiledPrompt]);
  
  // Extract handler functions to a custom hook
  const {
    handleSavePrompt,
    handleTestPrompt,
    handleClear,
    handleFieldChange
  } = usePromptActions({
    activePrompt,
    setActivePrompt,
    setPromptResponse,
    setIsTestingPrompt,
    setRequestCount,
    setSaveModalOpen,
    compilePromptText,
    setCompiledPrompt,
    testPrompt
  });
  
  // If activePrompt is null, return a loading state or empty UI
  if (!activePrompt) {
    return <div className="flex justify-center items-center h-64">Loading prompt designer...</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Header section with actions */}
      <PromptDesignerHeader
        handleNewPrompt={handleClear}
        tokenUsage={requestCount}
        tokenLimit={requestLimit}
      />
      
      <PromptDesignerContainer
        activePrompt={activePrompt}
        setActivePrompt={setActivePrompt}
        promptResponse={promptResponse}
        compiledPrompt={compiledPrompt}
        frameworks={frameworks}
        models={[]} // Remove models dependency since we use enhanced selector
        frameworkFields={frameworkFields}
        isTestingPrompt={isTestingPrompt}
        handleFieldChange={handleFieldChange}
        handleSavePrompt={handleSavePrompt}
        handleTestPrompt={handleTestPrompt}
        handleClear={handleClear}
        onSaveToProject={onSaveToProject}
      />
    </div>
  );
}
