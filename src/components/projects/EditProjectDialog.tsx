
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Project } from '@/lib/types';
import { updateProject } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface EditProjectDialogProps {
  project: Project;
  trigger?: React.ReactNode;
}

const EditProjectDialog: React.FC<EditProjectDialogProps> = ({
  project,
  trigger
}) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [open, setOpen] = useState(!!trigger);
  
  const queryClient = useQueryClient();
  
  const updateProjectMutation = useMutation({
    mutationFn: () => updateProject(project.id, {
      name: name.trim(),
      description: description.trim()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', project.id] });
      toast.success(`Project "${name}" updated successfully`);
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Error updating project: ${error.message}`);
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProjectMutation.mutate();
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
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
              disabled={updateProjectMutation.isPending || !name.trim()}
            >
              {updateProjectMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
