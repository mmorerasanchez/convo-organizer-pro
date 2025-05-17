
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { NewConversationForm } from './NewConversationForm';
import { useNewConversation } from './useNewConversation';

interface NewConversationDialogProps {
  trigger?: React.ReactNode;
  projectId?: string;
}

const NewConversationDialog: React.FC<NewConversationDialogProps> = ({ 
  trigger,
  projectId 
}) => {
  const { open, setOpen } = useNewConversation({ projectId });
  
  const triggerButton = trigger || (
    <Button className="gap-2">
      <Plus size={16} />
      New Conversation
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Conversation</DialogTitle>
        </DialogHeader>
        <NewConversationForm projectId={projectId} />
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationDialog;
