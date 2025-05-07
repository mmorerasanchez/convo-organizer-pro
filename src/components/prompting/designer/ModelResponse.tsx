
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SaveToProjectDialog } from '../SaveToProjectDialog';

interface ModelResponseProps {
  promptResponse: string;
  compiledPrompt?: string;
}

export function ModelResponse({ promptResponse, compiledPrompt }: ModelResponseProps) {
  const [copied, setCopied] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    if (!promptResponse) return;
    
    navigator.clipboard.writeText(promptResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied to clipboard",
      description: "The response has been copied to your clipboard.",
    });
  };

  return (
    <>
      <Card className="border shadow-sm overflow-hidden">
        <CardHeader className="bg-white pb-2">
          <CardTitle className="text-lg font-medium">Model Response</CardTitle>
          <CardDescription className="text-sm">
            The output from the model based on your prompt
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="bg-background p-4 rounded-md overflow-auto max-h-[300px] border">
            {promptResponse ? (
              <div className="font-mono text-sm whitespace-pre-wrap">
                {promptResponse}
              </div>
            ) : (
              <div className="text-muted-foreground italic text-sm">
                Generate a response to see the output here
              </div>
            )}
          </div>
        </CardContent>
        
        {promptResponse && (
          <CardFooter className="flex justify-end space-x-2 pt-0 pb-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSaveDialogOpen(true)}
              className="h-8 gap-1.5"
            >
              <Save size={14} />
              Save to Project
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleCopy}
              className="h-8 gap-1.5"
            >
              {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </CardFooter>
        )}
      </Card>
      
      <SaveToProjectDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        promptTitle="Prompt Design Response"
        promptContent={compiledPrompt || ""}
        responseContent={promptResponse}
      />
    </>
  );
}
