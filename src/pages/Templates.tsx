import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import PageHeader from '@/components/common/PageHeader';
import TemplateLibrary from '@/components/templates/TemplateLibrary';
import CreateTemplateDialog from '@/components/templates/CreateTemplateDialog';

const Templates = () => {
  useRequireAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreateTemplate = () => {
    setShowCreateDialog(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader 
          title="Templates"
          description="Save and reuse prompt configurations for consistent, efficient workflows"
        />
        
        <TemplateLibrary onCreateTemplate={handleCreateTemplate} />
        
        <CreateTemplateDialog 
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      </div>
    </MainLayout>
  );
};

export default Templates;