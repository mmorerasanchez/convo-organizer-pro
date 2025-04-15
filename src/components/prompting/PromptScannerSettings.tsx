
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PromptScannerSettingsProps {
  onApiKeyChange: (apiKey: string) => void;
}

const PromptScannerSettings: React.FC<PromptScannerSettingsProps> = ({ onApiKeyChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    if (apiKey.trim()) {
      onApiKeyChange(apiKey.trim());
      localStorage.setItem('openai_api_key', apiKey.trim());
      
      toast({
        title: "API Key Saved",
        description: "Your OpenAI API key has been saved securely in your browser's local storage.",
      });
      
      setIsOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "API Key Required",
        description: "Please enter a valid OpenAI API key to use the prompt improvement feature.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings size={16} />
          API Settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>OpenAI API Settings</DialogTitle>
          <DialogDescription>
            Enter your OpenAI API key to use the AI-powered prompt improvement feature.
            Your key will be stored securely in your browser's local storage.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <label htmlFor="api-key" className="text-sm font-medium block mb-2">
            OpenAI API Key
          </label>
          <Input
            id="api-key"
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Don't have an API key? Get one from{" "}
            <a 
              href="https://platform.openai.com/api-keys" 
              target="_blank" 
              rel="noreferrer"
              className="text-primary underline"
            >
              OpenAI's platform
            </a>.
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PromptScannerSettings;
