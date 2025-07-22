
import React from 'react';
import { Filter, ArrowUpDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import NewToolDialog from './NewToolDialog';

interface ToolsControlBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: 'name' | 'score' | 'created';
  setSortBy: (sort: 'name' | 'score' | 'created') => void;
  filterBy: string;
  setFilterBy: (filter: string) => void;
  resetFilters: () => void;
}

const ToolsControlBar: React.FC<ToolsControlBarProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  filterBy,
  setFilterBy,
  resetFilters
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        {/* Sort Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <ArrowUpDown className="h-3 w-3 mr-1" />
              Sort
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Sort by</h4>
              <div className="flex flex-col gap-1.5">
                <Button 
                  variant={sortBy === 'name' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setSortBy('name')}
                  className="justify-start"
                >
                  Tool Name
                </Button>
                <Button 
                  variant={sortBy === 'score' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setSortBy('score')}
                  className="justify-start"
                >
                  Score
                </Button>
                <Button 
                  variant={sortBy === 'created' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setSortBy('created')}
                  className="justify-start"
                >
                  Created Date
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Filter Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="h-3 w-3 mr-1" />
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Filter by availability</h4>
              <div className="flex flex-col gap-1.5">
                <Button 
                  variant={filterBy === 'all' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setFilterBy('all')}
                  className="justify-start"
                >
                  All Tools
                </Button>
                <Button 
                  variant={filterBy === 'available' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setFilterBy('available')}
                  className="justify-start"
                >
                  Available
                </Button>
                <Button 
                  variant={filterBy === 'coming-soon' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setFilterBy('coming-soon')}
                  className="justify-start"
                >
                  Coming Soon
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Search Bar */}
        <div className="relative w-[26rem]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            className="pl-9 h-9 text-sm font-mono"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* New Tool Button */}
        <NewToolDialog />
      </div>
    </div>
  );
};

export default ToolsControlBar;
