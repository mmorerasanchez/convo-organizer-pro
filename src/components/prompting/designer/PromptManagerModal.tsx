
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PromptState } from '@/hooks/use-prompt-designer';
import { useToast } from '@/hooks/use-toast';
import { fetchProjects, createProject } from '@/lib/api/projects';
import { useQuery } from '@tanstack/react-query';

interface PromptManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activePrompt: PromptState;
  onSave: () => Promise<boolean | void>;
}

export function PromptManagerModal({ 
  open, 
  onOpenChange, 
  activePrompt, 
  onSave 
}: PromptManagerModalProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch user's projects
  const { data: projects = [] } = useQuery({
    queryKey: ['projects-list'],
    queryFn: fetchProjects
  });

  const handleSaveVersion = async () => {
    try {
      setIsProcessing(true);
      
      // If creating new project
      if (showNewProjectForm && newProjectName.trim()) {
        const newProject = await createProject({
          name: newProjectName.trim(),
          description: newProjectDescription.trim()
        });
        
        if (newProject) {
          setSelectedProjectId(newProject.id);
          toast({
            title: "Project Created",
            description: `New project "${newProjectName}" created successfully.`
          });
        }
      }
      
      // Save the prompt version
      const saveResult = await onSave();
      
      // Handle project navigation if needed
      if (selectedProjectId) {
        toast({
          title: "Prompt Saved",
          description: "Your prompt has been saved successfully."
        });
        
        // Optionally navigate to the selected project
        if (confirm("Would you like to navigate to the selected project?")) {
          navigate(`/project/${selectedProjectId}`);
        }
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error in save process:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "There was an error saving your prompt."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Prompt</DialogTitle>
          <DialogDescription>
            Save your prompt and optionally attach it to a project.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!showNewProjectForm ? (
            <div className="space-y-2">
              <Label htmlFor="project">Select Project</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => setShowNewProjectForm(true)}
              >
                Create New Project
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input 
                  id="name" 
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter project name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input 
                  id="description" 
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Enter project description"
                />
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowNewProjectForm(false)}
              >
                Back to Project Selection
              </Button>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveVersion}
            disabled={isProcessing || (showNewProjectForm && !newProjectName.trim())}
          >
            {isProcessing ? "Saving..." : "Save Prompt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
