
import React from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { SaveDialogContent } from './project-save/DialogContent';
import { useSaveToProject } from './project-save/useSaveToProject';
import { Button } from '@/components/ui/button';

interface SaveToProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promptTitle: string;
  promptContent: string;
  responseContent?: string;
  onSaveComplete?: () => void;
}

export function SaveToProjectDialog({ 
  open, 
  onOpenChange, 
  promptTitle,
  promptContent,
  responseContent,
  onSaveComplete
}: SaveToProjectDialogProps) {
  const [conversationTitle, setConversationTitle] = React.useState(promptTitle || 'Untitled Prompt');
  
  const {
    selectedProjectId,
    setSelectedProjectId,
    newProjectName,
    setNewProjectName,
    newProjectDescription,
    setNewProjectDescription,
    showNewProjectForm,
    setShowNewProjectForm,
    isProcessing,
    error,
    projects,
    handleSaveConversation,
  } = useSaveToProject();

  const handleSave = async () => {
    await handleSaveConversation(
      conversationTitle, 
      promptContent, 
      responseContent,
      () => {
        if (onSaveComplete) {
          onSaveComplete();
        }
        onOpenChange(false);
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <SaveDialogContent
        error={error}
        conversationTitle={conversationTitle}
        onConversationTitleChange={(e) => setConversationTitle(e.target.value)}
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        showNewProjectForm={showNewProjectForm}
        newProjectName={newProjectName}
        newProjectDescription={newProjectDescription}
        onNewProjectNameChange={(e) => setNewProjectName(e.target.value)}
        onNewProjectDescriptionChange={(e) => setNewProjectDescription(e.target.value)}
        onShowNewProjectForm={() => setShowNewProjectForm(true)}
        onHideNewProjectForm={() => setShowNewProjectForm(false)}
        onCancel={() => onOpenChange(false)}
        onSave={handleSave}
        isProcessing={isProcessing}
      />
    </Dialog>
  );
}
