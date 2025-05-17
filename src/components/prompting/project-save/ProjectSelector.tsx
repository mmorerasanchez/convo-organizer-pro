
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project } from '@/lib/types';
import { Plus } from 'lucide-react';

interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (projectId: string) => void;
  onCreateNewProject: () => void;
}

export function ProjectSelector({
  projects,
  selectedProjectId,
  onSelectProject,
  onCreateNewProject
}: ProjectSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="project">Select Project</Label>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-xs flex items-center gap-1"
          onClick={onCreateNewProject}
        >
          <Plus className="h-3.5 w-3.5" />
          Create New Project
        </Button>
      </div>
      
      {projects.length > 0 ? (
        <>
          <Select 
            value={selectedProjectId} 
            onValueChange={onSelectProject}
          >
            <SelectTrigger id="project">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Projects help you organize related prompts, conversations, and knowledge files in one place.
          </p>
        </>
      ) : (
        <div className="bg-muted/60 p-4 rounded-md text-center">
          <p className="text-sm mb-2">You don't have any projects yet.</p>
          <Button 
            size="sm" 
            onClick={onCreateNewProject} 
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Project
          </Button>
        </div>
      )}
    </div>
  );
}
