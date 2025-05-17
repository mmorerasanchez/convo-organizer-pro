
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpDown, LayoutGrid, ListFilter, Table, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

interface ProjectFiltersProps {
  searchTerm: string;
  sortBy: 'updated' | 'name';
  setSortBy: (value: 'updated' | 'name') => void;
  resetFilters: () => void;
  viewMode?: 'grid' | 'status' | 'table';
  setViewMode?: (mode: 'grid' | 'status' | 'table') => void;
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
      
      {/* View mode toggle - updated to match header tabs styling */}
      {setViewMode && (
        <div className="inline-flex h-9 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "rounded-sm h-7 px-3 text-sm", 
              viewMode === 'grid' ? "bg-background text-foreground shadow-sm" : ""
            )}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            <span>Grid</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "rounded-sm h-7 px-3 text-sm", 
              viewMode === 'status' ? "bg-background text-foreground shadow-sm" : ""
            )}
            onClick={() => setViewMode('status')}
          >
            <ListFilter className="h-4 w-4 mr-2" />
            <span>By Status</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "rounded-sm h-7 px-3 text-sm", 
              viewMode === 'table' ? "bg-background text-foreground shadow-sm" : ""
            )}
            onClick={() => setViewMode('table')}
          >
            <Table className="h-4 w-4 mr-2" />
            <span>Table</span>
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
