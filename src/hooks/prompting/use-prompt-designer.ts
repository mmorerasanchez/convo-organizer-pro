
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import React from 'react';
import { PromptState, TestPromptParams, TestPromptResult } from './types';
import { 
  fetchPrompts, 
  createNewPrompt, 
  savePromptVersion, 
  deletePromptById, 
  testPromptRequest,
  compilePromptText
} from './prompt-api';
import { createEmptyPrompt } from './prompt-utils';

export { compilePromptText } from './prompt-api';
export type { PromptState, TestPromptParams, TestPromptResult } from './types';

export function usePromptDesigner() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // State for the currently active prompt - initialize with empty prompt
  const [activePrompt, setActivePrompt] = React.useState<PromptState>(createEmptyPrompt());
  
  // Fetch user's prompts
  const { data: prompts = [] } = useQuery({
    queryKey: ['prompts', user?.id],
    queryFn: () => fetchPrompts(user?.id),
    enabled: !!user
  });
  
  // Create a new prompt
  const createPrompt = useMutation({
    mutationFn: async (promptData: PromptState) => {
      if (!user) throw new Error('User not authenticated');
      return createNewPrompt(promptData, user.id);
    },
    onSuccess: (data) => {
      toast.success('Prompt created successfully');
      // Update the active prompt with the newly created prompt
      setActivePrompt({
        ...activePrompt,
        id: data.id
      });
      queryClient.invalidateQueries({ queryKey: ['prompts', user?.id] });
    },
    onError: (error) => {
      console.error('Error creating prompt:', error);
      toast.error('Failed to create prompt');
    }
  });
  
  // Save a new version of an existing prompt
  const saveVersion = useMutation({
    mutationFn: savePromptVersion,
    onSuccess: () => {
      toast.success('New version saved');
      queryClient.invalidateQueries({ queryKey: ['prompts', user?.id] });
    },
    onError: (error) => {
      console.error('Error saving version:', error);
      toast.error('Failed to save version');
    }
  });
  
  // Delete a prompt
  const deletePrompt = useMutation({
    mutationFn: deletePromptById,
    onSuccess: () => {
      toast.success('Prompt deleted');
      queryClient.invalidateQueries({ queryKey: ['prompts', user?.id] });
    },
    onError: (error) => {
      console.error('Error deleting prompt:', error);
      toast.error('Failed to delete prompt');
    }
  });
  
  // Test a prompt
  const testPrompt = useMutation<TestPromptResult, Error, TestPromptParams>({
    mutationFn: testPromptRequest,
    onError: (error) => {
      console.error('Error testing prompt:', error);
      toast.error('Failed to test prompt');
    }
  });
  
  return {
    activePrompt,
    setActivePrompt,
    prompts,
    createPrompt,
    saveVersion,
    deletePrompt,
    testPrompt,
    compilePromptText
  };
}
