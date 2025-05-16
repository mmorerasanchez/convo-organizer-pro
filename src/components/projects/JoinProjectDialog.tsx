
import React from 'react';
import { Button } from '@/components/ui/button';
import { UsersIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface JoinProjectDialogProps {
  variant?: 'default' | 'card';
  trigger?: React.ReactNode;
  size?: 'sm' | 'default';
}

const JoinProjectDialog: React.FC<JoinProjectDialogProps> = ({ 
  variant = 'default',
  size = 'default'
}) => {
  // Create a disabled button with tooltip explaining the feature is unavailable
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={variant === 'card' ? 'default' : 'outline'} 
            size={size === 'sm' ? 'sm' : 'default'}
            className="w-full justify-start opacity-60 cursor-not-allowed filter blur-[0.3px]"
            disabled
          >
            <UsersIcon className="mr-2 h-4 w-4" />
            Join a Project
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This feature is currently unavailable</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default JoinProjectDialog;
