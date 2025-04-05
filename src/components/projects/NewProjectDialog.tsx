
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createProject } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success(`Project "${name}" created successfully`);
      setOpen(false);
      setName('');
      setDescription('');
      navigate(`/projects/${newProject.id}`);
    },
    onError: (error: Error) => {
      toast.error(`Error creating project: ${error.message}`);
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProjectMutation.mutate({
      name: name.trim(),
      description: description.trim()
    });
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
              disabled={createProjectMutation.isPending || !name.trim()}
              className="gap-1"
            >
              {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
