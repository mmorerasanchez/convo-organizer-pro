
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, FolderPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { fetchProjects } from '@/lib/api/projects';
import NewProjectDialog from '@/components/projects/NewProjectDialog';

interface PromptingProjectSelectorProps {
  onProjectSelect?: (projectId: string) => void;
  selectedProjectId?: string;
}

export function PromptingProjectSelector({
  onProjectSelect,
  selectedProjectId
}: PromptingProjectSelectorProps) {
  const { user } = useAuth();
  
  const { data: projects = [] } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: fetchProjects,
    enabled: !!user
  });

  const handleProjectSelect = (projectId: string) => {
    onProjectSelect?.(projectId);
  };

  if (!user) {
    return (
      <div className="text-center text-muted-foreground text-sm">
        Please sign in to save prompts to projects
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Project Context</Label>
      
      {projects.length > 0 ? (
        <div className="flex gap-2">
          <Select value={selectedProjectId} onValueChange={handleProjectSelect}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a project for context" />
            </SelectTrigger>
            <SelectContent>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{project.name}</span>
                    {project.description && (
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {project.description}
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <NewProjectDialog 
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      ) : (
        <div className="text-center p-4 bg-muted/20 rounded-lg border border-dashed">
          <p className="text-sm text-muted-foreground">
            No projects found. Create a project to save and organize your prompts.
          </p>
        </div>
      )}
    </div>
  );
}
