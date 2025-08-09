
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { BookOpen, Sparkles, Zap, Loader2 } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { PromptingProvider } from '@/components/prompting/context/PromptingContext';

const PromptingGuide = React.lazy(() => import('@/components/prompting/PromptingGuide'));
const EnhancedPromptScanner = React.lazy(() => import('@/components/prompting/scanner/EnhancedPromptScanner').then(m => ({ default: m.EnhancedPromptScanner })));
const EnhancedPromptDesigner = React.lazy(() => import('@/components/prompting/designer/EnhancedPromptDesigner').then(m => ({ default: m.EnhancedPromptDesigner })));


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
              <React.Suspense fallback={<div className="py-12 flex items-center justify-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading scanner...</div>}>
                <EnhancedPromptScanner />
              </React.Suspense>
            </TabsContent>
            
            <TabsContent value="designer" className="space-y-6 mt-0">
              <React.Suspense fallback={<div className="py-12 flex items-center justify-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading designer...</div>}>
                <EnhancedPromptDesigner />
              </React.Suspense>
            </TabsContent>
            
            <TabsContent value="playbook" className="space-y-6 mt-0">
              <React.Suspense fallback={<div className="py-12 flex items-center justify-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading playbook...</div>}>
                <PromptingGuide />
              </React.Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </PromptingProvider>
    </MainLayout>
  );
};

export default Prompting;
