
import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import NewToolDialog from '@/components/tools/NewToolDialog';

interface ToolsFiltersProps {
  sortBy: 'score' | 'name';
  setSortBy: (sort: 'score' | 'name') => void;
  searchTerm: string;
  resetFilters: () => void;
}

const ToolsFilters: React.FC<ToolsFiltersProps> = ({
  sortBy,
  setSortBy,
  searchTerm,
  resetFilters
}) => {
  return (
    <div className="flex justify-between items-center">
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
                  variant={sortBy === 'score' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setSortBy('score')}
                  className="justify-start"
                >
                  Performance score
                </Button>
                <Button 
                  variant={sortBy === 'name' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setSortBy('name')}
                  className="justify-start"
                >
                  Tool name
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <NewToolDialog />
    </div>
  );
};

export default ToolsFilters;
