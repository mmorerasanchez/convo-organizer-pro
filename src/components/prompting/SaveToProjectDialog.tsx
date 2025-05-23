
import React from 'react';
import { SaveDialogContent } from './project-save/DialogContent';
import { useSaveToProject } from './project-save/useSaveToProject';
import { DialogWrapper } from '@/components/ui/dialog-wrapper';
import { NavigationConfirmDialog } from '@/components/common/NavigationConfirmDialog';

interface SaveToProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promptTitle: string;
  promptContent: string;
  responseContent?: string;
  onSaveComplete?: () => void;
  source?: string; // Added source parameter to track where this save came from
}

export function SaveToProjectDialog({ 
  open, 
  onOpenChange, 
  promptTitle,
  promptContent,
  responseContent,
  onSaveComplete,
  source
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
    showNavigationConfirm,
    setShowNavigationConfirm,
    handleNavigateToConversation
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
      },
      source // Pass the source parameter to handleSaveConversation
    );
  };

  return (
    <>
      <DialogWrapper
        open={open}
        onOpenChange={onOpenChange}
      >
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
      </DialogWrapper>
      
      {/* Navigation confirmation dialog */}
      <NavigationConfirmDialog
        open={showNavigationConfirm}
        onOpenChange={setShowNavigationConfirm}
        title="View Saved Conversation"
        message="Your conversation has been saved successfully. Would you like to view it now?"
        onConfirm={handleNavigateToConversation}
      />
    </>
  );
}
