
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, CheckCircle2, ArrowLeft, RefreshCw, ThumbsUp, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SaveToProjectDialog } from './SaveToProjectDialog';

interface PromptOutputCardProps {
  improvedPrompt: string;
  onTryAgain: () => void;
  onRevert: () => void;
  onAccept: () => void;
  isProcessing: boolean;
  canRevert: boolean;
  originalPrompt?: string;
}

export function PromptOutputCard({
  improvedPrompt,
  onTryAgain,
  onRevert,
  onAccept,
  isProcessing,
  canRevert,
  originalPrompt,
}: PromptOutputCardProps) {
  const [copied, setCopied] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(improvedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied to clipboard",
      description: "The improved prompt has been copied to your clipboard.",
      duration: 2000,
    });
  };

  return (
    <>
      <Card className="overflow-hidden border">
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-medium">Improved Prompt</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Enhanced based on prompt engineering best practices
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Textarea 
            placeholder="Your improved prompt will appear here..."
            className="min-h-[180px] bg-background border rounded-md font-mono text-sm prompt-area"
            value={improvedPrompt}
            readOnly
          />
        </CardContent>
        <CardFooter className="flex flex-col space-y-3 bg-muted/10 px-5 py-3 border-t">
          <div className="w-full flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Not satisfied? Provide feedback for further improvement.
            </p>
            {improvedPrompt && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopy}
                className="gap-1.5 h-7 text-xs font-mono"
              >
                {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            )}
          </div>
          
          {improvedPrompt && (
            <div className="w-full flex justify-between gap-2">
              {canRevert && (
                <Button 
                  variant="outline" 
                  onClick={onRevert}
                  className="gap-1.5 text-xs h-8 px-3 font-mono"
                >
                  <ArrowLeft size={14} />
                  Previous
                </Button>
              )}
              
              <Button 
                variant="outline" 
                onClick={onTryAgain}
                className="gap-1.5 text-xs h-8 px-3 font-mono"
                disabled={isProcessing}
              >
                <RefreshCw size={14} />
                Try Again
              </Button>
              
              {improvedPrompt && (
                <Button
                  variant="outline"
                  onClick={() => setSaveDialogOpen(true)}
                  className="gap-1.5 text-xs h-8 px-3 font-mono"
                  disabled={isProcessing}
                >
                  <Save size={14} />
                  Save
                </Button>
              )}
              
              <Button 
                onClick={onAccept}
                className="gap-1.5 bg-primary hover:bg-primary/90 text-xs h-8 px-3 font-mono"
                disabled={isProcessing}
              >
                <ThumbsUp size={14} />
                Accept
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
      
      <SaveToProjectDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        promptTitle="Improved Prompt"
        promptContent={originalPrompt || ""}
        responseContent={improvedPrompt}
      />
    </>
  );
}
