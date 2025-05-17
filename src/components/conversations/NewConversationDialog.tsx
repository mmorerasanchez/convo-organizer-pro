
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProjects, createConversation, fetchModels } from '@/lib/api';
import { AIModel } from '@/lib/types';
import { PlatformSelector } from './form-fields/PlatformSelector';
import { ProjectSelector } from './form-fields/ProjectSelector';
import { ConversationTypeSelector } from './form-fields/ConversationTypeSelector';
import { ModelSelector } from './form-fields/ModelSelector';
import { StatusSelector } from './form-fields/StatusSelector';

interface NewConversationDialogProps {
  trigger?: React.ReactNode;
  projectId?: string;
}

const NewConversationDialog: React.FC<NewConversationDialogProps> = ({ 
  trigger,
  projectId 
}) => {
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
      setTitle('');
      setContent('');
      setExternalId('');
      navigate(`/conversations/${newConversation.id}`);
    },
    onError: (error: Error) => {
      toast.error(`Error creating conversation: ${error.message}`);
    }
  });
  
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
  
  const triggerButton = trigger || (
    <Button className="gap-2">
      <Plus size={16} />
      New Conversation
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Conversation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter conversation title"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <PlatformSelector value={platform} onChange={setPlatform} />
            <ProjectSelector 
              value={selectedProjectId} 
              onChange={setSelectedProjectId}
              projects={projects}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <ConversationTypeSelector value={type} onChange={setType} />
            <ModelSelector value={selectedModelId} onChange={setSelectedModelId} models={models} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="externalId">External ID</Label>
              <Input
                id="externalId"
                value={externalId}
                onChange={(e) => setExternalId(e.target.value)}
                placeholder="External conversation ID"
              />
            </div>
            
            <StatusSelector value={status} onChange={setStatus} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Conversation Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste the conversation content here"
              rows={5}
              required
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={
                createConversationMutation.isPending || 
                !title.trim() || 
                !content.trim() || 
                !selectedProjectId
              }
            >
              {createConversationMutation.isPending ? 'Adding...' : 'Add Conversation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationDialog;
