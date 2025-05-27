
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createConversation } from '@/lib/api';
import { toast } from 'sonner';
import { useTagOperations, TagAssignmentParams } from './useTagOperations';
import { getOrCreateSourceTag } from '../utils/tagUtils';
import { Tag } from '@/lib/types';

export const useConversationOperations = (
  selectedProjectId: string, 
  setError: (error: string | null) => void,
  tags: Tag[]
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNavigationConfirm, setShowNavigationConfirm] = useState(false);
  const [newConversationId, setNewConversationId] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { createTagMutation, assignTagMutation } = useTagOperations();

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: (newConversation) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversations', 'project', selectedProjectId] });
      queryClient.invalidateQueries({ queryKey: ['project', selectedProjectId] });
      
      setNewConversationId(newConversation.id);
      setShowNavigationConfirm(true);
      toast.success('Conversation saved successfully to your project', {
        description: 'You can now find it in your project for future reference',
      });
      setIsProcessing(false);
    },
    onError: (error: Error) => {
      console.error('Error saving conversation:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      setError(`Error saving conversation: ${errorMessage}`);
      toast.error(`Error saving conversation: ${errorMessage}`);
      setIsProcessing(false);
    }
  });

  const handleSaveConversation = async (
    title: string,
    content: string,
    responseContent?: string,
    onSuccess?: () => void,
    source?: string
  ) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      if (!selectedProjectId) {
        setError('No project selected');
        setIsProcessing(false);
        return;
      }
      
      console.log('Saving conversation with data:', {
        title: title.trim(),
        content: content.trim(),
        platform: 'Promptito',
        projectId: selectedProjectId,
        type: 'input',
        status: 'Active',
        modelId: null, // Fixed: Use null instead of 'none'
        source: source
      });
      
      // Save the prompt as input
      const promptResult = await createConversationMutation.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        platform: 'Promptito',
        projectId: selectedProjectId,
        type: 'input',
        status: 'Active',
        modelId: null, // Fixed: Use null instead of 'none'
        source: source
      });
      
      console.log('Prompt saved successfully:', promptResult);
      
      // If source is provided, create or find a source tag and assign it
      if (source && promptResult) {
        try {
          const sourceTag = await getOrCreateSourceTag(source, tags, createTagMutation);
          if (sourceTag) {
            await assignTagMutation.mutateAsync({
              conversationId: promptResult.id,
              tagId: sourceTag.id
            });
            console.log('Source tag assigned successfully');
          }
        } catch (tagError) {
          console.error('Error with source tag:', tagError);
          // Don't fail the entire save if tagging fails
        }
      }
      
      // Save the response as output if provided
      if (responseContent) {
        console.log('Saving response content...');
        const responseResult = await createConversationMutation.mutateAsync({
          title: `${title.trim()} (Response)`,
          content: responseContent.trim(),
          platform: 'Promptito',
          projectId: selectedProjectId,
          type: 'output',
          status: 'Active',
          modelId: null, // Fixed: Use null instead of 'none'
          source: source
        });
        
        console.log('Response saved successfully:', responseResult);
        
        // Also tag the response with source if provided
        if (source && responseResult) {
          try {
            const sourceTag = await getOrCreateSourceTag(source, tags, createTagMutation);
            if (sourceTag) {
              await assignTagMutation.mutateAsync({
                conversationId: responseResult.id,
                tagId: sourceTag.id
              });
            }
          } catch (tagError) {
            console.error('Error with response source tag:', tagError);
            // Don't fail the entire save if tagging fails
          }
        }
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      return promptResult;
    } catch (error) {
      console.error('Error in handleSaveConversation:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(`Unexpected error: ${errorMessage}`);
      setIsProcessing(false);
      throw error; // Re-throw to allow parent components to handle
    }
  };
  
  const handleNavigateToConversation = () => {
    if (newConversationId) {
      navigate(`/conversations/${newConversationId}`);
    }
    setShowNavigationConfirm(false);
  };
  
  return {
    isProcessing,
    setIsProcessing,
    showNavigationConfirm,
    setShowNavigationConfirm,
    handleSaveConversation,
    handleNavigateToConversation
  };
};
