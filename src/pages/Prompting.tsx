
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PromptingGuide from '@/components/prompting/PromptingGuide';
import PromptScanner from '@/components/prompting/PromptScanner';

const Prompting = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Prompting Tools</h1>
        
        <Tabs defaultValue="guide" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="guide">Prompting Guide</TabsTrigger>
            <TabsTrigger value="scanner">Prompt Scanner</TabsTrigger>
          </TabsList>
          
          <TabsContent value="guide" className="space-y-4">
            <PromptingGuide />
          </TabsContent>
          
          <TabsContent value="scanner" className="space-y-4">
            <PromptScanner />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Prompting;
