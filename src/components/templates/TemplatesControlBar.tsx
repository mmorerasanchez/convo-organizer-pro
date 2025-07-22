
import React from 'react';
import { Filter, ArrowUpDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface TemplatesControlBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: 'name' | 'created' | 'updated';
  setSortBy: (sort: 'name' | 'created' | 'updated') => void;
  filterBy: string;
  setFilterBy: (filter: string) => void;
  resetFilters: () => void;
  onCreateTemplate: () => void;
}

const TemplatesControlBar: React.FC<TemplatesControlBarProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  filterBy,
  setFilterBy,
  resetFilters,
  onCreateTemplate
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
                  Template Name
                </Button>
                <Button 
                  variant={sortBy === 'created' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setSortBy('created')}
                  className="justify-start"
                >
                  Created Date
                </Button>
                <Button 
                  variant={sortBy === 'updated' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setSortBy('updated')}
                  className="justify-start"
                >
                  Last Updated
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
              <h4 className="font-medium text-sm">Filter by visibility</h4>
              <div className="flex flex-col gap-1.5">
                <Button 
                  variant={filterBy === 'all' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setFilterBy('all')}
                  className="justify-start"
                >
                  All Templates
                </Button>
                <Button 
                  variant={filterBy === 'my' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setFilterBy('my')}
                  className="justify-start"
                >
                  My Templates
                </Button>
                <Button 
                  variant={filterBy === 'public' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setFilterBy('public')}
                  className="justify-start"
                >
                  Public Templates
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Search Bar */}
        <div className="relative w-[26rem]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-9 h-9 text-sm font-mono"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Create Template Button */}
        <Button onClick={onCreateTemplate}>
          Create Template
        </Button>
      </div>
    </div>
  );
};

export default TemplatesControlBar;
