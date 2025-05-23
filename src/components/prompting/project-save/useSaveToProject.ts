
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchProjects, createProject, createConversation } from '@/lib/api';
import { fetchTags, createTag, assignTagToConversation } from '@/lib/api/tags';
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

  // Fetch tags for source tags
  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags
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

  // Assign tag to conversation mutation
  const assignTagMutation = useMutation({
    mutationFn: assignTagToConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: Error) => {
      console.error('Error assigning tag to conversation:', error);
      // Continue even if tag assignment fails
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

  // Helper function to find or create a source tag
  const getOrCreateSourceTag = async (source: string) => {
    // Check if tag already exists
    const sourceTag = tags.find(tag => 
      tag.name.toLowerCase() === `source:${source.toLowerCase()}`
    );
    
    if (sourceTag) {
      return sourceTag;
    }

    // Create a new tag with a color based on the source
    let tagColor = '#6366F1'; // Default indigo color
    
    if (source.toLowerCase().includes('designer')) {
      tagColor = '#2563EB'; // Blue for Designer
    } else if (source.toLowerCase().includes('scanner')) {
      tagColor = '#8B5CF6'; // Purple for Scanner
    }
    
    try {
      const newTag = await createTagMutation.mutateAsync({
        name: `source:${source}`,
        color: tagColor
      });
      return newTag;
    } catch (error) {
      console.error('Failed to create source tag:', error);
      return null;
    }
  };
  
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
        platform: 'Promptito',
        projectId,
        type: 'input',
        status: 'Active',
        modelId: 'none'
      });
      
      // If source is provided, create or find a source tag and assign it
      if (source && promptResult) {
        const sourceTag = await getOrCreateSourceTag(source);
        if (sourceTag) {
          await assignTagMutation.mutateAsync(promptResult.id, sourceTag.id);
        }
      }
      
      // Save the response as output if provided
      if (responseContent) {
        const responseResult = await createConversationMutation.mutateAsync({
          title: `${title.trim()} (Response)`,
          content: responseContent.trim(),
          platform: 'Promptito',
          projectId,
          type: 'output',
          status: 'Active',
          modelId: 'none'
        });
        
        // Also tag the response with source if provided
        if (source && responseResult) {
          const sourceTag = await getOrCreateSourceTag(source);
          if (sourceTag) {
            await assignTagMutation.mutateAsync(responseResult.id, sourceTag.id);
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
