
import React, { useState } from 'react';
import { Project } from '@/lib/types';
import ProjectFilters from './ProjectFilters';
import ProjectGrid from './ProjectGrid';
import ProjectsByStatus from './ProjectsByStatus';
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
  const [viewMode, setViewMode] = useState<'grid' | 'status'>('grid');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <ProjectFilters
          searchTerm={searchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          resetFilters={resetFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <div className="flex items-center space-x-2">
          {/* Removed JoinProjectDialog from here */}
          <NewProjectDialog />
        </div>
      </div>
      
      {viewMode === 'grid' ? (
        <ProjectGrid 
          projects={projects}
          isLoading={isLoading}
          showNewButton={true}
          searchTerm={searchTerm}
        />
      ) : (
        <ProjectsByStatus 
          projects={projects}
          isLoading={isLoading}
          showNewButton={true}
        />
      )}
    </div>
  );
};

export default AllProjectsTabContent;
