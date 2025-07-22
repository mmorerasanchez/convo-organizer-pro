
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import PageHeader from '@/components/common/PageHeader';
import TemplateLibrary from '@/components/templates/TemplateLibrary';
import CreateTemplateDialog from '@/components/templates/CreateTemplateDialog';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { BookOpen, Users } from 'lucide-react';

const Templates = () => {
  useRequireAuth();
  const [activeTab, setActiveTab] = useState('my-templates');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateTemplate = () => {
    setShowCreateDialog(true);
  };

  const tabs = [
    {
      value: 'my-templates',
      label: 'My Templates',
      icon: <BookOpen className="h-4 w-4" />
    },
    {
      value: 'public-templates',
      label: 'Public Templates',
      icon: <Users className="h-4 w-4" />,
      disabled: true
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Templates"
          description="Save and reuse prompt configurations for consistent, efficient workflows"
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showSearch={true}
          searchPlaceholder="Search templates..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="my-templates" className="mt-0 space-y-6">
            <TemplateLibrary 
              onCreateTemplate={handleCreateTemplate}
              searchTerm={searchTerm}
            />
          </TabsContent>
          
          <TabsContent value="public-templates" className="mt-0">
            <div className="text-center py-16 grid-pattern rounded-lg">
              <h3 className="text-lg font-medium mb-2">Public Templates Coming Soon</h3>
              <p className="text-muted-foreground">
                Discover and use templates shared by the community
              </p>
            </div>
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

export default Templates;
