
import React, { useState } from 'react';
import { Project } from '@/lib/types';
import ProjectGrid from './ProjectGrid';
import ProjectsByStatus from './ProjectsByStatus';
import ProjectsTableView from './ProjectsTableView';
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
  const [viewMode, setViewMode] = useState<'grid' | 'status' | 'table'>('grid');
  
  return (
    <div className="space-y-section">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <NewProjectDialog />
        </div>
      </div>
      
      {viewMode === 'grid' ? (
        <ProjectGrid 
          projects={projects}
          isLoading={isLoading}
          showNewButton={false}
          searchTerm={searchTerm}
        />
      ) : viewMode === 'status' ? (
        <ProjectsByStatus 
          projects={projects}
          isLoading={isLoading}
          showNewButton={false}
        />
      ) : (
        <ProjectsTableView
          projects={projects}
          isLoading={isLoading}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      )}
    </div>
  );
};

export default AllProjectsTabContent;
