
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Conversation } from '@/lib/types';
import { updateConversation, fetchProjects, fetchModels } from '@/lib/api';
import { toast } from 'sonner';

export const useEditConversation = (conversation: Conversation) => {
  const [title, setTitle] = useState(conversation.title);
  const [content, setContent] = useState(conversation.content);
  const [platform, setPlatform] = useState(conversation.platform);
  const [projectId, setProjectId] = useState(conversation.projectId);
  const [externalId, setExternalId] = useState(conversation.externalId || '');
  const [status, setStatus] = useState(conversation.status || 'active');
  const [type, setType] = useState<'input' | 'output'>(conversation.type || 'input');
  const [modelId, setModelId] = useState(conversation.modelId || 'none');
  const [open, setOpen] = useState(false);
  
  const queryClient = useQueryClient();
  
  // Update local state when conversation prop changes
  useEffect(() => {
    setTitle(conversation.title);
    setContent(conversation.content);
    setPlatform(conversation.platform);
    setProjectId(conversation.projectId);
    setExternalId(conversation.externalId || '');
    setStatus(conversation.status || 'active');
    setType(conversation.type || 'input');
    setModelId(conversation.modelId || 'none');
  }, [conversation]);
  
  // Fetch projects for the dropdown
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  });

  // Fetch AI models for the dropdown
  const { data: models = [] } = useQuery({
    queryKey: ['ai-models'],
    queryFn: fetchModels
  });
  
  const updateConversationMutation = useMutation({
    mutationFn: () => updateConversation(conversation.id, {
      title: title.trim(),
      content: content.trim(),
      platform,
      projectId,
      externalId: externalId.trim() || null,
      status,
      type,
      modelId: modelId === 'none' ? null : modelId
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', conversation.id] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversations', 'project', projectId] });
      
      // If project changed, also invalidate the old project's conversations
      if (projectId !== conversation.projectId) {
        queryClient.invalidateQueries({ queryKey: ['conversations', 'project', conversation.projectId] });
      }
      
      toast.success(`Conversation "${title}" updated successfully`);
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Error updating conversation: ${error.message}`);
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConversationMutation.mutate();
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    platform,
    setPlatform,
    projectId,
    setProjectId,
    externalId,
    setExternalId,
    status,
    setStatus,
    type,
    setType,
    modelId,
    setModelId,
    open,
    setOpen,
    projects,
    models,
    isPending: updateConversationMutation.isPending,
    handleSubmit
  };
};
