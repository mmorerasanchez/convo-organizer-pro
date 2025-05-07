
import React from 'react';
import { Project } from '@/lib/types';
import ProjectFilters from './ProjectFilters';
import ProjectGrid from './ProjectGrid';
import JoinProjectDialog from './JoinProjectDialog';
import NewProjectDialog from './NewProjectDialog';

interface AllProjectsTabContentProps {
  projects: Project[];
  isLoading: boolean;
  searchTerm: string;
  sortBy: 'updated' | 'name';
  setSortBy: (value: 'updated' | 'name') => void;
  resetFilters: () => void;
}

const AllProjectsTabContent: React.FC<AllProjectsTabContentProps> = ({
  projects,
  isLoading,
  searchTerm,
  sortBy,
  setSortBy,
  resetFilters
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <ProjectFilters
          searchTerm={searchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          resetFilters={resetFilters}
        />
        <div className="flex items-center space-x-2">
          <JoinProjectDialog />
          <NewProjectDialog />
        </div>
      </div>
      
      <ProjectGrid 
        projects={projects}
        isLoading={isLoading}
        showNewButton={true}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default AllProjectsTabContent;
