
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Tool } from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTool } from '@/lib/api';
import { Slider } from '@/components/ui/slider';

interface EditToolDialogProps {
  tool: Tool;
  trigger?: React.ReactNode;
}

const EditToolDialog: React.FC<EditToolDialogProps> = ({ 
  tool,
  trigger 
}) => {
  const [name, setName] = useState(tool.name);
  const [model, setModel] = useState(tool.model);
  const [score, setScore] = useState([tool.score]);
  const [description, setDescription] = useState(tool.description || '');
  const [open, setOpen] = useState(false);
  
  const queryClient = useQueryClient();
  
  const updateToolMutation = useMutation({
    mutationFn: () => updateTool(tool.id, {
      name: name.trim(),
      model: model.trim(),
      score: score[0],
      description: description.trim() || undefined
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      toast.success(`Tool "${name}" updated successfully`);
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Error updating tool: ${error.message}`);
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateToolMutation.mutate();
  };
  
  const triggerButton = trigger || (
    <Button variant="secondary" size="sm">
      <Edit className="h-4 w-4 mr-1" />
      Edit
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Tool</DialogTitle>
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
                updateToolMutation.isPending || 
                !name.trim() || 
                !model.trim()
              }
            >
              {updateToolMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditToolDialog;
