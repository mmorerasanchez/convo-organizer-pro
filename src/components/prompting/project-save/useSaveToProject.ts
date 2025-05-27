
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
      
      console.log('Starting save process with:', {
        title,
        showNewProjectForm,
        selectedProjectId,
        source
      });
      
      let projectIdToUse = selectedProjectId;
      
      // Create a new project if needed
      if (showNewProjectForm) {
        if (!newProjectName.trim()) {
          setError('Project name is required');
          setIsProcessing(false);
          return;
        }
        
        console.log('Creating new project:', newProjectName);
        
        // Create the project first and wait for it
        const newProject = await createProjectMutation.mutateAsync({
          name: newProjectName.trim(),
          description: newProjectDescription.trim()
        });
        
        projectIdToUse = newProject.id;
        console.log('Project created, using ID:', projectIdToUse);
      } else if (!selectedProjectId) {
        setError('Please select a project or create a new one');
        setIsProcessing(false);
        return;
      }
      
      // Now save the conversation using the correct project ID
      return await handleSaveConversation(title, content, responseContent, onSuccess, source);
      
    } catch (error) {
      console.error('Error in handleSaveWithProjectCheck:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(`Unexpected error: ${errorMessage}`);
      setIsProcessing(false);
      throw error;
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
