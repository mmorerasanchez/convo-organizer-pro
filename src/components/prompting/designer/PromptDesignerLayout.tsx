
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
  setCompiledPrompt: (compiled: string) => void;
  createPrompt: UseMutationResult<any, Error, PromptState>;
  saveVersion: UseMutationResult<any, Error, PromptState>;
  testPrompt: UseMutationResult<any, Error, any>;
  compilePromptText: (fieldValues: Record<string, string>) => string;
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
  setSaveModalOpen,
  compiledPrompt,
  setCompiledPrompt,
  testPrompt,
  compilePromptText
}: PromptDesignerLayoutProps) {
  const { data: frameworks } = useFrameworks();
  const { data: models } = useModels();
  const { toast } = useToast();
  const { data: frameworkFields } = useFrameworkFields(activePrompt.frameworkId);

  // If framework changes, reset field values
  useEffect(() => {
    if (activePrompt.frameworkId && frameworkFields && frameworkFields.length > 0) {
      const newFieldValues = { ...activePrompt.fieldValues };
      
      // Initialize empty fields for any missing ones
      frameworkFields.forEach(field => {
        if (!newFieldValues[field.label]) {
          newFieldValues[field.label] = '';
        }
      });
      
      setActivePrompt({ ...activePrompt, fieldValues: newFieldValues });
    }
  }, [activePrompt.frameworkId, frameworkFields, setActivePrompt]);

  // Update compiled prompt whenever field values change
  useEffect(() => {
    if (activePrompt.fieldValues) {
      const compiled = compilePromptText(activePrompt.fieldValues);
      setCompiledPrompt(compiled);
    }
  }, [activePrompt.fieldValues, compilePromptText, setCompiledPrompt]);
  
  // Handle field value changes
  const handleFieldChange = (fieldName: string, value: string) => {
    setActivePrompt({
      ...activePrompt,
      fieldValues: {
        ...activePrompt.fieldValues,
        [fieldName]: value
      }
    });
  };
  
  // Handle prompt test
  const handleTestPrompt = async () => {
    try {
      setIsTestingPrompt(true);
      
      if (!activePrompt.modelId) {
        toast({
          variant: "destructive",
          title: "Model Required",
          description: "Please select a model for testing."
        });
        return;
      }
      
      const compiledPrompt = compilePromptText(activePrompt.fieldValues);
      
      const selectedModel = models?.find(m => m.id === activePrompt.modelId);
      const modelName = selectedModel?.provider === 'OpenAI' ? 'gpt-4o' : 'gpt-4o'; // Default to GPT-4o
      
      const result = await testPrompt.mutateAsync({
        versionId: activePrompt.id ? undefined : undefined,  // Only store test results for saved versions
        prompt: compiledPrompt,
        model: modelName,
        temperature: activePrompt.temperature,
        maxTokens: activePrompt.maxTokens
      });
      
      setPromptResponse(result.completion);
      
      // Update request count instead of token usage - THIS IS THE FIX
      setRequestCount((prevCount) => prevCount + 1);
      
      toast({
        title: "Response Generated",
        description: `Response generated in ${result.response_ms}ms`
      });
    } catch (error) {
      console.error("Error testing prompt:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Failed to generate response. Check your inputs and try again."
      });
    } finally {
      setIsTestingPrompt(false);
    }
  };
  
  // Handle new prompt creation
  const handleNewPrompt = () => {
    setActivePrompt({
      title: 'Untitled Prompt',
      frameworkId: null,
      fieldValues: {},
      temperature: 0.7,
      maxTokens: 1000,
      modelId: null
    });
    setPromptResponse('');
  };

  return (
    <div className="space-y-6">
      <PromptDesignerHeader 
        handleNewPrompt={handleNewPrompt} 
        tokenUsage={requestCount}
        tokenLimit={requestLimit}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Section */}
        <div className="space-y-6">
          <PromptSettings 
            activePrompt={activePrompt}
            setActivePrompt={setActivePrompt}
            frameworks={frameworks}
            models={models}
          />
          
          {activePrompt.frameworkId && frameworkFields?.length > 0 && (
            <FrameworkFields
              activePrompt={activePrompt}
              frameworkFields={frameworkFields}
              frameworks={frameworks}
              handleFieldChange={handleFieldChange}
              handleSavePrompt={() => setSaveModalOpen(true)}
              handleTestPrompt={handleTestPrompt}
              isTestingPrompt={isTestingPrompt}
              showSaveModal={() => setSaveModalOpen(true)}
              handleNewPrompt={handleNewPrompt}
            />
          )}
        </div>
        
        {/* Preview Section */}
        <div className="space-y-6">
          <CompiledPromptPreview 
            compiledPrompt={compiledPrompt} 
          />
          
          <ModelResponse 
            promptResponse={promptResponse} 
            compiledPrompt={compiledPrompt}
          />
        </div>
      </div>
    </div>
  );
}
