
import React from 'react';
import { 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogContent 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProjectSelector } from './ProjectSelector';
import { NewProjectForm } from './NewProjectForm';
import { Project } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface SaveDialogContentProps {
  error: string | null;
  conversationTitle: string;
  onConversationTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (projectId: string) => void;
  showNewProjectForm: boolean;
  newProjectName: string;
  newProjectDescription: string;
  onNewProjectNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNewProjectDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onShowNewProjectForm: () => void;
  onHideNewProjectForm: () => void;
  onCancel: () => void;
  onSave: () => void;
  isProcessing: boolean;
}

export function SaveDialogContent({
  error,
  conversationTitle,
  onConversationTitleChange,
  projects,
  selectedProjectId,
  onSelectProject,
  showNewProjectForm,
  newProjectName,
  newProjectDescription,
  onNewProjectNameChange,
  onNewProjectDescriptionChange,
  onShowNewProjectForm,
  onHideNewProjectForm,
  onCancel,
  onSave,
  isProcessing
}: SaveDialogContentProps) {
  
  // Determine if save button should be disabled
  const isSaveDisabled = isProcessing || 
    !conversationTitle.trim() || 
    (showNewProjectForm ? !newProjectName.trim() : !selectedProjectId);

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Save to Project</DialogTitle>
        <DialogDescription>
          Organize your prompts and responses in projects for better knowledge management and collaboration.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        {error && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm border border-destructive/20">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="title">Conversation Title *</Label>
          <Input 
            id="title" 
            value={conversationTitle}
            onChange={onConversationTitleChange}
            placeholder="Enter a title for this conversation"
            disabled={isProcessing}
            className={!conversationTitle.trim() ? 'border-destructive' : ''}
          />
          <p className="text-xs text-muted-foreground">
            This title will help you identify your prompt in your project's conversation list.
          </p>
        </div>
        
        {!showNewProjectForm ? (
          <ProjectSelector
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={onSelectProject}
            onCreateNewProject={onShowNewProjectForm}
            disabled={isProcessing}
          />
        ) : (
          <NewProjectForm
            projectName={newProjectName}
            projectDescription={newProjectDescription}
            onProjectNameChange={onNewProjectNameChange}
            onProjectDescriptionChange={onNewProjectDescriptionChange}
            onBack={onHideNewProjectForm}
            disabled={isProcessing}
            showHeader={true}
          />
        )}
      </div>
      
      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button 
          onClick={onSave}
          disabled={isSaveDisabled}
          className="min-w-[120px]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save to Project"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
