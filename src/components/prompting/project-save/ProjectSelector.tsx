
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, FolderPlus } from 'lucide-react';
import { Project } from '@/lib/types';

interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (projectId: string) => void;
  onCreateNewProject: () => void;
  disabled?: boolean;
}

export function ProjectSelector({
  projects,
  selectedProjectId,
  onSelectProject,
  onCreateNewProject,
  disabled = false
}: ProjectSelectorProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor="project-select">Choose Project *</Label>
      
      {projects.length > 0 ? (
        <div className="space-y-2">
          <Select 
            value={selectedProjectId} 
            onValueChange={onSelectProject}
            disabled={disabled}
          >
            <SelectTrigger id="project-select" className={!selectedProjectId ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select an existing project" />
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
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>or</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCreateNewProject}
              disabled={disabled}
              className="gap-2"
            >
              <Plus className="h-3 w-3" />
              Create New Project
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <FolderPlus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-3">
            No projects found. Create your first project to save conversations.
          </p>
          <Button
            type="button"
            onClick={onCreateNewProject}
            disabled={disabled}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Your First Project
          </Button>
        </div>
      )}
    </div>
  );
}
