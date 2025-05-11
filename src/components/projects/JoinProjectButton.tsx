
import React from 'react';
import { UsersIcon } from 'lucide-react';
import JoinProjectDialog from './JoinProjectDialog';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const JoinProjectButton: React.FC = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="opacity-60 filter blur-[0.3px] pointer-events-none">
            <Button className="gap-2 cursor-not-allowed">
              <UsersIcon size={16} />
              Join a Project
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Coming soon</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default JoinProjectButton;
