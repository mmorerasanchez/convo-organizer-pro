
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProjects, createProject } from '@/lib/api/projects';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [conversationTitle, setConversationTitle] = useState(promptTitle || 'Untitled Conversation');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's projects
  const { data: projects = [] } = useQuery({
    queryKey: ['projects-list'],
    queryFn: fetchProjects,
    enabled: !!user
  });

  // Create new project mutation
  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: (newProject) => {
      setSelectedProjectId(newProject.id);
      toast({
        title: "Project Created",
        description: `New project "${newProjectName}" created successfully.`
      });
      setShowNewProjectForm(false);
      
      // Invalidate projects query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['projects-list'] });
    },
    onError: (error) => {
      setError("Failed to create project. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create project. Please try again."
      });
      console.error("Error creating project:", error);
    }
  });

  // Save conversation mutation
  const saveConversationMutation = useMutation({
    mutationFn: async ({ 
      title, 
      content, 
      response, 
      projectId 
    }: { 
      title: string; 
      content: string; 
      response?: string; 
      projectId?: string 
    }) => {
      if (!user) throw new Error("User not authenticated");
      
      const conversationId = uuidv4();
      const now = new Date().toISOString();
      
      const conversationData = {
        id: conversationId,
        title,
        content,
        response: response || "",
        platform: "prompt-designer", // Adding the required platform field
        captured_at: now,  
        project_id: projectId || null,
        status: "active",
        user_id: user.id
      };
      
      const { error } = await supabase
        .from('conversations')
        .insert(conversationData);
        
      if (error) throw error;
      
      return conversationId;
    },
    onSuccess: (conversationId) => {
      toast({
        title: "Saved Successfully",
        description: "Your prompt has been saved to conversations."
      });
      
      if (onSaveComplete) {
        onSaveComplete();
      }
      
      // Clear any previous errors
      setError(null);
      
      // Ask if user wants to navigate to the conversation
      if (confirm("Would you like to view the saved conversation?")) {
        navigate(`/conversations/${conversationId}`);
      }
      
      onOpenChange(false);
    },
    onError: (error) => {
      setError("Failed to save conversation. Please try again.");
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "There was an error saving your conversation."
      });
      console.error("Error saving conversation:", error);
    }
  });

  const handleSaveConversation = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      
      // Validate inputs
      if (!conversationTitle.trim()) {
        setError("Conversation title is required");
        setIsProcessing(false);
        return;
      }
      
      // If creating new project
      if (showNewProjectForm && newProjectName.trim()) {
        await createProjectMutation.mutateAsync({
          name: newProjectName.trim(),
          description: newProjectDescription.trim()
        });
      }
      
      // Save the conversation
      await saveConversationMutation.mutateAsync({
        title: conversationTitle.trim(),
        content: promptContent,
        response: responseContent,
        projectId: selectedProjectId === 'none' ? undefined : selectedProjectId
      });
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Error in save process:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onChange={(e) => setConversationTitle(e.target.value)}
              placeholder="Enter a title for this conversation"
            />
          </div>
          
          {!showNewProjectForm ? (
            <div className="space-y-2">
              <Label htmlFor="project">Select Project</Label>
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
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
                <Textarea 
                  id="description" 
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Enter project description"
                  className="min-h-[80px]"
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
            onClick={handleSaveConversation}
            disabled={isProcessing || !conversationTitle.trim()}
          >
            {isProcessing ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
