
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects, getSharedProjects } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { BookOpen, Users } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import AllProjectsTabContent from '@/components/projects/AllProjectsTabContent';
import SharedProjectsTabContent from '@/components/projects/SharedProjectsTabContent';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Projects = () => {
  useRequireAuth();
  const [activeTab, setActiveTab] = useState('all-projects');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'updated' | 'name'>('updated');
  
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  });

  const { data: sharedProjects = [], isLoading: isLoadingShared } = useQuery({
    queryKey: ['shared-projects'],
    queryFn: getSharedProjects
  });

  // Define a custom tab renderer for the disabled shared projects tab
  const sharedProjectsTab = {
    value: 'shared-projects',
    label: 'Shared Projects',
    icon: <Users className="h-4 w-4" />,
    disabled: true,
    custom: (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="h-7 px-3 text-sm flex items-center gap-1.5 font-mono opacity-60 cursor-not-allowed filter blur-[0.3px]">
              <Users className="h-4 w-4" />
              Shared Projects
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>This feature is currently unavailable</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  };

  const tabs = [
    {
      value: 'all-projects',
      label: 'My Projects',
      icon: <BookOpen className="h-4 w-4" />
    },
    sharedProjectsTab
  ];

  // Filter and sort projects based on search term and sort option
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'updated') {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  // Filter and sort shared projects
  const filteredSharedProjects = sharedProjects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'updated') {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSortBy('updated');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Projects"
          description="Create and manage your projects or collaborate on shared projects"
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showSearch={true}
          searchPlaceholder="Search projects..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="all-projects" className="mt-0 space-y-6">
            <AllProjectsTabContent 
              projects={filteredProjects}
              isLoading={isLoading} 
              searchTerm={searchTerm}
              sortBy={sortBy}
              setSortBy={setSortBy}
              resetFilters={resetFilters}
            />
          </TabsContent>
          
          <TabsContent value="shared-projects" className="mt-0 space-y-6">
            <SharedProjectsTabContent 
              projects={filteredSharedProjects}
              isLoading={isLoadingShared} 
              searchTerm={searchTerm}
              sortBy={sortBy}
              setSortBy={setSortBy}
              resetFilters={resetFilters}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Projects;
