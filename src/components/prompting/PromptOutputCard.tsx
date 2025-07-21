
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
    <Card className="h-full flex flex-col hover:shadow-md transition-all duration-200">
      <CardHeader className="bg-muted/50">
        <CardTitle>Improved Prompt</CardTitle>
        <CardDescription>
          AI-generated improvement based on prompt engineering best practices
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        {improvedPrompt ? (
          <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
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
        <CardFooter className="flex flex-wrap justify-between gap-3 border-t">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onTryAgain}
              disabled={isProcessing || !originalPrompt}
            >
              Try Again
            </Button>
            
            {canRevert && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRevert}
                disabled={isProcessing}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Revert
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={isProcessing}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={onSave}
              disabled={isProcessing || !improvedPrompt}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
            
            <Button
              onClick={onAccept}
              size="sm"
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
