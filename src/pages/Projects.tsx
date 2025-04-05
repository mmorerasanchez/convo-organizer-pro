
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProjectCard from '@/components/projects/ProjectCard';
import NewProjectButton from '@/components/projects/NewProjectButton';
import NewProjectDialog from '@/components/projects/NewProjectDialog';
import JoinProjectDialog from '@/components/projects/JoinProjectDialog';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects, getSharedProjects } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

const Projects = () => {
  useRequireAuth();
  
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  });

  const { data: sharedProjects = [], isLoading: isLoadingShared } = useQuery({
    queryKey: ['shared-projects'],
    queryFn: getSharedProjects
  });

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <div className="flex space-x-2">
              <JoinProjectDialog />
              <NewProjectDialog />
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading projects. Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <NewProjectButton />
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="space-y-2">
            <Separator />
            <h2 className="text-2xl font-semibold mt-4">Shared Projects</h2>
            <p className="text-muted-foreground">Projects that have been shared with you by other users.</p>
          </div>
          
          {isLoadingShared ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          ) : (
            sharedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {sharedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-muted/40 mt-4">
                <p className="text-muted-foreground">
                  No projects have been shared with you yet. Use the "Join a Project" button to access a shared project.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Projects;
