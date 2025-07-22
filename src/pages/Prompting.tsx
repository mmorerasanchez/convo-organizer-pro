
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import PromptingGuide from '@/components/prompting/PromptingGuide';
import { EnhancedPromptScanner } from '@/components/prompting/scanner/EnhancedPromptScanner';
import { EnhancedPromptDesigner } from '@/components/prompting/designer/EnhancedPromptDesigner';
import TemplateLibrary from '@/components/templates/TemplateLibrary';
import TemplatesControlBar from '@/components/templates/TemplatesControlBar';
import CreateTemplateDialog from '@/components/templates/CreateTemplateDialog';
import { BookOpen, Sparkles, Zap, FileCode } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { PromptingProvider } from '@/components/prompting/context/PromptingContext';

const Prompting = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = React.useState(() => {
    // Initialize tab from URL parameter or default to 'enhanced-scanner'
    const validTabs = ['enhanced-scanner', 'enhanced-designer', 'templates', 'guide'];
    return validTabs.includes(tabFromUrl || '') ? tabFromUrl : 'enhanced-scanner';
  });

  // Templates-specific state
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'updated'>('name');
  const [filterBy, setFilterBy] = useState('all');

  // Update active tab when URL parameter changes
  useEffect(() => {
    const validTabs = ['enhanced-scanner', 'enhanced-designer', 'templates', 'guide'];
    if (validTabs.includes(tabFromUrl || '')) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // Sync URL with active tab
  useEffect(() => {
    if (activeTab && activeTab !== 'enhanced-scanner') {
      setSearchParams({ tab: activeTab });
    } else {
      // Remove tab parameter for default tab
      if (tabFromUrl) {
        setSearchParams({});
      }
    }
  }, [activeTab, setSearchParams, tabFromUrl]);

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
      value: 'enhanced-scanner',
      label: 'Enhanced Scanner',
      icon: <Sparkles className="h-4 w-4" />
    },
    {
      value: 'enhanced-designer',
      label: 'Enhanced Designer',
      icon: <Zap className="h-4 w-4" />
    },
    {
      value: 'templates',
      label: 'Templates',
      icon: <FileCode className="h-4 w-4" />
    },
    {
      value: 'guide',
      label: 'Prompting Guide',
      icon: <BookOpen className="h-4 w-4" />
    }
  ];

  return (
    <MainLayout>
      <PromptingProvider>
        <div className="space-y-8">
          <PageHeader 
            title="Prompting Tools"
            description="Learn best practices, improve your prompts, design structured prompts, and manage templates"
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="enhanced-scanner" className="space-y-6 mt-0">
              <EnhancedPromptScanner />
            </TabsContent>
            
            <TabsContent value="enhanced-designer" className="space-y-6 mt-0">
              <EnhancedPromptDesigner />
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
            
            <TabsContent value="guide" className="space-y-6 mt-0">
              <PromptingGuide />
            </TabsContent>
          </Tabs>
          
          <CreateTemplateDialog 
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
          />
        </div>
      </PromptingProvider>
    </MainLayout>
  );
};

export default Prompting;
