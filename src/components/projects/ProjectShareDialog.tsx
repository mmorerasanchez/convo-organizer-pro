
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share, Copy, Check, Users, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { generateShareLink, shareProjectWithUser } from '@/lib/api';
import { Project } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [shareLink, setShareLink] = useState<string | null>(
    project.shareLink ? `${window.location.origin}/projects/shared/${project.shareLink}` : null
  );
  const [open, setOpen] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Update share link if project share_link changes
    if (project.shareLink && open) {
      setShareLink(`${window.location.origin}/projects/shared/${project.shareLink}`);
    }
  }, [project.shareLink, open]);
  
  const generateShareLinkMutation = useMutation({
    mutationFn: () => generateShareLink(project.id),
    onSuccess: (shareLink) => {
      const fullShareLink = `${window.location.origin}/projects/shared/${shareLink}`;
      setShareLink(fullShareLink);
      
      // Select the text in the input field once the share link is generated
      setTimeout(() => {
        if (linkInputRef.current) {
          linkInputRef.current.select();
        }
      }, 100);
      
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="h-4 w-4" /> 
            Share Project: {project.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Alert className="bg-primary/10 border-primary/20">
            <AlertDescription>
              Share this project with others to collaborate. They'll see it in their "Shared Projects" section.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <Label className="text-base font-medium">Share Link</Label>
            <div className="flex items-center gap-2">
              <Input 
                ref={linkInputRef}
                value={shareLink || ''} 
                placeholder="Generate a share link" 
                readOnly
                className="font-mono text-sm"
                onClick={(e) => e.currentTarget.select()}
              />
              {shareLink ? (
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleCopyLink} 
                  className="flex-shrink-0"
                  title="Copy to clipboard"
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
                  className="flex-shrink-0 whitespace-nowrap gap-2"
                >
                  {generateShareLinkMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      <span>Generate Link</span>
                    </>
                  )}
                </Button>
              )}
            </div>
            
            {shareLink && (
              <p className="text-xs text-muted-foreground">
                Anyone with this link can join this project. Generate a new link if you need to revoke access.
              </p>
            )}
          </div>
          
          <Separator />
          
          <div>
            <form onSubmit={handleShareWithUser} className="space-y-4">
              <Label htmlFor="email" className="text-base font-medium">Invite by Email</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={shareProjectMutation.isPending || !email.trim()}
                  className="flex-shrink-0 whitespace-nowrap gap-2"
                >
                  {shareProjectMutation.isPending ? (
                    <>
                      <Users className="h-4 w-4" />
                      <span>Sharing...</span>
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4" />
                      <span>Invite</span>
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                The user must have an account with this email to access the project.
              </p>
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
