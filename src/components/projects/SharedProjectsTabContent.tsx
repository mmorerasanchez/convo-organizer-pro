
import React, { useState } from 'react';
import { Project } from '@/lib/types';
import ProjectGrid from './ProjectGrid';
import ProjectsByStatus from './ProjectsByStatus';
import ProjectsTableView from './ProjectsTableView';
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
  const [viewMode, setViewMode] = useState<'grid' | 'status' | 'table'>('grid');

  if (!isLoading && projects.length === 0 && !searchTerm) {
    return <SharedProjectsEmptyState searchTerm={searchTerm} />;
  }
  
  return (
    <div className="space-y-6">
      {viewMode === 'grid' ? (
        <ProjectGrid 
          projects={projects}
          isLoading={isLoading}
          showNewButton={false}
          searchTerm={searchTerm}
          isShared={true}
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

export default SharedProjectsTabContent;
