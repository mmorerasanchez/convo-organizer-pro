
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTools } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import MainLayout from '@/components/layout/MainLayout';
import MyToolsTab from '@/components/tools/MyToolsTab';
import ToolFinderTab from '@/components/tools/ToolFinderTab';
import ModelSectionsTab from '@/components/tools/ModelSectionsTab';
import useToolsFilter from '@/hooks/useToolsFilter';
import PageHeader from '@/components/common/PageHeader';
import { Search, CodeSquare, Cpu } from 'lucide-react';

const Tools = () => {
  useRequireAuth();
  const [activeTab, setActiveTab] = useState('my-tools');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: tools = [], isLoading, error } = useQuery({
    queryKey: ['tools'],
    queryFn: fetchTools
  });

  const {
    sortBy,
    setSortBy,
    filteredTools,
    resetFilters
  } = useToolsFilter(tools, searchTerm);

  const tabs = [
    {
      value: 'my-tools',
      label: 'My Tools',
      icon: <CodeSquare className="h-4 w-4" />
    },
    {
      value: 'llm-models',
      label: 'LLM Models',
      icon: <Cpu className="h-4 w-4" />
    },
    {
      value: 'tool-finder',
      label: 'Tool Finder',
      icon: <Search className="h-4 w-4" />,
      disabled: true
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="AI Tools"
          description="Discover and use AI-powered tools and language models to enhance your workflow"
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showSearch={activeTab === 'my-tools'}
          searchPlaceholder="Search tools by name, description or model..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
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
          
          <TabsContent value="tool-finder" className="mt-0">
            <ToolFinderTab />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Tools;
