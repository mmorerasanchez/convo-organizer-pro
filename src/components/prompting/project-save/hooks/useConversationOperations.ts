
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createConversation } from '@/lib/api';
import { toast } from 'sonner';
import { useTagOperations, TagAssignmentParams } from './useTagOperations';
import { getOrCreateSourceTag } from '../utils/tagUtils';
import { Tag } from '@/lib/types';
import { errorHandler, AppError, LogLevel } from '@/lib/utils/errorHandler';

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

  // Create conversation mutation with improved error handling
  const createConversationMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: (newConversation) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversations', 'project', selectedProjectId] });
      queryClient.invalidateQueries({ queryKey: ['project', selectedProjectId] });
      
      setNewConversationId(newConversation.id);
      setShowNavigationConfirm(true);
      
      errorHandler.handleSuccess(
        'Conversation saved successfully!',
        'You can now find it in your project for future reference'
      );
      setIsProcessing(false);
    },
    onError: (error: Error) => {
      errorHandler.log(new AppError(error.message, LogLevel.ERROR, {
        component: 'useConversationOperations',
        action: 'createConversation',
        metadata: { selectedProjectId }
      }));
      
      setError(errorHandler.getUserFriendlyMessage(error.message));
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
        throw new AppError('No project selected', LogLevel.ERROR, {
          component: 'useConversationOperations',
          action: 'handleSaveConversation'
        });
      }

      // Validate inputs
      if (!title.trim()) {
        throw new AppError('Conversation title is required', LogLevel.ERROR, {
          component: 'useConversationOperations',
          action: 'handleSaveConversation'
        });
      }

      if (!content.trim()) {
        throw new AppError('Conversation content is required', LogLevel.ERROR, {
          component: 'useConversationOperations',
          action: 'handleSaveConversation'
        });
      }
      
      errorHandler.handleInfo('Starting conversation save process', {
        component: 'useConversationOperations',
        action: 'handleSaveConversation',
        metadata: {
          title: title.trim(),
          hasResponseContent: !!responseContent,
          source,
          projectId: selectedProjectId
        }
      });
      
      // Save the prompt as input - Fixed: Use null instead of 'none' for modelId
      const promptData = {
        title: title.trim(),
        content: content.trim(),
        platform: 'Promptito',
        projectId: selectedProjectId,
        type: 'input' as const,
        status: 'Active',
        modelId: null, // Always use null instead of 'none'
        source: source
      };

      const promptResult = await createConversationMutation.mutateAsync(promptData);
      
      errorHandler.handleInfo('Prompt saved successfully', {
        component: 'useConversationOperations',
        metadata: { promptId: promptResult.id }
      });
      
      // Handle source tagging with improved error handling
      if (source && promptResult) {
        try {
          const sourceTag = await getOrCreateSourceTag(source, tags, createTagMutation);
          if (sourceTag) {
            await assignTagMutation.mutateAsync({
              conversationId: promptResult.id,
              tagId: sourceTag.id
            });
            errorHandler.handleInfo('Source tag assigned successfully');
          }
        } catch (tagError) {
          // Log tag error but don't fail the entire save
          errorHandler.log(new AppError(
            `Failed to create/assign source tag: ${tagError instanceof Error ? tagError.message : 'Unknown error'}`,
            LogLevel.WARN,
            {
              component: 'useConversationOperations',
              action: 'sourceTagging',
              metadata: { source, promptId: promptResult.id }
            }
          ));
        }
      }
      
      // Save the response as output if provided
      if (responseContent && responseContent.trim()) {
        try {
          errorHandler.handleInfo('Saving response content...');
          
          const responseData = {
            title: `${title.trim()} (Response)`,
            content: responseContent.trim(),
            platform: 'Promptito',
            projectId: selectedProjectId,
            type: 'output' as const,
            status: 'Active',
            modelId: null, // Always use null instead of 'none'
            source: source
          };

          const responseResult = await createConversationMutation.mutateAsync(responseData);
          
          errorHandler.handleInfo('Response saved successfully', {
            component: 'useConversationOperations',
            metadata: { responseId: responseResult.id }
          });
          
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
              // Log but don't fail
              errorHandler.log(new AppError(
                `Failed to tag response: ${tagError instanceof Error ? tagError.message : 'Unknown error'}`,
                LogLevel.WARN,
                {
                  component: 'useConversationOperations',
                  action: 'responseTagging',
                  metadata: { source, responseId: responseResult.id }
                }
              ));
            }
          }
        } catch (responseError) {
          // Log response save error but don't fail entire operation
          errorHandler.log(new AppError(
            `Failed to save response: ${responseError instanceof Error ? responseError.message : 'Unknown error'}`,
            LogLevel.WARN,
            {
              component: 'useConversationOperations',
              action: 'saveResponse'
            }
          ));
        }
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      return promptResult;
    } catch (error) {
      errorHandler.handleApiError(error, {
        component: 'useConversationOperations',
        action: 'handleSaveConversation',
        metadata: { selectedProjectId, source }
      });
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
