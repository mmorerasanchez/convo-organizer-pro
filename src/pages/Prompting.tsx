
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { TabsContent } from '@/components/ui/tabs';
import PromptingGuide from '@/components/prompting/PromptingGuide';
import PromptScanner from '@/components/prompting/PromptScanner';
import PromptDesigner from '@/components/prompting/PromptDesigner';
import { BookOpen, Lightbulb, Wand2 } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';

const Prompting = () => {
  const [activeTab, setActiveTab] = React.useState('guide');

  const tabs = [
    {
      value: 'guide',
      label: 'Prompting Guide',
      icon: <BookOpen className="h-4 w-4" />
    },
    {
      value: 'scanner',
      label: 'Prompt Scanner',
      icon: <Wand2 className="h-4 w-4" />
    },
    {
      value: 'designer',
      label: 'Prompt Designer',
      icon: <Lightbulb className="h-4 w-4" />
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <PageHeader 
          title="Prompting Tools"
          description="Learn best practices, improve your prompts, and design structured prompts with proven frameworks"
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div>
          <TabsContent value="guide" className="space-y-6 mt-0">
            <PromptingGuide />
          </TabsContent>
          
          <TabsContent value="scanner" className="space-y-6 mt-0">
            <PromptScanner />
          </TabsContent>
          
          <TabsContent value="designer" className="space-y-6 mt-0">
            <PromptDesigner />
          </TabsContent>
        </div>
      </div>
    </MainLayout>
  );
};

export default Prompting;
