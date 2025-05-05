import React, { useState, useEffect } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useFrameworks, useFrameworkFields, useModels } from '@/hooks/use-frameworks';
import { usePromptDesigner } from '@/hooks/prompting';
import { PromptDesignerHeader } from './designer/PromptDesignerHeader';
import { PromptSettings } from './designer/PromptSettings';
import { FrameworkFields } from './designer/FrameworkFields';
import { CompiledPromptPreview } from './designer/CompiledPromptPreview';
import { ModelResponse } from './designer/ModelResponse';
import { AuthenticationRequired } from './designer/AuthenticationRequired';
import { PromptManagerModal } from './designer/PromptManagerModal';
import { useToast } from '@/hooks/use-toast';

const PromptDesigner = () => {
  const { user, loading } = useRequireAuth();
  const { data: frameworks } = useFrameworks();
  const { data: models } = useModels();
  const { toast } = useToast();
  
  const [promptResponse, setPromptResponse] = useState<string>('');
  const [isTestingPrompt, setIsTestingPrompt] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [requestLimit] = useState(10); // Free tier limit
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  
  const {
    activePrompt,
    setActivePrompt,
    createPrompt,
    saveVersion,
    testPrompt,
    compilePromptText
  } = usePromptDesigner();

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
  }, [activePrompt.frameworkId, frameworkFields]);
  
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
  
  // Handle prompt save
  const handleSavePrompt = async (): Promise<boolean> => {
    try {
      if (!activePrompt.frameworkId) {
        toast({
          variant: "destructive",
          title: "Framework Required",
          description: "Please select a framework for your prompt."
        });
        return false;
      }
      
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
      
      // Update request count instead of token usage
      setRequestCount(prev => prev + 1);
      
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
  
  // If loading auth, show spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If user is not authenticated, show login message
  if (!user) {
    return <AuthenticationRequired />;
  }

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
              handleSavePrompt={handleSavePrompt}
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
            compiledPrompt={compilePromptText(activePrompt.fieldValues)} 
          />
          
          <ModelResponse promptResponse={promptResponse} />
        </div>
      </div>
      
      <PromptManagerModal
        open={saveModalOpen}
        onOpenChange={setSaveModalOpen}
        activePrompt={activePrompt}
        onSave={handleSavePrompt}
      />
    </div>
  );
};

export default PromptDesigner;
