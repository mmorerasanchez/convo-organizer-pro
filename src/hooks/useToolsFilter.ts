
import { useState, useMemo } from 'react';
import { Tool } from '@/lib/types';

const useToolsFilter = (tools: Tool[], searchTerm: string = '') => {
  const [sortBy, setSortBy] = useState<'name' | 'score'>('name');

  const filteredTools = useMemo(() => {
    let filtered = tools;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'score':
          return b.score - a.score;
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [tools, searchTerm, sortBy]);

  const resetFilters = () => {
    setSortBy('name');
  };

  return {
    sortBy,
    setSortBy,
    filteredTools,
    resetFilters
  };
};

export default useToolsFilter;
