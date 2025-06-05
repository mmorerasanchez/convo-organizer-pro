
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from '@/lib/api';
import { errorHandler, AppError, LogLevel } from '@/lib/utils/errorHandler';

export const useProjectOperations = () => {
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  
  // Create new project mutation with improved error handling
  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (newProject) => {
      errorHandler.handleInfo('Project created successfully', {
        component: 'useProjectOperations',
        metadata: { projectId: newProject.id, projectName: newProject.name }
      });
      
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setSelectedProjectId(newProject.id);
      setShowNewProjectForm(false);
      
      // Clear form fields after successful creation
      setNewProjectName('');
      setNewProjectDescription('');
      
      errorHandler.handleSuccess(`Project "${newProject.name}" created successfully`);
    },
    onError: (error: Error) => {
      errorHandler.log(new AppError(error.message, LogLevel.ERROR, {
        component: 'useProjectOperations',
        action: 'createProject',
        metadata: { projectName: newProjectName }
      }));
      
      const friendlyMessage = errorHandler.getUserFriendlyMessage(error.message);
      setError(friendlyMessage);
    }
  });

  return {
    // State
    selectedProjectId,
    setSelectedProjectId,
    newProjectName,
    setNewProjectName,
    newProjectDescription,
    setNewProjectDescription,
    showNewProjectForm,
    setShowNewProjectForm,
    error,
    setError,
    
    // Mutations
    createProjectMutation,
  };
};
