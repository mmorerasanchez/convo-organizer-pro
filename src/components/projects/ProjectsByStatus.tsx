
import React from 'react';
import { Project } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import ProjectCard from './ProjectCard';
import NewProjectButton from './NewProjectButton';

interface ProjectsByStatusProps {
  projects: Project[];
  isLoading: boolean;
  showNewButton?: boolean;
}

const ProjectsByStatus: React.FC<ProjectsByStatusProps> = ({
  projects,
  isLoading,
  showNewButton = false
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

  const notStartedProjects = projects.filter(p => p.status === 'not started');
  const inProgressProjects = projects.filter(p => p.status === 'in progress');
  const activeProjects = projects.filter(p => p.status === 'active');

  return (
    <div className="space-y-8">
      {/* Not Started Projects */}
      <div>
        <h3 className="text-lg font-medium mb-4">Not Started</h3>
        {notStartedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notStartedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">No projects in "Not Started" status</p>
          </div>
        )}
      </div>

      {/* In Progress Projects */}
      <div>
        <h3 className="text-lg font-medium mb-4">In Progress</h3>
        {inProgressProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">No projects in "In Progress" status</p>
          </div>
        )}
      </div>

      {/* Active Projects */}
      <div>
        <h3 className="text-lg font-medium mb-4">Active</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {showNewButton && <NewProjectButton />}
          {activeProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {activeProjects.length === 0 && !showNewButton && (
            <div className="col-span-full text-center py-4 bg-gray-50 rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">No projects in "Active" status</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsByStatus;
