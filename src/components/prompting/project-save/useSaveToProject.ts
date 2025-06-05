
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '@/lib/api';
import { fetchTags } from '@/lib/api/tags';
import { useProjectOperations } from './hooks/useProjectOperations';
import { useConversationOperations } from './hooks/useConversationOperations';
import { errorHandler, AppError, LogLevel } from '@/lib/utils/errorHandler';

export const useSaveToProject = () => {
  const [error, setError] = useState<string | null>(null);
  
  // Fetch projects for the dropdown - removed onError (deprecated in React Query v5)
  const { data: projects = [], error: projectsError } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  });

  // Handle projects fetch error
  if (projectsError) {
    errorHandler.log(new AppError(projectsError.message, LogLevel.ERROR, {
      component: 'useSaveToProject',
      action: 'fetchProjects'
    }));
  }

  // Fetch tags for source tags - removed onError (deprecated in React Query v5)
  const { data: tags = [], error: tagsError } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags
  });

  // Handle tags fetch error
  if (tagsError) {
    errorHandler.log(new AppError(tagsError.message, LogLevel.ERROR, {
      component: 'useSaveToProject',
      action: 'fetchTags'
    }));
  }
  
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
      
      errorHandler.handleInfo('Starting save process', {
        component: 'useSaveToProject',
        action: 'handleSaveWithProjectCheck',
        metadata: {
          title,
          showNewProjectForm,
          selectedProjectId,
          source,
          hasResponseContent: !!responseContent
        }
      });
      
      let projectIdToUse = selectedProjectId;
      
      // Create a new project if needed
      if (showNewProjectForm) {
        if (!newProjectName.trim()) {
          throw new AppError('Project name is required', LogLevel.ERROR, {
            component: 'useSaveToProject',
            action: 'projectValidation'
          });
        }
        
        errorHandler.handleInfo(`Creating new project: ${newProjectName}`);
        
        // Create the project first and wait for it
        const newProject = await createProjectMutation.mutateAsync({
          name: newProjectName.trim(),
          description: newProjectDescription.trim()
        });
        
        projectIdToUse = newProject.id;
        errorHandler.handleInfo(`Project created successfully, using ID: ${projectIdToUse}`);
        
      } else if (!selectedProjectId) {
        throw new AppError('Please select a project or create a new one', LogLevel.ERROR, {
          component: 'useSaveToProject',
          action: 'projectValidation'
        });
      }
      
      // Now save the conversation using the correct project ID
      return await handleSaveConversation(title, content, responseContent, onSuccess, source);
      
    } catch (error) {
      errorHandler.handleApiError(error, {
        component: 'useSaveToProject',
        action: 'handleSaveWithProjectCheck',
        metadata: { selectedProjectId, source }
      });
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
