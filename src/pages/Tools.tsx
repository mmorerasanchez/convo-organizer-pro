
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTools } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import MainLayout from '@/components/layout/MainLayout';
import MyToolsTab from '@/components/tools/MyToolsTab';
import ModelSectionsTab from '@/components/tools/ModelSectionsTab';
import TemplateLibrary from '@/components/templates/TemplateLibrary';
import TemplatesControlBar from '@/components/templates/TemplatesControlBar';
import CreateTemplateDialog from '@/components/templates/CreateTemplateDialog';
import PageHeader from '@/components/common/PageHeader';
import { FileCode, CodeSquare, Cpu } from 'lucide-react';

const Tools = () => {
  useRequireAuth();
  const [activeTab, setActiveTab] = useState('my-tools');
  
  // Templates-specific state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'updated'>('name');
  const [filterBy, setFilterBy] = useState('all');
  
  const { data: tools = [], isLoading, error } = useQuery({
    queryKey: ['tools'],
    queryFn: fetchTools
  });

  const handleCreateTemplate = () => {
    setShowCreateDialog(true);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSortBy('name');
    setFilterBy('all');
  };

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
      value: 'templates',
      label: 'Templates',
      icon: <FileCode className="h-4 w-4" />
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
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="my-tools" className="mt-0 space-y-6">
            <MyToolsTab 
              tools={tools}
              isLoading={isLoading}
              error={error}
            />
          </TabsContent>
          
          <TabsContent value="llm-models" className="mt-0">
            <ModelSectionsTab />
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-6 mt-0">
            <TemplatesControlBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              sortBy={sortBy}
              setSortBy={setSortBy}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              resetFilters={resetFilters}
              onCreateTemplate={handleCreateTemplate}
            />
            <TemplateLibrary 
              onCreateTemplate={handleCreateTemplate}
              searchTerm={searchTerm}
              sortBy={sortBy}
              filterBy={filterBy}
            />
          </TabsContent>
        </Tabs>
        
        <CreateTemplateDialog 
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      </div>
    </MainLayout>
  );
};

export default Tools;
