
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface NewProjectFormProps {
  projectName: string;
  projectDescription: string;
  onProjectNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProjectDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBack: () => void;
  disabled?: boolean;
  showHeader?: boolean;
}

export function NewProjectForm({
  projectName,
  projectDescription,
  onProjectNameChange,
  onProjectDescriptionChange,
  onBack,
  disabled = false,
  showHeader = false
}: NewProjectFormProps) {
  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            disabled={disabled}
            className="gap-1 px-2"
          >
            <ArrowLeft className="h-3 w-3" />
            Back
          </Button>
          <Label className="text-base font-medium">Create New Project</Label>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="project-name">Project Name *</Label>
        <Input
          id="project-name"
          value={projectName}
          onChange={onProjectNameChange}
          placeholder="Enter project name"
          disabled={disabled}
          className={!projectName.trim() ? 'border-destructive' : ''}
        />
        <p className="text-xs text-muted-foreground">
          Choose a descriptive name for your project
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="project-description">Description (Optional)</Label>
        <Textarea
          id="project-description"
          value={projectDescription}
          onChange={onProjectDescriptionChange}
          placeholder="Describe what this project is about..."
          disabled={disabled}
          rows={3}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Help others understand the purpose of this project
        </p>
      </div>
    </div>
  );
}
