
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, RefreshCw } from 'lucide-react';

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
      <CardHeader className="bg-white pb-0">
        <CardTitle className="text-lg font-medium">Your Original Prompt</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Enter your informal prompt to get AI-powered improvement suggestions
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Textarea 
          placeholder="Enter your prompt here... (e.g., 'Tell me about climate change')"
          className="min-h-[200px] bg-background border rounded-md"
          value={promptInput}
          onChange={(e) => onChange(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/20 px-6 py-4 border-t">
        <Button variant="ghost" onClick={onClear} className="text-sm h-9">Clear</Button>
        <Button 
          onClick={onScan} 
          disabled={!promptInput.trim() || isProcessing}
          className="gap-2 bg-primary hover:bg-primary/90 text-sm h-9"
        >
          {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
          {isProcessing ? 'Processing...' : 'Scan & Improve'}
        </Button>
      </CardFooter>
    </Card>
  );
}
