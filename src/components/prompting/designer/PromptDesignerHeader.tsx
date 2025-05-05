
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { TokenUsageDisplay } from './TokenUsageDisplay';

interface PromptDesignerHeaderProps {
  handleNewPrompt: () => void;
  tokenUsage?: number;
  tokenLimit?: number;
}

export function PromptDesignerHeader({ 
  handleNewPrompt, 
  tokenUsage = 0, 
  tokenLimit = 10 
}: PromptDesignerHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold mb-1">Prompt Designer</h2>
        <p className="text-muted-foreground text-sm">Create, test, and iterate on prompts using proven frameworks</p>
      </div>
      <div className="flex items-center gap-4">
        <TokenUsageDisplay currentUsage={tokenUsage} limit={tokenLimit} />
        <Button onClick={handleNewPrompt} className="gap-2 h-9 bg-white border hover:bg-muted/50 text-foreground shadow-sm">
          <PlusCircle size={16} />
          New Prompt
        </Button>
      </div>
    </div>
  );
}
