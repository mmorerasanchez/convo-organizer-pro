
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTool } from '@/lib/api';
import { Slider } from '@/components/ui/slider';

interface NewToolDialogProps {
  trigger?: React.ReactNode;
}

const NewToolDialog: React.FC<NewToolDialogProps> = ({ 
  trigger 
}) => {
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [score, setScore] = useState([7]);
  const [description, setDescription] = useState('');
  const [open, setOpen] = useState(false);
  
  const queryClient = useQueryClient();
  
  const createToolMutation = useMutation({
    mutationFn: createTool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      toast.success(`Tool "${name}" created successfully`);
      setOpen(false);
      setName('');
      setModel('');
      setScore([7]);
      setDescription('');
    },
    onError: (error: Error) => {
      toast.error(`Error creating tool: ${error.message}`);
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createToolMutation.mutate({
      name: name.trim(),
      model: model.trim(),
      score: score[0],
      description: description.trim() || undefined
    });
  };
  
  const triggerButton = trigger || (
    <Button className="gap-2">
      <Plus size={16} />
      New Tool
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Tool</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tool name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Model name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="score">Score</Label>
              <span className="text-sm">{score[0]}</span>
            </div>
            <Slider
              id="score"
              min={1}
              max={10}
              step={1}
              value={score}
              onValueChange={setScore}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tool description (optional)"
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={
                createToolMutation.isPending || 
                !name.trim() || 
                !model.trim()
              }
            >
              {createToolMutation.isPending ? 'Creating...' : 'Create Tool'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewToolDialog;
