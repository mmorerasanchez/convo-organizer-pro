import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTemplate } from '@/lib/api/templates';
import { Template } from '@/lib/types';
import { toast } from 'sonner';

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<Template>;
}

const CreateTemplateDialog: React.FC<CreateTemplateDialogProps> = ({
  open,
  onOpenChange,
  initialData = {}
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    tag: initialData.tag || 'Custom' as const,
    visibility: initialData.visibility || 'private' as const,
    framework_config: initialData.framework_config || {},
    field_values: initialData.field_values || {},
    temperature: initialData.temperature || 0.7,
    max_tokens: initialData.max_tokens || 1000,
    model_id: initialData.model_id || '',
    variables: initialData.variables || {},
    framework_id: initialData.framework_id || '',
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('Template created successfully');
      onOpenChange(false);
      setFormData({
        name: '',
        description: '',
        tag: 'Custom',
        visibility: 'private',
        framework_config: {},
        field_values: {},
        temperature: 0.7,
        max_tokens: 1000,
        model_id: '',
        variables: {},
        framework_id: '',
      });
    },
    onError: (error) => {
      console.error('Error creating template:', error);
      toast.error('Failed to create template');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Template name is required');
      return;
    }
    
    createMutation.mutate(formData);
  };

  const tags = ['Research', 'Content Creation', 'Analysis', 'Customer Support', 'Development', 'Custom'] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name*</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter template name..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what this template is for..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tag">Category</Label>
              <Select 
                value={formData.tag} 
                onValueChange={(value: typeof formData.tag) => 
                  setFormData(prev => ({ ...prev, tag: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tags.map(tag => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <Select 
                value={formData.visibility} 
                onValueChange={(value: typeof formData.visibility) => 
                  setFormData(prev => ({ ...prev, visibility: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="shared">Shared</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Template'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTemplateDialog;