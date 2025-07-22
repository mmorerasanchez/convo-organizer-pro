
import React from 'react';
import { Filter, ArrowUpDown, Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import NewProjectDialog from './NewProjectDialog';

interface ProjectsControlBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: 'updated' | 'name';
  setSortBy: (sort: 'updated' | 'name') => void;
  filterBy: string;
  setFilterBy: (filter: string) => void;
  resetFilters: () => void;
}

const ProjectsControlBar: React.FC<ProjectsControlBarProps> = ({
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
                  variant={sortBy === 'updated' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setSortBy('updated')}
                  className="justify-start"
                >
                  Last Updated
                </Button>
                <Button 
                  variant={sortBy === 'name' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setSortBy('name')}
                  className="justify-start"
                >
                  Project Name
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
              <h4 className="font-medium text-sm">Filter by status</h4>
              <div className="flex flex-col gap-1.5">
                <Button 
                  variant={filterBy === 'all' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setFilterBy('all')}
                  className="justify-start"
                >
                  All Projects
                </Button>
                <Button 
                  variant={filterBy === 'active' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setFilterBy('active')}
                  className="justify-start"
                >
                  Active
                </Button>
                <Button 
                  variant={filterBy === 'completed' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setFilterBy('completed')}
                  className="justify-start"
                >
                  Completed
                </Button>
                <Button 
                  variant={filterBy === 'archived' ? 'secondary' : 'ghost'} 
                  size="sm" 
                  onClick={() => setFilterBy('archived')}
                  className="justify-start"
                >
                  Archived
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Search Bar */}
        <div className="relative w-[26rem]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9 h-9 text-sm font-mono"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Disabled Shared Projects Icon */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 opacity-60 cursor-not-allowed"
                disabled
              >
                <Users className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Shared projects feature coming soon</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* New Project Button */}
        <NewProjectDialog />
      </div>
    </div>
  );
};

export default ProjectsControlBar;
