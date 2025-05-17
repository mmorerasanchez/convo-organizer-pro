
import React from 'react';
import { Tool } from '@/lib/types';
import ToolsFilters from './ToolsFilters';
import ToolsGridView from './ToolsGridView';

interface MyToolsTabProps {
  tools: Tool[];
  isLoading: boolean;
  error: Error | null;
  searchTerm: string;
  sortBy: 'score' | 'name';
  setSortBy: (sort: 'score' | 'name') => void;
  filteredTools: Tool[];
  resetFilters: () => void;
}

const MyToolsTab: React.FC<MyToolsTabProps> = ({
  isLoading,
  error,
  searchTerm,
  sortBy,
  setSortBy,
  filteredTools,
  resetFilters
}) => {
  return (
    <div className="space-y-6">
      <ToolsFilters 
        sortBy={sortBy}
        setSortBy={setSortBy}
        searchTerm={searchTerm}
        resetFilters={resetFilters}
      />
      
      <ToolsGridView 
        tools={filteredTools}
        isLoading={isLoading}
        error={error}
        searchTerm={searchTerm}
        resetFilters={resetFilters}
      />
    </div>
  );
};

export default MyToolsTab;
