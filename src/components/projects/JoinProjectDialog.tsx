
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UsersIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const extractShareId = (input: string): string => {
    // Check if it's a URL and extract the UUID from it
    let shareId = input.trim();
    
    // If it contains a slash, it's likely a URL
    if (shareId.includes('/')) {
      const segments = shareId.split('/');
      // Get the last segment (which should be the UUID)
      shareId = segments[segments.length - 1];
      
      // Remove any trailing slashes or query params
      shareId = shareId.split('?')[0].split('#')[0].replace(/\/$/, '');
    }
    
    return shareId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectShareLink.trim()) {
      toast.error('Please enter a project share link');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Extract the UUID from URL if it's a full URL
      const shareId = extractShareId(projectShareLink);
      
      // Validate that it looks like a UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(shareId)) {
        throw new Error('Invalid project ID format');
      }
      
      // Navigate to the shared project view
      navigate(`/projects/shared/${shareId}`);
      setOpen(false);
      toast.success('Joining project...');
      
    } catch (error) {
      console.error('Error joining project:', error);
      toast.error('Failed to join project. Please check the project ID and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <Button variant={variant === 'card' ? 'default' : 'outline'}>
      <UsersIcon className="mr-2 h-4 w-4" />
      Join a Project
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <Input
              placeholder="Project Share Link or ID"
              value={projectShareLink}
              onChange={(e) => setProjectShareLink(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Example: https://yourapp.com/projects/shared/uuid or just paste the UUID directly
            </p>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Joining...' : 'Join Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinProjectDialog;
