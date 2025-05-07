
import React from 'react';
import ProjectCard from '@/components/projects/ProjectCard';
import NewProjectButton from '@/components/projects/NewProjectButton';
import { Project } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectGridProps {
  projects: Project[];
  isLoading: boolean;
  showNewButton?: boolean;
  searchTerm?: string;
  isShared?: boolean;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  isLoading,
  showNewButton = false,
  searchTerm = '',
  isShared = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  if (projects.length === 0 && searchTerm) {
    return (
      <div className="col-span-full text-center py-8">
        <p className="text-muted-foreground">No projects match your search</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {showNewButton && <NewProjectButton />}
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} isShared={isShared} />
      ))}
    </div>
  );
};

export default ProjectGrid;
