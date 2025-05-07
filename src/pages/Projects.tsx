
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
import { BookOpen, Filter, Users, X } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';

const Projects = () => {
  useRequireAuth();
  const [activeTab, setActiveTab] = useState('all-projects');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'updated' | 'name'>('updated');
  const [showFilters, setShowFilters] = useState(false);
  
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
    setShowFilters(false);
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
        >
          <TabsContent value="all-projects" className="mt-0 space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {searchTerm && (
                  <Button variant="outline" size="sm" onClick={resetFilters} className="h-8">
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
                <Popover open={showFilters} onOpenChange={setShowFilters}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <Filter className="h-3 w-3 mr-1" />
                      Sort
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-3">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Sort by</h4>
                      <div className="flex flex-col gap-1.5">
                        <Button 
                          variant={sortBy === 'updated' ? 'secondary' : 'ghost'} 
                          size="sm" 
                          onClick={() => setSortBy('updated')}
                          className="justify-start"
                        >
                          Last updated
                        </Button>
                        <Button 
                          variant={sortBy === 'name' ? 'secondary' : 'ghost'} 
                          size="sm" 
                          onClick={() => setSortBy('name')}
                          className="justify-start"
                        >
                          Project name
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center space-x-2">
                <JoinProjectDialog />
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
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
                {filteredProjects.length === 0 && searchTerm && (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">No projects match your search</p>
                  </div>
                )}
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
              filteredSharedProjects.length > 0 ? (
                <>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {searchTerm && (
                        <Button variant="outline" size="sm" onClick={resetFilters} className="h-8">
                          <X className="h-3 w-3 mr-1" />
                          Clear
                        </Button>
                      )}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8">
                            <Filter className="h-3 w-3 mr-1" />
                            Sort
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-3">
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Sort by</h4>
                            <div className="flex flex-col gap-1.5">
                              <Button 
                                variant={sortBy === 'updated' ? 'secondary' : 'ghost'} 
                                size="sm" 
                                onClick={() => setSortBy('updated')}
                                className="justify-start"
                              >
                                Last updated
                              </Button>
                              <Button 
                                variant={sortBy === 'name' ? 'secondary' : 'ghost'} 
                                size="sm" 
                                onClick={() => setSortBy('name')}
                                className="justify-start"
                              >
                                Project name
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSharedProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} isShared={true} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-10 border rounded-lg bg-muted/20">
                  {searchTerm ? (
                    <p className="text-muted-foreground">
                      No shared projects match your search
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      No projects have been shared with you yet. Use the "Join a Project" button to access a shared project.
                    </p>
                  )}
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
