
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Conversation } from '@/lib/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProjects, updateConversation } from '@/lib/api';

interface EditConversationDialogProps {
  conversation: Conversation;
  trigger?: React.ReactNode;
}

const EditConversationDialog: React.FC<EditConversationDialogProps> = ({ 
  conversation,
  trigger 
}) => {
  const [title, setTitle] = useState(conversation.title);
  const [content, setContent] = useState(conversation.content);
  const [platform, setPlatform] = useState(conversation.platform);
  const [projectId, setProjectId] = useState(conversation.projectId);
  const [externalId, setExternalId] = useState(conversation.externalId || '');
  const [status, setStatus] = useState(conversation.status || 'active');
  const [open, setOpen] = useState(false);
  
  const queryClient = useQueryClient();
  
  // Fetch projects for the dropdown
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  });
  
  const updateConversationMutation = useMutation({
    mutationFn: () => updateConversation(conversation.id, {
      title: title.trim(),
      content: content.trim(),
      platform,
      projectId,
      externalId: externalId.trim() || null,
      status
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
  
  const triggerButton = trigger || (
    <Button variant="outline" size="icon">
      <Edit className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Conversation</DialogTitle>
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
                value={projectId} 
                onValueChange={setProjectId}
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
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={status} 
                onValueChange={setStatus}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Conversation status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Final">Final</SelectItem>
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
                updateConversationMutation.isPending || 
                !title.trim() || 
                !content.trim() || 
                !projectId
              }
            >
              {updateConversationMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditConversationDialog;
