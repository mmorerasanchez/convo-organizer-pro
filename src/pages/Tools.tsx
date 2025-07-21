
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTools } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import MainLayout from '@/components/layout/MainLayout';
import ToolsHeader from '@/components/tools/ToolsHeader';
import MyToolsTab from '@/components/tools/MyToolsTab';
import ToolFinderTab from '@/components/tools/ToolFinderTab';
import ModelSectionsTab from '@/components/tools/ModelSectionsTab';
import useToolsFilter from '@/hooks/useToolsFilter';

const Tools = () => {
  useRequireAuth();
  const [activeTab, setActiveTab] = useState('my-tools');
  
  const { data: tools = [], isLoading, error } = useQuery({
    queryKey: ['tools'],
    queryFn: fetchTools
  });

  const {
    searchTerm, 
    setSearchTerm,
    sortBy,
    setSortBy,
    filteredTools,
    resetFilters
  } = useToolsFilter(tools);

  return (
    <MainLayout>
      <div className="space-y-section">
        <ToolsHeader 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="my-tools" className="mt-0 space-y-6">
            <MyToolsTab 
              tools={tools}
              isLoading={isLoading}
              error={error}
              searchTerm={searchTerm}
              sortBy={sortBy}
              setSortBy={setSortBy}
              filteredTools={filteredTools}
              resetFilters={resetFilters}
            />
          </TabsContent>
          
          <TabsContent value="llm-models" className="mt-0">
            <ModelSectionsTab />
          </TabsContent>
          
          <TabsContent value="tool-finder">
            <ToolFinderTab />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Tools;
