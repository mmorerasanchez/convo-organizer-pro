
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, RefreshCw, XCircle } from 'lucide-react';

interface PromptInputCardProps {
  promptInput: string;
  onChange: (value: string) => void;
  onScan: () => void;
  onClear: () => void;
  isProcessing: boolean;
}

export function PromptInputCard({
  promptInput,
  onChange,
  onScan,
  onClear,
  isProcessing,
}: PromptInputCardProps) {
  return (
    <Card className="overflow-hidden border shadow-sm">
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-medium">Your Original Prompt</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Enter your informal prompt to get AI-powered improvement suggestions
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Textarea 
          placeholder="Enter your prompt here... (e.g., 'Tell me about climate change')"
          className="min-h-[180px] bg-background border text-sm font-mono"
          value={promptInput}
          onChange={(e) => onChange(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/10 px-5 py-3 border-t">
        <Button 
          variant="ghost" 
          onClick={onClear} 
          className="text-sm h-8 px-3"
        >
          <XCircle className="h-4 w-4 mr-1" />
          Clear
        </Button>
        <Button 
          onClick={onScan} 
          disabled={!promptInput.trim() || isProcessing}
          className="gap-1.5 bg-primary hover:bg-primary/90 text-sm h-8 px-3"
        >
          {isProcessing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Brain className="h-3.5 w-3.5" />}
          {isProcessing ? 'Processing...' : 'Scan & Improve'}
        </Button>
      </CardFooter>
    </Card>
  );
}
