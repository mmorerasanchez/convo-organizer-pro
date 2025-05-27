
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
      console.log('Project created successfully:', newProject);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setSelectedProjectId(newProject.id);
      setShowNewProjectForm(false);
      // Clear form fields after successful creation
      setNewProjectName('');
      setNewProjectDescription('');
      toast.success(`Project "${newProject.name}" created successfully`);
    },
    onError: (error: Error) => {
      console.error('Error creating project:', error);
      const errorMessage = error.message || 'Unknown error occurred';
      setError(`Error creating project: ${errorMessage}`);
      toast.error(`Error creating project: ${errorMessage}`);
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
