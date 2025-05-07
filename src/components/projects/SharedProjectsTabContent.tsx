
import React from 'react';
import { Project } from '@/lib/types';
import ProjectFilters from './ProjectFilters';
import ProjectGrid from './ProjectGrid';
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
  if (isLoading) {
    return (
      <ProjectGrid 
        projects={[]}
        isLoading={true}
        isShared={true}
      />
    );
  }

  if (projects.length === 0) {
    return <SharedProjectsEmptyState searchTerm={searchTerm} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <ProjectFilters
          searchTerm={searchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          resetFilters={resetFilters}
        />
      </div>
      <ProjectGrid 
        projects={projects}
        isLoading={isLoading}
        isShared={true}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default SharedProjectsTabContent;
