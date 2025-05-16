
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchTools } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Skeleton } from '@/components/ui/skeleton';
import ToolCard from '@/components/tools/ToolCard';
import NewToolDialog from '@/components/tools/NewToolDialog';
import { Filter, Plus, Wrench, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import PageHeader from '@/components/common/PageHeader';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const Tools = () => {
  useRequireAuth();
  const [activeTab, setActiveTab] = useState('my-tools');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'name'>('score');
  
  const { data: tools = [], isLoading, error } = useQuery({
    queryKey: ['tools'],
    queryFn: fetchTools
  });

  // Define a custom tab renderer for the disabled tool finder tab
  const toolFinderTab = {
    value: 'tool-finder',
    label: 'Tool Finder',
    icon: <Search className="h-4 w-4" />,
    disabled: true,
    custom: (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="h-7 px-3 text-sm flex items-center gap-1.5 font-mono opacity-60 cursor-not-allowed filter blur-[0.3px]">
              <Search className="h-4 w-4" />
              Tool Finder
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>This feature is currently unavailable</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  };

  const tabs = [
    {
      value: 'my-tools',
      label: 'My Tools',
      icon: <Wrench className="h-4 w-4" />
    },
    toolFinderTab
  ];

  // Filter and sort tools based on search term and sort option
  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.model.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'score') {
      return b.score - a.score;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSortBy('score');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="AI Tools"
          description="Discover and use AI-powered tools and language models to enhance your workflow"
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showSearch={true}
          searchPlaceholder="Search tools by name, description or model..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="my-tools" className="mt-0 space-y-6">
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
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-red-500">Error loading tools. Please try again later.</p>
              </div>
            ) : (
              <>
                {filteredTools.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredTools.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 empty-state rounded-lg border bg-muted/20">
                    {searchTerm ? (
                      <>
                        <Wrench className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                        <h3 className="text-lg font-medium mb-2">No tools found</h3>
                        <p className="text-muted-foreground mb-4">
                          No tools match your search criteria
                        </p>
                        <Button onClick={resetFilters}>
                          Clear Search
                        </Button>
                      </>
                    ) : (
                      <>
                        <Wrench className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                        <h3 className="text-lg font-medium mb-2">No tools yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Start adding tools to your collection
                        </p>
                        <NewToolDialog trigger={
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Tool
                          </Button>
                        } />
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="tool-finder">
            <div className="text-center py-12 rounded-lg border bg-muted/20">
              <Search className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-2">Tool Finder</h3>
              <p className="text-muted-foreground mb-4">
                Coming soon in a future update
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Tools;
