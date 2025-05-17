
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { fetchProjects, createProject } from '@/lib/api/projects';
import { createConversation } from '@/lib/api/conversations';
import { toast } from 'sonner';

export function useSaveToProject() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNavigationConfirm, setShowNavigationConfirm] = useState(false);
  const [savedConversationId, setSavedConversationId] = useState<string>('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's projects
  const { data: projects = [] } = useQuery({
    queryKey: ['projects-list'],
    queryFn: fetchProjects,
    enabled: !!user
  });

  // Create new project mutation
  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (newProject) => {
      setSelectedProjectId(newProject.id);
      toast.success(`Project "${newProjectName}" created successfully`);
      setShowNewProjectForm(false);
      
      // Invalidate projects query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['projects-list'] });
    },
    onError: (error) => {
      setError("Failed to create project. Please try again.");
      toast.error("Failed to create project. Please try again.");
      console.error("Error creating project:", error);
    }
  });

  // Save conversation mutation
  const saveConversationMutation = useMutation({
    mutationFn: async ({ 
      title, 
      content, 
      projectId 
    }: { 
      title: string; 
      content: string; 
      projectId?: string 
    }) => {
      // Combine prompt and response for the content
      return createConversation({
        title,
        content,
        platform: "prompt-designer",
        projectId: projectId || '',
        status: "active"
      });
    },
    onSuccess: (conversation) => {
      toast.success("Prompt saved to conversations");
      
      // Clear any previous errors
      setError(null);
      
      // Store the conversation ID for navigation and show confirmation dialog
      setSavedConversationId(conversation.id);
      setShowNavigationConfirm(true);
    },
    onError: (error) => {
      setError("Failed to save conversation. Please try again.");
      toast.error("Failed to save conversation. Please try again.");
      console.error("Error saving conversation:", error);
    }
  });

  const handleNavigateToConversation = () => {
    if (savedConversationId) {
      navigate(`/conversations/${savedConversationId}`);
    }
    setShowNavigationConfirm(false);
  };

  const handleSaveConversation = async (
    conversationTitle: string,
    promptContent: string,
    responseContent?: string,
    onComplete?: () => void
  ) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      // Validate inputs
      if (!conversationTitle.trim()) {
        setError("Conversation title is required");
        setIsProcessing(false);
        return;
      }
      
      // If creating new project
      if (showNewProjectForm && newProjectName.trim()) {
        await createProjectMutation.mutateAsync({
          name: newProjectName.trim(),
          description: newProjectDescription.trim()
        });
      }
      
      // Combine prompt and response for the content
      const fullContent = `## Prompt\n\n${promptContent}\n\n${responseContent ? `## Response\n\n${responseContent}` : ''}`;
      
      // Save the conversation
      await saveConversationMutation.mutateAsync({
        title: conversationTitle.trim(),
        content: fullContent,
        projectId: selectedProjectId === 'none' ? undefined : selectedProjectId
      });
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Error in save process:", error);
    } finally {
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
    handleSaveConversation,
    showNavigationConfirm,
    setShowNavigationConfirm,
    handleNavigateToConversation,
    savedConversationId
  };
}
