
import React, { useEffect } from 'react';
import { useFrameworks, useFrameworkFields, useModels } from '@/hooks/use-frameworks';
import { PromptDesignerHeader } from './PromptDesignerHeader';
import { PromptSettings } from './PromptSettings';
import { FrameworkFields } from './FrameworkFields';
import { CompiledPromptPreview } from './CompiledPromptPreview';
import { ModelResponse } from './ModelResponse';
import { PromptState } from '@/hooks/prompting';
import { useToast } from '@/hooks/use-toast';
import { UseMutationResult } from '@tanstack/react-query';
import { TestPromptParams, TestPromptResult } from '@/hooks/prompting/types';

interface PromptDesignerLayoutProps {
  activePrompt: PromptState;
  setActivePrompt: (prompt: PromptState) => void;
  promptResponse: string;
  setPromptResponse: (response: string) => void;
  isTestingPrompt: boolean;
  setIsTestingPrompt: (isTesting: boolean) => void;
  requestCount: number;
  setRequestCount: (count: number) => void;
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
  const { toast } = useToast();
  const { data: frameworks = [] } = useFrameworks();
  const { data: models = [] } = useModels();
  
  // Get framework-specific fields when framework changes
  const { data: frameworkFields = [] } = useFrameworkFields(
    activePrompt.frameworkId || undefined
  );
  
  // Compile the prompt text whenever prompt state changes
  useEffect(() => {
    const compiled = compilePromptText(activePrompt);
    setCompiledPrompt(compiled);
  }, [activePrompt, compilePromptText, setCompiledPrompt]);
  
  const handleSavePrompt = async () => {
    if (!activePrompt.title.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a title for your prompt."
      });
      return;
    }
    
    setSaveModalOpen(true);
  };
  
  const handleTestPrompt = async () => {
    if (!activePrompt.modelId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a model before testing."
      });
      return;
    }
    
    const compiled = compilePromptText(activePrompt);
    setCompiledPrompt(compiled);
    
    setIsTestingPrompt(true);
    setPromptResponse('');
    
    try {
      const response = await testPrompt.mutateAsync({
        modelId: activePrompt.modelId,
        prompt: compiled
      });
      
      setPromptResponse(response.completion || 'No response received.');
      setRequestCount(requestCount + 1);
      
      toast({
        title: "Test Completed",
        description: "The model has responded to your prompt."
      });
    } catch (error) {
      console.error('Error testing prompt:', error);
      toast({
        variant: "destructive",
        title: "Test Failed",
        description: error instanceof Error ? error.message : "An error occurred while testing the prompt."
      });
    } finally {
      setIsTestingPrompt(false);
    }
  };
  
  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear this prompt? All unsaved changes will be lost.")) {
      setActivePrompt({
        id: '',
        title: '',
        frameworkId: null,
        fieldValues: {},
        temperature: 0.7,
        maxTokens: 1000,
        modelId: null
      });
      setPromptResponse('');
      setCompiledPrompt('');
    }
  };
  
  // For compatibility with the PromptDesignerHeader component
  const handleNewPrompt = () => handleClear();
  
  return (
    <div className="space-y-6">
      {/* Header section with actions */}
      <PromptDesignerHeader
        handleNewPrompt={handleNewPrompt}
        tokenUsage={requestCount}
        tokenLimit={requestLimit}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column - Prompt Designer */}
        <div className="space-y-6">
          {/* Prompt Settings */}
          <PromptSettings 
            activePrompt={activePrompt}
            setActivePrompt={setActivePrompt}
            frameworks={frameworks}
            models={models}
          />
          
          {/* Framework Fields - show only if a framework is selected */}
          {activePrompt.frameworkId && (
            <FrameworkFields 
              activePrompt={activePrompt}
              frameworkFields={frameworkFields}
              frameworks={frameworks}
              handleFieldChange={(fieldName: string, value: string) => {
                setActivePrompt({
                  ...activePrompt,
                  fieldValues: { ...activePrompt.fieldValues, [fieldName]: value }
                });
              }}
              handleSavePrompt={handleSavePrompt}
              handleTestPrompt={handleTestPrompt}
              isTestingPrompt={isTestingPrompt}
              showSaveModal={() => setSaveModalOpen(true)}
              handleNewPrompt={handleNewPrompt}
            />
          )}
          
          {/* Compiled Prompt Preview */}
          <CompiledPromptPreview 
            compiledPrompt={compiledPrompt} 
          />
        </div>
        
        {/* Right column - Model Response */}
        <div className="space-y-6">
          <ModelResponse 
            promptResponse={promptResponse}
            compiledPrompt={compiledPrompt}
            onSaveToProject={onSaveToProject}
          />
        </div>
      </div>
    </div>
  );
}
