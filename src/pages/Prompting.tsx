
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PromptingGuide from '@/components/prompting/PromptingGuide';
import PromptScanner from '@/components/prompting/PromptScanner';
import PromptScannerSettings from '@/components/prompting/PromptScannerSettings';

const Prompting = () => {
  const [openaiApiKey, setOpenaiApiKey] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    // Load API key from localStorage on component mount
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setOpenaiApiKey(savedKey);
    }
  }, []);

  const handleApiKeyChange = (apiKey: string) => {
    setOpenaiApiKey(apiKey);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Prompting Tools</h1>
            <p className="text-muted-foreground mt-2">
              Learn best practices for crafting effective prompts and improve your inputs for better AI-generated outputs
            </p>
          </div>
          <PromptScannerSettings onApiKeyChange={handleApiKeyChange} />
        </div>
        
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
