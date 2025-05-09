
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, LayoutGrid, ListFilter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProjectFiltersProps {
  searchTerm: string;
  sortBy: 'updated' | 'name';
  setSortBy: (value: 'updated' | 'name') => void;
  resetFilters: () => void;
  viewMode?: 'grid' | 'status';
  setViewMode?: (mode: 'grid' | 'status') => void;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  searchTerm,
  sortBy,
  setSortBy,
  resetFilters,
  viewMode = 'grid',
  setViewMode
}) => {
  const hasFilters = searchTerm || sortBy !== 'updated';
  
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Sort options */}
      <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'updated' | 'name')}>
        <SelectTrigger className="w-[180px] h-9 text-sm">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="updated">Sort by Last Updated</SelectItem>
          <SelectItem value="name">Sort by Name</SelectItem>
        </SelectContent>
      </Select>
      
      {/* View mode toggle */}
      {setViewMode && (
        <div className="flex items-center bg-muted/60 rounded-md">
          <Button 
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="h-9"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            <span>Grid</span>
          </Button>
          <Button 
            variant={viewMode === 'status' ? 'secondary' : 'ghost'} 
            size="sm" 
            className="h-9"
            onClick={() => setViewMode('status')}
          >
            <ListFilter className="h-4 w-4 mr-2" />
            <span>By Status</span>
          </Button>
        </div>
      )}
      
      {/* Active filters */}
      {hasFilters && (
        <div className="ml-auto flex items-center gap-2">
          {sortBy !== 'updated' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <ArrowUpDown className="h-3 w-3" /> 
              {sortBy === 'name' ? 'Name' : 'Last Updated'}
            </Badge>
          )}
          {hasFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters} 
              className="h-8 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Reset
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;
