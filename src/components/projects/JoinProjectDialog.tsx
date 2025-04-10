
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UsersIcon, Link } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { joinProjectByShareLink, extractShareId } from '@/lib/api';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface JoinProjectDialogProps {
  variant?: 'default' | 'card';
  trigger?: React.ReactNode;
}

const JoinProjectDialog: React.FC<JoinProjectDialogProps> = ({ 
  variant = 'default',
  trigger
}) => {
  const [open, setOpen] = useState(false);
  const [projectShareLink, setProjectShareLink] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Set up mutation for joining a project
  const joinProjectMutation = useMutation({
    mutationFn: (shareId: string) => joinProjectByShareLink(shareId),
    onSuccess: (project) => {
      // Invalidate shared projects query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['shared-projects'] });
      
      // Show success message
      toast.success(`Successfully joined project "${project.name}"`);
      
      // Close the dialog and navigate to the project
      setOpen(false);
      navigate(`/projects/${project.id}`);
    },
    onError: (error: Error) => {
      console.error('Error joining project:', error);
      toast.error(error.message || 'Failed to join project');
      setValidationError(error.message || 'Invalid project share link');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    
    if (!projectShareLink.trim()) {
      setValidationError('Please enter a project share link or ID');
      return;
    }
    
    try {
      // Extract the UUID from URL if it's a full URL
      const shareId = extractShareId(projectShareLink);
      
      // Validate that it looks like a UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(shareId)) {
        setValidationError('Invalid project ID format. Please provide a valid share link or ID.');
        return;
      }
      
      // Submit the share ID to join the project
      joinProjectMutation.mutate(shareId);
      
    } catch (error) {
      console.error('Error validating project link:', error);
      setValidationError('Failed to process the link. Please check the format and try again.');
    }
  };

  const defaultTrigger = (
    <Button variant={variant === 'card' ? 'default' : 'outline'}>
      <UsersIcon className="mr-2 h-4 w-4" />
      Join a Project
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) {
        // Reset state when dialog closes
        setProjectShareLink('');
        setValidationError(null);
      }
    }}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join a Project</DialogTitle>
          <DialogDescription>
            Enter the project share link or ID provided to you to access the shared project.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Link className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Project Share Link or ID"
                value={projectShareLink}
                onChange={(e) => {
                  setProjectShareLink(e.target.value);
                  setValidationError(null);
                }}
                disabled={joinProjectMutation.isPending}
                required
                className="flex-1"
              />
            </div>
            
            <p className="text-xs text-muted-foreground">
              Example: https://yourapp.com/projects/shared/uuid or just paste the UUID directly
            </p>
            
            {validationError && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={joinProjectMutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={joinProjectMutation.isPending}>
              {joinProjectMutation.isPending ? 'Joining...' : 'Join Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinProjectDialog;
