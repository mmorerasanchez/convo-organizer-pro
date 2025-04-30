
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PromptingGuide from '@/components/prompting/PromptingGuide';
import PromptScanner from '@/components/prompting/PromptScanner';
import PromptDesigner from '@/components/prompting/PromptDesigner';

const Prompting = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="border-b pb-4">
          <h1 className="text-2xl font-semibold tracking-tight mb-2">Prompting Tools</h1>
          <p className="text-muted-foreground">
            Learn best practices, improve your prompts, and design structured prompts with proven frameworks
          </p>
        </div>
        
        <Tabs defaultValue="guide" className="w-full">
          <div className="border-b mb-6">
            <TabsList className="w-full justify-start bg-transparent p-0 h-auto">
              <TabsTrigger 
                value="guide" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-3 h-auto text-base"
              >
                Prompting Guide
              </TabsTrigger>
              <TabsTrigger 
                value="scanner" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-3 h-auto text-base"
              >
                Prompt Scanner
              </TabsTrigger>
              <TabsTrigger 
                value="designer" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-3 h-auto text-base"
              >
                Prompt Designer
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="guide" className="space-y-6">
            <PromptingGuide />
          </TabsContent>
          
          <TabsContent value="scanner" className="space-y-6">
            <PromptScanner />
          </TabsContent>
          
          <TabsContent value="designer" className="space-y-6">
            <PromptDesigner />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Prompting;
