
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { fetchTools } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Skeleton } from '@/components/ui/skeleton';
import ToolCard from '@/components/tools/ToolCard';
import NewToolDialog from '@/components/tools/NewToolDialog';
import { Plus, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import PageHeader from '@/components/common/PageHeader';

const Tools = () => {
  useRequireAuth();
  const [activeTab, setActiveTab] = useState('all-tools');
  
  const { data: tools = [], isLoading, error } = useQuery({
    queryKey: ['tools'],
    queryFn: fetchTools
  });

  const tabs = [
    {
      value: 'all-tools',
      label: 'All Tools',
      icon: <Wrench className="h-4 w-4" />
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <PageHeader 
          title="Tools"
          description="Discover and use AI-powered tools to enhance your workflow"
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          <TabsContent value="all-tools" className="mt-0 space-y-6">
            <div className="flex justify-end">
              <NewToolDialog />
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">Error loading tools. Please try again later.</p>
              </div>
            ) : (
              <>
                {tools.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tools.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 empty-state rounded-lg">
                    <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
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
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </PageHeader>
      </div>
    </MainLayout>
  );
};

export default Tools;
