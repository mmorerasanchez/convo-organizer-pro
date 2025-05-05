
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface ModelResponseProps {
  promptResponse: string;
}

export function ModelResponse({ promptResponse }: ModelResponseProps) {
  return (
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
    </Card>
  );
}
