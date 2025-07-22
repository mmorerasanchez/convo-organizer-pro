
import { useState, useMemo } from 'react';
import { Tool } from '@/lib/types';

const useToolsFilter = (tools: Tool[], searchTerm: string = '') => {
  const [sortBy, setSortBy] = useState<'name' | 'model' | 'score' | 'updated'>('updated');

  const filteredTools = useMemo(() => {
    let filtered = tools;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'model':
          return a.model.localeCompare(b.model);
        case 'score':
          return b.score - a.score;
        case 'updated':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });
  }, [tools, searchTerm, sortBy]);

  const resetFilters = () => {
    setSortBy('updated');
  };

  return {
    sortBy,
    setSortBy,
    filteredTools,
    resetFilters
  };
};

export default useToolsFilter;
