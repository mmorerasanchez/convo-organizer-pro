
import React from 'react';
import { UsersIcon } from 'lucide-react';
import JoinProjectDialog from './JoinProjectDialog';
import { Button } from '@/components/ui/button';

const JoinProjectButton: React.FC = () => {
  return (
    <JoinProjectDialog 
      trigger={
        <Button className="gap-2">
          <UsersIcon size={16} />
          Join a Project
        </Button>
      }
    />
  );
};

export default JoinProjectButton;
