
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PromptingGuide from '@/components/prompting/PromptingGuide';
import PromptScanner from '@/components/prompting/PromptScanner';
import PromptDesigner from '@/components/prompting/PromptDesigner';

const Prompting = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prompting Tools</h1>
          <p className="text-muted-foreground mt-2">
            Learn best practices, improve your prompts, and design structured prompts with proven frameworks
          </p>
        </div>
        
        <Tabs defaultValue="guide" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="guide">Prompting Guide</TabsTrigger>
            <TabsTrigger value="scanner">Prompt Scanner</TabsTrigger>
            <TabsTrigger value="designer">Prompt Designer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="guide" className="space-y-4">
            <PromptingGuide />
          </TabsContent>
          
          <TabsContent value="scanner" className="space-y-4">
            <PromptScanner />
          </TabsContent>
          
          <TabsContent value="designer" className="space-y-4">
            <PromptDesigner />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Prompting;
