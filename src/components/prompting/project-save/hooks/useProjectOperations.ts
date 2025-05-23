
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from '@/lib/api';
import { toast } from 'sonner';

export const useProjectOperations = () => {
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  
  // Create new project mutation
  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setSelectedProjectId(newProject.id);
      setShowNewProjectForm(false);
      toast.success(`Project "${newProjectName}" created successfully`);
    },
    onError: (error: Error) => {
      setError(`Error creating project: ${error.message}`);
      toast.error(`Error creating project: ${error.message}`);
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
