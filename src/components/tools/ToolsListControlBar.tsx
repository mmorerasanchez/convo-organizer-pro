import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ToolsListControlBarProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  resetFilters: () => void;
}

const ToolsListControlBar: React.FC<ToolsListControlBarProps> = ({ searchTerm, setSearchTerm, resetFilters }) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="w-full md:max-w-sm">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tools by name or category"
          aria-label="Search tools"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={resetFilters} aria-label="Reset filters">
          Clear
        </Button>
      </div>
    </div>
  );
};

export default ToolsListControlBar;
