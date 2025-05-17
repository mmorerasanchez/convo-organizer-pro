
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
}

export function NewProjectForm({
  projectName,
  projectDescription,
  onProjectNameChange,
  onProjectDescriptionChange,
  onBack
}: NewProjectFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h3 className="font-medium">Create New Project</h3>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="projectName">Project Name</Label>
        <Input
          id="projectName"
          value={projectName}
          onChange={onProjectNameChange}
          placeholder="Enter project name"
        />
        <p className="text-xs text-muted-foreground">
          Choose a descriptive name for your project to easily identify it later.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="projectDescription">Description (Optional)</Label>
        <Textarea
          id="projectDescription"
          value={projectDescription}
          onChange={onProjectDescriptionChange}
          placeholder="Describe what this project is about"
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          Add details about this project's purpose, goals, or any important information for collaborators.
        </p>
      </div>
    </div>
  );
}
