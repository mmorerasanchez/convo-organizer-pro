
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CompiledPromptPreviewProps {
  compiledPrompt: string;
}

export function CompiledPromptPreview({ compiledPrompt }: CompiledPromptPreviewProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(compiledPrompt);
    toast({
      title: "Copied to clipboard",
      description: "The compiled prompt has been copied to your clipboard."
    });
  };

  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardHeader className="bg-white pb-2">
        <CardTitle className="text-lg font-medium">Compiled Prompt</CardTitle>
        <CardDescription className="text-sm">
          This is how your prompt will be sent to the model
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="bg-background p-4 rounded-md overflow-auto max-h-[300px] border">
          <pre className="font-mono text-sm whitespace-pre-wrap">
            {compiledPrompt}
          </pre>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/20 px-6 py-4 border-t">
        <Button 
          variant="outline" 
          onClick={handleCopy}
          className="gap-2 h-9 text-sm"
        >
          <Copy size={16} />
          Copy to Clipboard
        </Button>
      </CardFooter>
    </Card>
  );
}
