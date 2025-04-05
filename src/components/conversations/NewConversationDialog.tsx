
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { mockProjects, mockConversations } from '@/lib/mockData';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create a new conversation with a unique ID
    const newConversation = {
      id: Date.now().toString(), // Using timestamp as a unique ID
      title: title.trim(),
      content: content.trim(),
      platform: platform,
      capturedAt: new Date().toISOString(),
      tags: [],
      projectId: selectedProjectId
    };
    
    // Add the new conversation to the mockConversations array
    mockConversations.push(newConversation);
    
    // Update the project's conversation count
    const project = mockProjects.find(p => p.id === selectedProjectId);
    if (project) {
      project.conversationCount += 1;
      project.updatedAt = new Date().toISOString();
    }
    
    setTimeout(() => {
      toast.success(`Conversation "${title}" added successfully`);
      setIsSubmitting(false);
      setOpen(false);
      setTitle('');
      setContent('');
      navigate(`/conversations/${newConversation.id}`);
    }, 500);
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
                disabled={mockProjects.length === 0}
              >
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                  {mockProjects.length === 0 && (
                    <SelectItem value="" disabled>
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
              disabled={isSubmitting || !title.trim() || !content.trim() || !selectedProjectId}
            >
              {isSubmitting ? 'Adding...' : 'Add Conversation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationDialog;
