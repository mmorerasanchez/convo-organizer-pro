
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProjects, createConversation } from '@/lib/api';

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
  const [open, setOpen] = useState(false);
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Fetch projects for the dropdown
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
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
      projectId: selectedProjectId
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
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select 
                value={platform} 
                onValueChange={setPlatform}
              >
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ChatGPT">ChatGPT</SelectItem>
                  <SelectItem value="Claude">Claude</SelectItem>
                  <SelectItem value="Gemini">Gemini</SelectItem>
                  <SelectItem value="Multiple">Multiple</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select 
                value={selectedProjectId} 
                onValueChange={setSelectedProjectId}
                disabled={projects.length === 0}
              >
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                  {projects.length === 0 && (
                    <SelectItem value="no-projects" disabled>
                      No projects available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
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
