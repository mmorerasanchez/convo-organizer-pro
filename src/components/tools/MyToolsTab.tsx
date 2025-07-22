
import React, { useState } from 'react';
import { Tool } from '@/lib/types';
import ToolsControlBar from './ToolsControlBar';
import ToolsGridView from './ToolsGridView';

interface MyToolsTabProps {
  tools: Tool[];
  isLoading: boolean;
  error: Error | null;
}

const MyToolsTab: React.FC<MyToolsTabProps> = ({
  tools,
  isLoading,
  error
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'created'>('name');
  const [filterBy, setFilterBy] = useState('all');

  // Filter and sort tools
  const filteredTools = tools
    .filter(tool => {
      // Search filter
      const matchesSearch = searchTerm === '' ||
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.model.toLowerCase().includes(searchTerm.toLowerCase());

      // Availability filter
      if (filterBy === 'all') return matchesSearch;
      if (filterBy === 'available') return matchesSearch; // All tools are available for now
      if (filterBy === 'coming-soon') return false; // No coming soon tools for now
      
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'score':
          return b.score - a.score;
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const resetFilters = () => {
    setSearchTerm('');
    setSortBy('name');
    setFilterBy('all');
  };

  return (
    <div className="space-y-6">
      <ToolsControlBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
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
