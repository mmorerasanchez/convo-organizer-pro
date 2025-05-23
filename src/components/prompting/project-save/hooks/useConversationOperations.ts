
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
      setError(`Error saving conversation: ${error.message}`);
      toast.error(`Error saving conversation: ${error.message}`);
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
      
      // Save the prompt as input
      const promptResult = await createConversationMutation.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        platform: 'Promptito',
        projectId: selectedProjectId,
        type: 'input',
        status: 'Active',
        modelId: 'none',
        source: source
      });
      
      // If source is provided, create or find a source tag and assign it
      if (source && promptResult) {
        const sourceTag = await getOrCreateSourceTag(source, tags, createTagMutation);
        if (sourceTag) {
          await assignTagMutation.mutateAsync({
            conversationId: promptResult.id,
            tagId: sourceTag.id
          });
        }
      }
      
      // Save the response as output if provided
      if (responseContent) {
        const responseResult = await createConversationMutation.mutateAsync({
          title: `${title.trim()} (Response)`,
          content: responseContent.trim(),
          platform: 'Promptito',
          projectId: selectedProjectId,
          type: 'output',
          status: 'Active',
          modelId: 'none',
          source: source
        });
        
        // Also tag the response with source if provided
        if (source && responseResult) {
          const sourceTag = await getOrCreateSourceTag(source, tags, createTagMutation);
          if (sourceTag) {
            await assignTagMutation.mutateAsync({
              conversationId: responseResult.id,
              tagId: sourceTag.id
            });
          }
        }
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      return promptResult;
    } catch (error) {
      console.error('Error in handleSaveConversation:', error);
      setError(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
      setIsProcessing(false);
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
