
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Save } from "lucide-react";
import { toast } from "sonner";

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
    toast.success("Response copied to clipboard");
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>AI Response</span>
          {promptResponse && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-3 text-xs"
                onClick={handleCopy}
              >
                <Copy className="h-3.5 w-3.5 mr-1" /> Copy
              </Button>
              {onSaveToProject && (
                <Button 
                  size="sm" 
                  className="h-8 px-3 text-xs"
                  onClick={onSaveToProject}
                >
                  <Save className="h-3.5 w-3.5 mr-1" /> Save to Project
                </Button>
              )}
            </div>
          )}
        </CardTitle>
        <CardDescription>
          Response from the AI model based on your prompt
        </CardDescription>
      </CardHeader>
      <CardContent>
        {promptResponse ? (
          <div className="whitespace-pre-wrap p-4 bg-muted/30 rounded-md overflow-auto max-h-[500px] text-sm font-mono">
            {promptResponse}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>AI response will appear here after testing your prompt</p>
          </div>
        )}
      </CardContent>
      {promptResponse && (
        <CardFooter className="text-xs text-muted-foreground border-t pt-4">
          <p>
            Save successful prompts and responses to your projects for future reference and collaboration.
          </p>
        </CardFooter>
      )}
    </Card>
  );
};
