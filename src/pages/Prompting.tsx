
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import PromptingGuide from '@/components/prompting/PromptingGuide';
import { EnhancedPromptScanner } from '@/components/prompting/scanner/EnhancedPromptScanner';
import { EnhancedPromptDesigner } from '@/components/prompting/designer/EnhancedPromptDesigner';
import { BookOpen, Sparkles, Zap } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { PromptingProvider } from '@/components/prompting/context/PromptingContext';

const Prompting = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = React.useState(() => {
    // Initialize tab from URL parameter or default to 'scanner'
    const validTabs = ['scanner', 'designer', 'playbook'];
    return validTabs.includes(tabFromUrl || '') ? tabFromUrl : 'scanner';
  });

  // Update active tab when URL parameter changes
  useEffect(() => {
    const validTabs = ['scanner', 'designer', 'playbook'];
    if (validTabs.includes(tabFromUrl || '')) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // Sync URL with active tab
  useEffect(() => {
    if (activeTab && activeTab !== 'scanner') {
      setSearchParams({ tab: activeTab });
    } else {
      // Remove tab parameter for default tab
      if (tabFromUrl) {
        setSearchParams({});
      }
    }
  }, [activeTab, setSearchParams, tabFromUrl]);

  const tabs = [
    {
      value: 'scanner',
      label: 'Scanner',
      icon: <Sparkles className="h-4 w-4" />
    },
    {
      value: 'designer',
      label: 'Designer',
      icon: <Zap className="h-4 w-4" />
    },
    {
      value: 'playbook',
      label: 'Playbook',
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
            <TabsContent value="scanner" className="space-y-6 mt-0">
              <EnhancedPromptScanner />
            </TabsContent>
            
            <TabsContent value="designer" className="space-y-6 mt-0">
              <EnhancedPromptDesigner />
            </TabsContent>
            
            <TabsContent value="playbook" className="space-y-6 mt-0">
              <PromptingGuide />
            </TabsContent>
          </Tabs>
        </div>
      </PromptingProvider>
    </MainLayout>
  );
};

export default Prompting;
