
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProjectCard from '@/components/projects/ProjectCard';
import NewProjectButton from '@/components/projects/NewProjectButton';
import NewProjectDialog from '@/components/projects/NewProjectDialog';
import JoinProjectDialog from '@/components/projects/JoinProjectDialog';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects, getSharedProjects } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';
import { BookOpen, Users } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';

const Projects = () => {
  useRequireAuth();
  const [activeTab, setActiveTab] = useState('all-projects');
  
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  });

  const { data: sharedProjects = [], isLoading: isLoadingShared } = useQuery({
    queryKey: ['shared-projects'],
    queryFn: getSharedProjects
  });

  const tabs = [
    {
      value: 'all-projects',
      label: 'My Projects',
      icon: <BookOpen className="h-4 w-4" />
    },
    {
      value: 'shared-projects',
      label: 'Shared Projects',
      icon: <Users className="h-4 w-4" />
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <PageHeader 
          title="Projects"
          description="Create and manage your projects or collaborate on shared projects"
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          <TabsContent value="all-projects" className="mt-0 space-y-6">
            <div className="flex justify-end space-x-2">
              <JoinProjectDialog />
              <NewProjectDialog />
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
          </TabsContent>
          
          <TabsContent value="shared-projects" className="mt-0 space-y-6">
            {isLoadingShared ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            ) : (
              sharedProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sharedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} isShared={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg bg-muted/40">
                  <p className="text-muted-foreground">
                    No projects have been shared with you yet. Use the "Join a Project" button to access a shared project.
                  </p>
                </div>
              )
            )}
          </TabsContent>
        </PageHeader>
      </div>
    </MainLayout>
  );
};

export default Projects;
