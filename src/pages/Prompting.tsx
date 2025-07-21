
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import PromptingGuide from '@/components/prompting/PromptingGuide';
import PromptScanner from '@/components/prompting/PromptScanner';
import PromptDesigner from '@/components/prompting/PromptDesigner';
import { EnhancedPromptScanner } from '@/components/prompting/scanner/EnhancedPromptScanner';
import { EnhancedPromptDesigner } from '@/components/prompting/designer/EnhancedPromptDesigner';
import { BookOpen, Bot, Wand2, Sparkles, Zap } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { PromptingProvider } from '@/components/prompting/context/PromptingContext';
import { PromptScannerProvider } from '@/components/prompting/context/usePromptScanner';

const Prompting = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = React.useState(() => {
    // Initialize tab from URL parameter or default to 'enhanced-scanner'
    const validTabs = ['enhanced-scanner', 'enhanced-designer', 'scanner', 'designer', 'guide'];
    return validTabs.includes(tabFromUrl || '') ? tabFromUrl : 'enhanced-scanner';
  });

  // Update active tab when URL parameter changes
  useEffect(() => {
    const validTabs = ['enhanced-scanner', 'enhanced-designer', 'scanner', 'designer', 'guide'];
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
      value: 'scanner',
      label: 'Legacy Scanner',
      icon: <Wand2 className="h-4 w-4" />
    },
    {
      value: 'designer',
      label: 'Legacy Designer',
      icon: <Bot className="h-4 w-4" />
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
            description="Learn best practices, improve your prompts, and design structured prompts with proven frameworks"
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
            
            <TabsContent value="scanner" className="space-y-6 mt-0">
              <PromptScannerProvider>
                <PromptScanner />
              </PromptScannerProvider>
            </TabsContent>
            
            <TabsContent value="designer" className="space-y-6 mt-0">
              <PromptDesigner />
            </TabsContent>
            
            <TabsContent value="guide" className="space-y-6 mt-0">
              <PromptingGuide />
            </TabsContent>
          </Tabs>
        </div>
      </PromptingProvider>
    </MainLayout>
  );
};

export default Prompting;
