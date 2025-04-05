
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProjectCard from '@/components/projects/ProjectCard';
import NewProjectButton from '@/components/projects/NewProjectButton';
import NewProjectDialog from '@/components/projects/NewProjectDialog';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Skeleton } from '@/components/ui/skeleton';

const Projects = () => {
  useRequireAuth();
  
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <div className="hidden md:block">
            <NewProjectDialog />
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading projects. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <NewProjectButton />
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Projects;
