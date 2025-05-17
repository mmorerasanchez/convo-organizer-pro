
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Project } from '@/lib/types';

interface ProjectSelectorProps {
  value: string;
  onChange: (value: string) => void;
  projects: Project[];
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({ value, onChange, projects }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="project">Project</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={projects.length === 0}
      >
        <SelectTrigger id="project">
          <SelectValue placeholder="Select project" />
        </SelectTrigger>
        <SelectContent>
          {projects.map(project => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
          {projects.length === 0 && (
            <SelectItem value="no-projects" disabled>
              No projects available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
