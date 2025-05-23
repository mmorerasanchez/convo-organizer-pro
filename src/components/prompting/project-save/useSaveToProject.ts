
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '@/lib/api';
import { fetchTags } from '@/lib/api/tags';
import { useProjectOperations } from './hooks/useProjectOperations';
import { useConversationOperations } from './hooks/useConversationOperations';

export const useSaveToProject = () => {
  const [error, setError] = useState<string | null>(null);
  
  // Fetch projects for the dropdown
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  });

  // Fetch tags for source tags
  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags
  });
  
  // Project operations
  const {
    selectedProjectId,
    setSelectedProjectId,
    newProjectName,
    setNewProjectName,
    newProjectDescription,
    setNewProjectDescription,
    showNewProjectForm,
    setShowNewProjectForm,
    createProjectMutation
  } = useProjectOperations();
  
  // Conversation operations
  const {
    isProcessing,
    setIsProcessing,
    showNavigationConfirm,
    setShowNavigationConfirm,
    handleSaveConversation,
    handleNavigateToConversation
  } = useConversationOperations(selectedProjectId, setError, tags);
  
  // Handle project creation if needed before saving conversation
  const handleSaveWithProjectCheck = async (
    title: string,
    content: string,
    responseContent?: string,
    onSuccess?: () => void,
    source?: string
  ) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      // Create a new project if needed
      if (showNewProjectForm) {
        if (!newProjectName.trim()) {
          setError('Project name is required');
          setIsProcessing(false);
          return;
        }
        
        // Create the project first
        await createProjectMutation.mutateAsync({
          name: newProjectName.trim(),
          description: newProjectDescription.trim()
        });
      } else if (!selectedProjectId) {
        setError('Please select a project or create a new one');
        setIsProcessing(false);
        return;
      }
      
      // Now save the conversation
      return await handleSaveConversation(title, content, responseContent, onSuccess, source);
      
    } catch (error) {
      console.error('Error in handleSaveWithProjectCheck:', error);
      setError(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
      setIsProcessing(false);
    }
  };
  
  return {
    selectedProjectId,
    setSelectedProjectId,
    newProjectName,
    setNewProjectName,
    newProjectDescription,
    setNewProjectDescription,
    showNewProjectForm,
    setShowNewProjectForm,
    isProcessing,
    error,
    projects,
    handleSaveConversation: handleSaveWithProjectCheck,
    showNavigationConfirm,
    setShowNavigationConfirm,
    handleNavigateToConversation
  };
};
