
import React, { useMemo, useState } from 'react';
import { Tool } from '@/lib/types';
import ToolsListControlBar from './ToolsListControlBar';
import ToolsTableView from './ToolsTableView';
import { toolsDirectory, ToolDirectoryItem } from '@/lib/toolsDirectory';

interface MyToolsTabProps {
  tools: Tool[];
  isLoading: boolean;
  error: Error | null;
}

const MyToolsTab: React.FC<MyToolsTabProps> = ({
  tools: _tools,
  isLoading: _isLoading,
  error: _error
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDirectory: ToolDirectoryItem[] = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return toolsDirectory;
    return toolsDirectory.filter((t) =>
      t.name.toLowerCase().includes(term) ||
      t.primaryCategory.toLowerCase().includes(term) ||
      t.secondaryCategory.toLowerCase().includes(term) ||
      t.url.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const resetFilters = () => {
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      <ToolsListControlBar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        resetFilters={resetFilters}
      />

      <ToolsTableView items={filteredDirectory} />
    </div>
  );
};

export default MyToolsTab;
