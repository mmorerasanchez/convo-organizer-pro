
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { fetchProjects, fetchModels, createConversation } from '@/lib/api';

interface UseNewConversationProps {
  projectId?: string;
}

export const useNewConversation = ({ projectId }: UseNewConversationProps = {}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('ChatGPT');
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || '');
  const [externalId, setExternalId] = useState('');
  const [status, setStatus] = useState('Active');
  const [type, setType] = useState<'input' | 'output'>('input');
  const [selectedModelId, setSelectedModelId] = useState<string>('none');
  const [open, setOpen] = useState(false);
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
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
  
  // Update selected project when projectId prop changes
  useEffect(() => {
    if (projectId) {
      setSelectedProjectId(projectId);
    }
  }, [projectId]);
  
  const createConversationMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: (newConversation) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversations', 'project', selectedProjectId] });
      queryClient.invalidateQueries({ queryKey: ['project', selectedProjectId] });
      
      toast.success(`Conversation "${title}" added successfully`);
      setOpen(false);
      resetForm();
      navigate(`/conversations/${newConversation.id}`);
    },
    onError: (error: Error) => {
      toast.error(`Error creating conversation: ${error.message}`);
    }
  });
  
  const resetForm = () => {
    setTitle('');
    setContent('');
    setExternalId('');
    setPlatform('ChatGPT');
    setType('input');
    setSelectedModelId('none');
    setStatus('Active');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createConversationMutation.mutate({
      title: title.trim(),
      content: content.trim(),
      platform,
      projectId: selectedProjectId,
      externalId: externalId.trim() || undefined,
      status,
      type,
      modelId: selectedModelId === 'none' ? undefined : selectedModelId
    });
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    platform,
    setPlatform,
    selectedProjectId,
    setSelectedProjectId,
    externalId,
    setExternalId,
    status,
    setStatus,
    type,
    setType,
    selectedModelId,
    setSelectedModelId,
    open,
    setOpen,
    projects,
    models,
    isPending: createConversationMutation.isPending,
    handleSubmit,
    resetForm
  };
};
