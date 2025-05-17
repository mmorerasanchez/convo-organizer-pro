
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Conversation } from '@/lib/types';
import { useEditConversation } from './useEditConversation';
import EditConversationForm from './EditConversationForm';

interface EditConversationDialogProps {
  conversation: Conversation;
  trigger?: React.ReactNode;
}

const EditConversationDialog: React.FC<EditConversationDialogProps> = ({ 
  conversation,
  trigger 
}) => {
  const {
    title,
    setTitle,
    content,
    setContent,
    platform,
    setPlatform,
    projectId,
    setProjectId,
    externalId,
    setExternalId,
    status,
    setStatus,
    type,
    setType,
    modelId,
    setModelId,
    open,
    setOpen,
    projects,
    models,
    isPending,
    handleSubmit
  } = useEditConversation(conversation);
  
  const triggerButton = trigger || (
    <Button variant="outline" size="icon">
      <Edit className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Conversation</DialogTitle>
        </DialogHeader>
        <EditConversationForm
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          platform={platform}
          setPlatform={setPlatform}
          projectId={projectId}
          setProjectId={setProjectId}
          externalId={externalId}
          setExternalId={setExternalId}
          status={status}
          setStatus={setStatus}
          type={type}
          setType={setType}
          modelId={modelId}
          setModelId={setModelId}
          projects={projects}
          models={models}
          isPending={isPending}
          handleSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditConversationDialog;
