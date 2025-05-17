
import { useState, useMemo } from 'react';
import { Tool } from '@/lib/types';

interface UseToolsFilterReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: 'score' | 'name';
  setSortBy: (sort: 'score' | 'name') => void;
  filteredTools: Tool[];
  resetFilters: () => void;
}

export const useToolsFilter = (tools: Tool[]): UseToolsFilterReturn => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'name'>('score');

  // Filter and sort tools based on search term and sort option
  const filteredTools = useMemo(() => {
    return tools
      .filter(tool => 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.model.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'score') {
          return b.score - a.score;
        } else {
          return a.name.localeCompare(b.name);
        }
      });
  }, [tools, searchTerm, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setSortBy('score');
  };

  return {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filteredTools,
    resetFilters
  };
};

export default useToolsFilter;
