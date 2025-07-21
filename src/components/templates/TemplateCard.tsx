
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Template } from '@/lib/types';
import { Eye, Users, Lock, Zap, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTemplate, recordTemplateUsage } from '@/lib/api/templates';
import { useFrameworks } from '@/hooks/use-frameworks';

interface TemplateCardProps {
  template: Template;
  onEdit?: (template: Template) => void;
  onUse?: (template: Template) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onEdit,
  onUse
}) => {
  const queryClient = useQueryClient();
  const { data: frameworks = [] } = useFrameworks();

  const deleteMutation = useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('Template deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete template');
    }
  });

  const recordUsageMutation = useMutation({
    mutationFn: recordTemplateUsage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('Template usage recorded');
    },
    onError: () => {
      toast.error('Failed to record template usage');
    }
  });

  const handleUse = () => {
    recordUsageMutation.mutate(template.id);
    onUse?.(template);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this template?')) {
      deleteMutation.mutate(template.id);
    }
  };

  const getVisibilityIcon = () => {
    switch (template.visibility) {
      case 'public':
        return <Eye className="h-3 w-3" />;
      case 'shared':
        return <Users className="h-3 w-3" />;
      default:
        return <Lock className="h-3 w-3" />;
    }
  };

  const getTagVariant = (tag: string): 'info' | 'success' | 'secondary' | 'warning' | 'destructive' | 'muted' => {
    const variants: Record<string, 'info' | 'success' | 'secondary' | 'warning' | 'destructive' | 'muted'> = {
      'Research': 'info',
      'Content Creation': 'success',
      'Analysis': 'secondary',
      'Customer Support': 'warning',
      'Development': 'destructive',
      'Custom': 'muted'
    };
    return variants[tag] || 'muted';
  };

  const framework = frameworks.find(f => f.id === template.framework_id);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {template.name}
            </CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {template.description || 'No description provided'}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(template)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant={getTagVariant(template.tag)}>
              {template.tag}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              {getVisibilityIcon()}
              <span className="capitalize">{template.visibility}</span>
            </Badge>
            {framework && (
              <Badge variant="secondary">
                {framework.name}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Used {template.usage_count} times</span>
            {template.effectiveness_score && (
              <span>Score: {template.effectiveness_score}/5</span>
            )}
          </div>

          {template.model_id && (
            <div className="text-sm text-muted-foreground">
              Model: {template.model_id}
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Temp: {template.temperature}</span>
            <span>Tokens: {template.max_tokens}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button 
          onClick={handleUse}
          className="w-full gap-2"
          disabled={recordUsageMutation.isPending}
        >
          <Zap className="h-4 w-4" />
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
