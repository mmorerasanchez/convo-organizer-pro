
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ToolCard from '@/components/tools/ToolCard';
import ToolsEmptyState from '@/components/tools/ToolsEmptyState';
import { Tool } from '@/lib/types';

interface ToolsGridViewProps {
  tools: Tool[];
  isLoading: boolean;
  error: Error | null;
  searchTerm: string;
  resetFilters: () => void;
}

const ToolsGridView: React.FC<ToolsGridViewProps> = ({ 
  tools, 
  isLoading, 
  error,
  searchTerm,
  resetFilters
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  } 
  
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading tools. Please try again later.</p>
      </div>
    );
  }

  if (tools.length === 0) {
    return <ToolsEmptyState searchTerm={searchTerm} resetFilters={resetFilters} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
};

export default ToolsGridView;
