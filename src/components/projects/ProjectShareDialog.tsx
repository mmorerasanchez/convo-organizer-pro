
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { generateShareLink, shareProjectWithUser } from '@/lib/api';
import { Project } from '@/lib/types';

interface ProjectShareDialogProps {
  project: Project;
  trigger?: React.ReactNode;
}

const ProjectShareDialog: React.FC<ProjectShareDialogProps> = ({ 
  project,
  trigger 
}) => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  
  const generateShareLinkMutation = useMutation({
    mutationFn: () => generateShareLink(project.id),
    onSuccess: (shareLink) => {
      setShareLink(`${window.location.origin}/projects/shared/${shareLink}`);
      toast.success('Share link generated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error generating share link: ${error.message}`);
    }
  });
  
  const shareProjectMutation = useMutation({
    mutationFn: (email: string) => shareProjectWithUser(project.id, email),
    onSuccess: () => {
      toast.success(`Project shared with ${email} successfully`);
      setEmail('');
    },
    onError: (error: Error) => {
      toast.error(`Error sharing project: ${error.message}`);
    }
  });
  
  const handleGenerateLink = () => {
    generateShareLinkMutation.mutate();
  };
  
  const handleShareWithUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      shareProjectMutation.mutate(email.trim());
    }
  };
  
  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success('Share link copied to clipboard');
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };
  
  const triggerButton = trigger || (
    <Button variant="outline" size="sm" className="gap-2">
      <Share className="h-4 w-4" />
      Share
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <Label>Share Link</Label>
            <div className="flex items-center gap-2">
              <Input 
                value={shareLink || ''} 
                placeholder="Generate a share link" 
                readOnly 
              />
              {shareLink ? (
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleCopyLink} 
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={handleGenerateLink} 
                  disabled={generateShareLinkMutation.isPending}
                  className="flex-shrink-0 whitespace-nowrap"
                >
                  {generateShareLinkMutation.isPending ? 'Generating...' : 'Generate Link'}
                </Button>
              )}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <form onSubmit={handleShareWithUser} className="space-y-4">
              <Label htmlFor="email">Share with User</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter user email"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={shareProjectMutation.isPending || !email.trim()}
                  className="flex-shrink-0 whitespace-nowrap"
                >
                  {shareProjectMutation.isPending ? 'Sharing...' : 'Share'}
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectShareDialog;
