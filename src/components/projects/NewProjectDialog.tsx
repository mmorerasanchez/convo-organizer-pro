
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { DialogWrapper } from '@/components/ui/dialog-wrapper';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { NewProjectForm } from '@/components/prompting/project-save/NewProjectForm';

interface NewProjectDialogProps {
  variant?: 'default' | 'card';
  trigger?: React.ReactNode;
}

const NewProjectDialog: React.FC<NewProjectDialogProps> = ({ 
  variant = 'default',
  trigger
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully');
      setIsOpen(false);
      setProjectName('');
      setProjectDescription('');
    },
    onError: (error) => {
      toast.error('Failed to create project');
      console.error(error);
    },
  });

  const handleSubmit = async () => {
    if (!projectName.trim()) {
      toast.error('Project name is required');
      return;
    }

    setIsProcessing(true);
    try {
      await createProjectMutation.mutateAsync({
        name: projectName,
        description: projectDescription,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const defaultTrigger = (
    <Button size="sm">
      <Plus className="h-4 w-4 mr-1" />
      New Project
    </Button>
  );

  return (
    <DialogWrapper
      trigger={trigger || defaultTrigger}
      title="Create New Project"
      open={isOpen}
      onOpenChange={setIsOpen}
      showCancel
      footer={
        <Button onClick={handleSubmit} disabled={isProcessing}>
          {isProcessing ? 'Creating...' : 'Create Project'}
        </Button>
      }
      isProcessing={isProcessing}
    >
      <div className="space-y-4">
        <NewProjectForm
          projectName={projectName}
          projectDescription={projectDescription}
          onProjectNameChange={(e) => setProjectName(e.target.value)}
          onProjectDescriptionChange={(e) => setProjectDescription(e.target.value)}
          onBack={() => {}}
        />
      </div>
    </DialogWrapper>
  );
};

export default NewProjectDialog;
