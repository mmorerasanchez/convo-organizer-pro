
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { mockProjects } from '@/lib/mockData';
import { v4 as uuidv4 } from 'uuid';

interface NewProjectDialogProps {
  trigger?: React.ReactNode;
  variant?: 'default' | 'outline' | 'card';
}

const NewProjectDialog: React.FC<NewProjectDialogProps> = ({ 
  trigger, 
  variant = 'default' 
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create a new project with a unique ID
    const newProject = {
      id: uuidv4(),
      name: name.trim(),
      description: description.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      conversationCount: 0
    };
    
    // Add the new project to the mockProjects array
    mockProjects.push(newProject);
    
    setTimeout(() => {
      toast.success(`Project "${name}" created successfully`);
      setIsSubmitting(false);
      setOpen(false);
      setName('');
      setDescription('');
      navigate(`/projects/${newProject.id}`);
    }, 500);
  };
  
  const triggerButton = trigger || (
    <Button 
      className={variant === 'card' ? 'w-full h-full' : 'gap-2'} 
      variant={variant === 'outline' ? 'outline' : 'default'}
    >
      <Plus size={16} />
      New Project
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isSubmitting || !name.trim()}
              className="gap-1"
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
