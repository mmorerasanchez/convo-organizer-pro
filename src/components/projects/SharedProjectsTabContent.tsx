
import React, { useState } from 'react';
import { Project } from '@/lib/types';
import ProjectFilters from './ProjectFilters';
import ProjectGrid from './ProjectGrid';
import ProjectsByStatus from './ProjectsByStatus';
import SharedProjectsEmptyState from './SharedProjectsEmptyState';

interface SharedProjectsTabContentProps {
  projects: Project[];
  isLoading: boolean;
  searchTerm: string;
  sortBy: 'updated' | 'name';
  setSortBy: (value: 'updated' | 'name') => void;
  resetFilters: () => void;
}

const SharedProjectsTabContent: React.FC<SharedProjectsTabContentProps> = ({
  projects,
  isLoading,
  searchTerm,
  sortBy,
  setSortBy,
  resetFilters
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'status'>('grid');

  if (!isLoading && projects.length === 0 && !searchTerm) {
    return <SharedProjectsEmptyState />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <ProjectFilters
          searchTerm={searchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          resetFilters={resetFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      </div>
      
      {viewMode === 'grid' ? (
        <ProjectGrid 
          projects={projects}
          isLoading={isLoading}
          showNewButton={false}
          searchTerm={searchTerm}
          isShared={true}
        />
      ) : (
        <ProjectsByStatus 
          projects={projects}
          isLoading={isLoading}
          showNewButton={false}
        />
      )}
    </div>
  );
};

export default SharedProjectsTabContent;
