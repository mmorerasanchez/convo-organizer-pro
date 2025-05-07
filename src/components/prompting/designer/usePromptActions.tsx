
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PromptState, TestPromptParams, TestPromptResult } from '@/hooks/prompting';
import { UseMutationResult } from '@tanstack/react-query';

interface UsePromptActionsProps {
  activePrompt: PromptState;
  setActivePrompt: (prompt: PromptState) => void;
  setPromptResponse: (response: string) => void;
  setIsTestingPrompt: (isLoading: boolean) => void;
  setRequestCount: React.Dispatch<React.SetStateAction<number>>;
  setSaveModalOpen: (isOpen: boolean) => void;
  compilePromptText: (promptState: PromptState) => string;
  setCompiledPrompt: (prompt: string) => void;
  testPrompt: UseMutationResult<TestPromptResult, Error, TestPromptParams, unknown>;
}

export const usePromptActions = ({
  activePrompt,
  setActivePrompt,
  setPromptResponse,
  setIsTestingPrompt,
  setRequestCount,
  setSaveModalOpen,
  compilePromptText,
  setCompiledPrompt,
  testPrompt,
}: UsePromptActionsProps) => {
  const { toast } = useToast();

  const handleSavePrompt = () => {
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
      setRequestCount(prev => prev + 1);
      
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

  const handleFieldChange = (fieldName: string, value: string) => {
    setActivePrompt({
      ...activePrompt,
      fieldValues: { ...activePrompt.fieldValues, [fieldName]: value }
    });
  };

  return {
    handleSavePrompt,
    handleTestPrompt,
    handleClear,
    handleFieldChange,
  };
};
