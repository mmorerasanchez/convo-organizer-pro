
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy, Save } from 'lucide-react';

interface PromptOutputCardProps {
  improvedPrompt: string;
  onTryAgain: () => void;
  onRevert: () => void;
  onAccept: () => void;
  onSave: () => void;
  isProcessing: boolean;
  canRevert: boolean;
  originalPrompt: string;
}

export const PromptOutputCard = ({ 
  improvedPrompt, 
  onTryAgain, 
  onRevert,
  onAccept,
  onSave,
  isProcessing,
  canRevert,
  originalPrompt
}: PromptOutputCardProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(improvedPrompt);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="bg-muted/50 pb-4">
        <CardTitle className="text-md">Improved Prompt</CardTitle>
        <CardDescription>
          AI-generated improvement based on prompt engineering best practices
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        {improvedPrompt ? (
          <div className="whitespace-pre-wrap font-mono text-sm">
            {improvedPrompt}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-center">
            <p>
              {isProcessing
                ? "Processing your prompt..."
                : "Enter a prompt and click 'Improve' to see suggestions."}
            </p>
          </div>
        )}
      </CardContent>
      
      {improvedPrompt && (
        <CardFooter className="flex flex-wrap justify-between gap-2 border-t pt-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onTryAgain}
              className="h-8"
              disabled={isProcessing || !originalPrompt}
            >
              Try Again
            </Button>
            
            {canRevert && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRevert}
                className="h-8 gap-1"
                disabled={isProcessing}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Revert
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8 gap-1.5"
              disabled={isProcessing}
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={onSave}
              className="h-8 gap-1.5"
              disabled={isProcessing || !improvedPrompt}
            >
              <Save className="h-3.5 w-3.5" />
              Save
            </Button>
            
            <Button
              onClick={onAccept}
              size="sm"
              className="h-8"
              disabled={isProcessing || !improvedPrompt}
            >
              Accept
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
