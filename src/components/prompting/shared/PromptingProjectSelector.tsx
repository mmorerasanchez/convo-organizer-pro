
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, FolderPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { fetchProjects } from '@/lib/api/projects';
import { NewProjectDialog } from '@/components/projects/NewProjectDialog';

interface PromptingProjectSelectorProps {
  onProjectSelect?: (projectId: string) => void;
  selectedProjectId?: string;
}

export function PromptingProjectSelector({
  onProjectSelect,
  selectedProjectId
}: PromptingProjectSelectorProps) {
  const { user } = useAuth();
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState(false);
  
  const { data: projects = [] } = useQuery({
    queryKey: ['projects', user?.id],
    queryFn: () => fetchProjects(user?.id || ''),
    enabled: !!user
  });

  const handleProjectSelect = (projectId: string) => {
    onProjectSelect?.(projectId);
  };

  const handleNewProjectCreated = (newProject: any) => {
    onProjectSelect?.(newProject.id);
    setNewProjectDialogOpen(false);
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
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setNewProjectDialogOpen(true)}
            className="shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="text-center py-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <FolderPlus className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-3">
            Create a project to save and organize your prompts
          </p>
          <Button
            size="sm"
            onClick={() => setNewProjectDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="h-3 w-3" />
            Create Your First Project
          </Button>
        </div>
      )}
      
      <NewProjectDialog
        open={newProjectDialogOpen}
        onOpenChange={setNewProjectDialogOpen}
        onProjectCreated={handleNewProjectCreated}
      />
    </div>
  );
}
