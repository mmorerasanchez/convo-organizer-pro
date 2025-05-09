
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
  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Save to Project</DialogTitle>
        <DialogDescription>
          Save this prompt and response to your conversations and link it to a project.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        {error && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="title">Conversation Title</Label>
          <Input 
            id="title" 
            value={conversationTitle}
            onChange={onConversationTitleChange}
            placeholder="Enter a title for this conversation"
          />
        </div>
        
        {!showNewProjectForm ? (
          <ProjectSelector
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={onSelectProject}
            onCreateNewProject={onShowNewProjectForm}
          />
        ) : (
          <NewProjectForm
            projectName={newProjectName}
            projectDescription={newProjectDescription}
            onProjectNameChange={onNewProjectNameChange}
            onProjectDescriptionChange={onNewProjectDescriptionChange}
            onBack={onHideNewProjectForm}
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
          disabled={isProcessing || !conversationTitle.trim()}
        >
          {isProcessing ? "Saving..." : "Save"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
