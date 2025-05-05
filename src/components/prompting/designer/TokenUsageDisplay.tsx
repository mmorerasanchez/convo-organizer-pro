
import React from 'react';
import { CircleHelp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TokenUsageDisplayProps {
  currentUsage: number;
  limit: number;
}

export function TokenUsageDisplay({ currentUsage, limit }: TokenUsageDisplayProps) {
  const percentage = Math.min((currentUsage / limit) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isOverLimit = percentage >= 100;
  
  return (
    <div className="flex items-center gap-1.5">
      <div className="text-sm font-medium">
        <span className={`mr-1 ${isOverLimit ? 'text-red-500' : isNearLimit ? 'text-amber-500' : ''}`}>
          {currentUsage}
        </span> 
        / {limit} tokens
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <CircleHelp className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent side="top" align="center" className="max-w-[250px]">
            <p>Free tier usage limit. Upgrade for unlimited tokens.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div className="ml-2 h-2 w-24 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${
            isOverLimit 
              ? 'bg-red-500' 
              : isNearLimit 
                ? 'bg-amber-500' 
                : 'bg-primary'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
