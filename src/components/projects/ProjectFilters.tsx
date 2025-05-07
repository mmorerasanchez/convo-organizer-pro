
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ProjectFiltersProps {
  searchTerm: string;
  sortBy: 'updated' | 'name';
  setSortBy: (value: 'updated' | 'name') => void;
  resetFilters: () => void;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  searchTerm,
  sortBy,
  setSortBy,
  resetFilters
}) => {
  return (
    <div className="flex items-center gap-2">
      {searchTerm && (
        <Button variant="outline" size="sm" onClick={resetFilters} className="h-8">
          <X className="h-3 w-3 mr-1" />
          Clear
        </Button>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="h-3 w-3 mr-1" />
            Sort
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-3">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Sort by</h4>
            <div className="flex flex-col gap-1.5">
              <Button 
                variant={sortBy === 'updated' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setSortBy('updated')}
                className="justify-start"
              >
                Last updated
              </Button>
              <Button 
                variant={sortBy === 'name' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setSortBy('name')}
                className="justify-start"
              >
                Project name
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ProjectFilters;
