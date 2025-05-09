
import { useCallback } from 'react';
import { toast } from 'sonner';
import { usePromptingContext } from './PromptingContext';
import { 
  usePromptDesigner as useOriginalPromptDesigner, 
  compilePromptText,
  PromptState,
  TestPromptParams
} from '@/hooks/prompting';
import { createEmptyPrompt } from '@/hooks/prompting/prompt-utils';

export const usePromptDesignerContext = () => {
  const { state, dispatch } = usePromptingContext();
  const {
    createPrompt,
    saveVersion,
    deletePrompt,
    testPrompt,
    prompts
  } = useOriginalPromptDesigner();
  
  const {
    activeDesignerPrompt,
    promptResponse,
    compiledPrompt,
    isTestingPrompt,
    designerRequestCount
  } = state;
  
  const setActivePrompt = useCallback((prompt: PromptState) => {
    dispatch({ type: 'SET_ACTIVE_DESIGNER_PROMPT', payload: prompt });
    
    // Update compiled prompt when active prompt changes
    const compiled = compilePromptText(prompt);
    dispatch({ type: 'SET_COMPILED_PROMPT', payload: compiled });
  }, [dispatch]);
  
  const setPromptResponse = useCallback((response: string) => {
    dispatch({ type: 'SET_PROMPT_RESPONSE', payload: response });
  }, [dispatch]);
  
  const setCompiledPrompt = useCallback((prompt: string) => {
    dispatch({ type: 'SET_COMPILED_PROMPT', payload: prompt });
  }, [dispatch]);
  
  const setIsTestingPrompt = useCallback((isTesting: boolean) => {
    dispatch({ type: 'SET_IS_TESTING_PROMPT', payload: isTesting });
  }, [dispatch]);
  
  const setDesignerRequestCount = useCallback((count: number) => {
    dispatch({ type: 'SET_DESIGNER_REQUEST_COUNT', payload: count });
  }, [dispatch]);
  
  const handleTestPrompt = useCallback(async () => {
    if (!activeDesignerPrompt || !activeDesignerPrompt.modelId) {
      toast.error('Please select a model before testing');
      return;
    }
    
    try {
      setIsTestingPrompt(true);
      
      const testParams: TestPromptParams = {
        modelId: activeDesignerPrompt.modelId,
        prompt: compiledPrompt,
        temperature: activeDesignerPrompt.temperature,
        maxTokens: activeDesignerPrompt.maxTokens,
      };
      
      if (activeDesignerPrompt.id) {
        testParams.versionId = activeDesignerPrompt.id;
      }
      
      const result = await testPrompt.mutateAsync(testParams);
      
      setPromptResponse(result.completion);
      setDesignerRequestCount(designerRequestCount + 1);
    } catch (error) {
      console.error('Error testing prompt:', error);
      toast.error('Failed to test prompt');
    } finally {
      setIsTestingPrompt(false);
    }
  }, [activeDesignerPrompt, compiledPrompt, designerRequestCount, testPrompt.mutateAsync, setIsTestingPrompt, setPromptResponse, setDesignerRequestCount]);
  
  const handleClear = useCallback(() => {
    dispatch({ type: 'RESET_DESIGNER' });
    // Initialize with a new empty prompt immediately after reset
    setActivePrompt(createEmptyPrompt());
  }, [dispatch, setActivePrompt]);
  
  return {
    // State
    activePrompt: activeDesignerPrompt,
    setActivePrompt,
    promptResponse,
    setPromptResponse,
    compiledPrompt,
    setCompiledPrompt,
    isTestingPrompt,
    setIsTestingPrompt,
    requestCount: designerRequestCount,
    setRequestCount: setDesignerRequestCount,
    
    // Original functions from usePromptDesigner
    prompts,
    createPrompt,
    saveVersion,
    deletePrompt,
    testPrompt,
    compilePromptText,
    
    // Additional actions
    handleTestPrompt,
    handleClear,
  };
};
