
import React from 'react';
import { Project } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

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
      <Label htmlFor="project">Select Project</Label>
      <Select value={selectedProjectId} onValueChange={onSelectProject}>
        <SelectTrigger>
          <SelectValue placeholder="Select a project (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button 
        variant="outline" 
        className="w-full mt-2"
        onClick={onCreateNewProject}
      >
        Create New Project
      </Button>
    </div>
  );
}
