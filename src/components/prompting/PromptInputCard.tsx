
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
    <Card>
      <CardHeader>
        <CardTitle>Your Original Prompt</CardTitle>
        <CardDescription>
          Enter your informal prompt to get AI-powered improvement suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea 
          placeholder="Enter your prompt here... (e.g., 'Tell me about climate change')"
          className="min-h-[200px]"
          value={promptInput}
          onChange={(e) => onChange(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClear}>Clear</Button>
        <Button 
          onClick={onScan} 
          disabled={!promptInput.trim() || isProcessing}
          className="gap-2"
        >
          {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
          {isProcessing ? 'Processing...' : 'Scan & Improve'}
        </Button>
      </CardFooter>
    </Card>
  );
}
