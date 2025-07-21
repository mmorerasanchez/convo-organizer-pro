
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTemplate } from '@/lib/api/templates';
import { Template } from '@/lib/types';
import { toast } from 'sonner';
import { useFrameworks, useFrameworkFields, useModels } from '@/hooks/use-frameworks';
import { EnhancedModelSelector } from '@/components/common/EnhancedModelSelector';

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
    model_id: initialData.model_id || 'gpt-4o-mini',
    variables: initialData.variables || {},
    framework_id: initialData.framework_id || null,
  });

  const [frameworkMethod, setFrameworkMethod] = useState<'zero-shot' | 'few-shot'>('zero-shot');

  const queryClient = useQueryClient();
  const { data: frameworks = [] } = useFrameworks();
  const { data: models = [] } = useModels();
  
  // Filter frameworks by selected method
  const filteredFrameworks = frameworks.filter(f => f.framework_type === frameworkMethod);
  
  // Get framework fields when framework is selected
  const { data: frameworkFields = [] } = useFrameworkFields(formData.framework_id);

  const createMutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('Template created successfully');
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Error creating template:', error);
      toast.error('Failed to create template');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      tag: 'Custom',
      visibility: 'private',
      framework_config: {},
      field_values: {},
      temperature: 0.7,
      max_tokens: 1000,
      model_id: 'gpt-4o-mini',
      variables: {},
      framework_id: null,
    });
    setFrameworkMethod('zero-shot');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Template name is required');
      return;
    }
    
    createMutation.mutate(formData);
  };

  const handleFrameworkChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      framework_id: value || null,
      framework_config: {},
      field_values: {}
    }));
  };

  const handleFrameworkFieldChange = (fieldLabel: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      field_values: {
        ...prev.field_values,
        [fieldLabel]: value
      }
    }));
  };

  const tags = ['Research', 'Content Creation', 'Analysis', 'Customer Support', 'Development', 'Custom'] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
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

          {/* Framework Method Selection */}
          <div className="space-y-3">
            <Label>Framework Method</Label>
            <RadioGroup
              value={frameworkMethod}
              onValueChange={(value: 'zero-shot' | 'few-shot') => {
                setFrameworkMethod(value);
                setFormData(prev => ({ 
                  ...prev, 
                  framework_id: null,
                  framework_config: {},
                  field_values: {}
                }));
              }}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="zero-shot" id="zero-shot" />
                <Label htmlFor="zero-shot">Zero-shot</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="few-shot" id="few-shot" />
                <Label htmlFor="few-shot">Few-shot</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Framework Selection */}
          <div className="space-y-2">
            <Label htmlFor="framework">Framework (Optional)</Label>
            <Select 
              value={formData.framework_id || ''} 
              onValueChange={handleFrameworkChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No framework</SelectItem>
                {filteredFrameworks.map((framework) => (
                  <SelectItem key={framework.id} value={framework.id}>
                    {framework.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.framework_id && (
              <p className="text-xs text-muted-foreground mt-1">
                {filteredFrameworks.find(f => f.id === formData.framework_id)?.description}
              </p>
            )}
          </div>

          {/* Framework Fields Configuration */}
          {formData.framework_id && frameworkFields.length > 0 && (
            <div className="space-y-4 border rounded-lg p-4">
              <Label className="text-sm font-medium">Framework Field Defaults</Label>
              {frameworkFields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.label} className="text-sm">
                    {field.label}
                  </Label>
                  <Textarea
                    id={field.label}
                    className="min-h-20"
                    placeholder={field.help_text || `Enter default value for ${field.label.toLowerCase()}`}
                    value={formData.field_values[field.label] || ''}
                    onChange={(e) => handleFrameworkFieldChange(field.label, e.target.value)}
                  />
                  {field.help_text && (
                    <p className="text-xs text-muted-foreground">{field.help_text}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Model Configuration */}
          <div className="space-y-4 border rounded-lg p-4">
            <Label className="text-sm font-medium">Model Configuration</Label>
            
            <div className="space-y-2">
              <Label>Model</Label>
              <EnhancedModelSelector
                value={formData.model_id}
                onChange={(value) => setFormData(prev => ({ ...prev, model_id: value }))}
                showRecommendations={false}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature</Label>
                <Input
                  id="temperature"
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_tokens">Max Tokens</Label>
                <Input
                  id="max_tokens"
                  type="number"
                  min="1"
                  max="4000"
                  value={formData.max_tokens}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_tokens: parseInt(e.target.value) }))}
                />
              </div>
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
