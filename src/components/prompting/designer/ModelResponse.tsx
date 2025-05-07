
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface ModelResponseProps {
  promptResponse: string;
  compiledPrompt: string;
  onSaveToProject?: () => void;
}

export const ModelResponse = ({ 
  promptResponse,
  compiledPrompt,
  onSaveToProject
}: ModelResponseProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(promptResponse);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 pb-4">
        <CardTitle className="text-md">Model Response</CardTitle>
        <CardDescription>The response from the AI model</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {promptResponse ? (
          <Textarea 
            value={promptResponse}
            readOnly
            className="min-h-[300px] font-mono text-sm border-0 rounded-none resize-none focus-visible:ring-0"
          />
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground bg-muted/30 p-8 text-center">
            <p>No response yet. Click "Test Prompt" to see the model's response.</p>
          </div>
        )}
      </CardContent>
      {promptResponse && (
        <CardFooter className="flex justify-end gap-2 p-2 border-t">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5"
            onClick={handleCopy}
          >
            <Copy className="h-3.5 w-3.5" />
            Copy
          </Button>
          <Button 
            variant="secondary"
            size="sm"
            className="h-8 gap-1.5"
            onClick={onSaveToProject}
          >
            <Save className="h-3.5 w-3.5" />
            Save to Project
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
