
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchProjects, createProject, createConversation } from '@/lib/api';
import { toast } from 'sonner';

export const useSaveToProject = () => {
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNavigationConfirm, setShowNavigationConfirm] = useState(false);
  const [newConversationId, setNewConversationId] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Fetch projects for the dropdown
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  });
  
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
      setIsProcessing(false);
    }
  });
  
  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: (newConversation) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversations', 'project', selectedProjectId] });
      queryClient.invalidateQueries({ queryKey: ['project', selectedProjectId] });
      
      setNewConversationId(newConversation.id);
      setShowNavigationConfirm(true);
      toast.success('Conversation saved successfully');
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
    onSuccess?: () => void
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
      const projectId = showNewProjectForm ? createProjectMutation.data?.id : selectedProjectId;
      
      if (!projectId) {
        setError('No project selected');
        setIsProcessing(false);
        return;
      }
      
      // Save the prompt as input
      const promptResult = await createConversationMutation.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        platform: 'Lovable',
        projectId,
        type: 'input',
        status: 'Active',
        modelId: 'none'
      });
      
      // Save the response as output if provided
      if (responseContent) {
        await createConversationMutation.mutateAsync({
          title: `${title.trim()} (Response)`,
          content: responseContent.trim(),
          platform: 'Lovable',
          projectId,
          type: 'output',
          status: 'Active',
          modelId: 'none'
        });
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
    handleSaveConversation,
    showNavigationConfirm,
    setShowNavigationConfirm,
    handleNavigateToConversation
  };
};
