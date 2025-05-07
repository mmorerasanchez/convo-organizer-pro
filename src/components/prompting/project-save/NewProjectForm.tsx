
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

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
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="name">Project Name</Label>
        <Input 
          id="name" 
          value={projectName}
          onChange={onProjectNameChange}
          placeholder="Enter project name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea 
          id="description" 
          value={projectDescription}
          onChange={onProjectDescriptionChange}
          placeholder="Enter project description"
          className="min-h-[80px]"
        />
      </div>
      <Button 
        variant="outline" 
        className="w-full"
        onClick={onBack}
      >
        Back to Project Selection
      </Button>
    </div>
  );
}
