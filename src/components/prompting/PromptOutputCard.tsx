
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, CheckCircle2, ArrowLeft, RefreshCw, ThumbsUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PromptOutputCardProps {
  improvedPrompt: string;
  onTryAgain: () => void;
  onRevert: () => void;
  onAccept: () => void;
  isProcessing: boolean;
  canRevert: boolean;
}

export function PromptOutputCard({
  improvedPrompt,
  onTryAgain,
  onRevert,
  onAccept,
  isProcessing,
  canRevert,
}: PromptOutputCardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(improvedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Improved Prompt</CardTitle>
        <CardDescription>
          Enhanced based on prompt engineering best practices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea 
          placeholder="Your improved prompt will appear here..."
          className="min-h-[200px]"
          value={improvedPrompt}
          readOnly
        />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="w-full flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Not satisfied? Provide feedback for further improvement.
          </p>
          {improvedPrompt && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          )}
        </div>
        
        {improvedPrompt && (
          <div className="w-full flex justify-between gap-4">
            {canRevert && (
              <Button 
                variant="outline" 
                onClick={onRevert}
                className="gap-2"
              >
                <ArrowLeft size={16} />
                Previous Version
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={onTryAgain}
              className="gap-2"
              disabled={isProcessing}
            >
              <RefreshCw size={16} />
              Try Again
            </Button>
            
            <Button 
              onClick={onAccept}
              className="gap-2"
              disabled={isProcessing}
            >
              <ThumbsUp size={16} />
              Accept
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
