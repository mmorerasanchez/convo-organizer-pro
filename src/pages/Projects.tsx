
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects, getSharedProjects } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid3X3, List, BarChart3 } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import ProjectsControlBar from '@/components/projects/ProjectsControlBar';
import ProjectGrid from '@/components/projects/ProjectGrid';
import ProjectsByStatus from '@/components/projects/ProjectsByStatus';
import ProjectsTableView from '@/components/projects/ProjectsTableView';

const Projects = () => {
  useRequireAuth();
  const [activeViewTab, setActiveViewTab] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'updated' | 'name'>('updated');
  const [filterBy, setFilterBy] = useState('all');
  
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  });

  const { data: sharedProjects = [], isLoading: isLoadingShared } = useQuery({
    queryKey: ['shared-projects'],
    queryFn: getSharedProjects
  });

  // View mode tabs configuration
  const viewTabs = [
    {
      value: 'grid',
      label: 'Grid View',
      icon: <Grid3X3 className="h-4 w-4" />
    },
    {
      value: 'status',
      label: 'By Status',
      icon: <BarChart3 className="h-4 w-4" />
    },
    {
      value: 'table',
      label: 'Table View',
      icon: <List className="h-4 w-4" />
    }
  ];

  // Filter and sort projects based on search term, sort option, and filter
  const filteredProjects = projects
    .filter(project => {
      // Search filter
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      if (filterBy === 'all') return matchesSearch;
      return matchesSearch && project.status === filterBy;
    })
    .sort((a, b) => {
      if (sortBy === 'updated') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      } else {
        return a.name.localeCompare(b.name);
      }
    });

  const resetFilters = () => {
    setSearchTerm('');
    setSortBy('updated');
    setFilterBy('all');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Standardized Header - matches Dashboard exactly */}
        <PageHeader 
          title="Projects"
          description="Create and manage your projects or collaborate on shared projects"
          tabs={viewTabs}
          activeTab={activeViewTab}
          onTabChange={setActiveViewTab}
        />
        
        {/* Control Bar with sort, filter, search, and actions */}
        <ProjectsControlBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          resetFilters={resetFilters}
        />
        
        {/* View Mode Content */}
        <Tabs value={activeViewTab} onValueChange={setActiveViewTab}>
          <TabsContent value="grid" className="mt-0 space-y-6">
            <ProjectGrid 
              projects={filteredProjects}
              isLoading={isLoading}
              showNewButton={false}
              searchTerm={searchTerm}
            />
          </TabsContent>
          
          <TabsContent value="status" className="mt-0 space-y-6">
            <ProjectsByStatus 
              projects={filteredProjects}
              isLoading={isLoading}
              showNewButton={false}
            />
          </TabsContent>
          
          <TabsContent value="table" className="mt-0 space-y-6">
            <ProjectsTableView
              projects={filteredProjects}
              isLoading={isLoading}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Projects;
