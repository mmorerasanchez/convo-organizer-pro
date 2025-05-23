
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTag, assignTagToConversation } from '@/lib/api/tags';

// Define a proper type for tag assignment
export type TagAssignmentParams = {
  conversationId: string;
  tagId: string;
};

export const useTagOperations = () => {
  const queryClient = useQueryClient();

  // Create tag mutation
  const createTagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
    onError: (error: Error) => {
      console.error('Error creating tag:', error);
      // Continue with saving even if tag creation fails
    }
  });

  // Assign tag to conversation mutation - fixed with proper parameter type
  const assignTagMutation = useMutation({
    mutationFn: ({ conversationId, tagId }: TagAssignmentParams) => 
      assignTagToConversation(conversationId, tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: Error) => {
      console.error('Error assigning tag to conversation:', error);
      // Continue even if tag assignment fails
    }
  });

  return {
    createTagMutation,
    assignTagMutation
  };
};
