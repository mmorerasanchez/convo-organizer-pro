
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share, Copy, Check, Users, RefreshCw, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { generateShareLink, shareProjectWithUser, generateShortShareCode } from '@/lib/api';
import { Project } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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
  const [shareCode, setShareCode] = useState<string | null>(
    project.shareLink && project.shareLink.length < 36 ? project.shareLink : null
  );
  const [open, setOpen] = useState(false);
  const [shareType, setShareType] = useState<'link' | 'code'>(
    project.shareLink && project.shareLink.length < 36 ? 'code' : 'link'
  );
  const linkInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Update share link if project share_link changes
    if (project.shareLink && open) {
      if (project.shareLink.length < 36) {
        // It's likely a short code
        setShareCode(project.shareLink);
        setShareType('code');
      } else {
        // It's likely a UUID
        setShareLink(`${window.location.origin}/projects/shared/${project.shareLink}`);
        setShareType('link');
      }
    }
  }, [project.shareLink, open]);
  
  const generateShareLinkMutation = useMutation({
    mutationFn: () => generateShareLink(project.id),
    onSuccess: (shareLink) => {
      const fullShareLink = `${window.location.origin}/projects/shared/${shareLink}`;
      setShareLink(fullShareLink);
      setShareType('link');
      
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
  
  const generateShareCodeMutation = useMutation({
    mutationFn: () => generateShortShareCode(project.id),
    onSuccess: (shareCode) => {
      setShareCode(shareCode);
      setShareType('code');
      
      // Select the text in the input field once the share code is generated
      setTimeout(() => {
        if (linkInputRef.current) {
          linkInputRef.current.select();
        }
      }, 100);
      
      toast.success('Share code generated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error generating share code: ${error.message}`);
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
  
  const handleGenerateCode = () => {
    generateShareCodeMutation.mutate();
  };
  
  const handleShareWithUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      shareProjectMutation.mutate(email.trim());
    }
  };
  
  const handleCopyLink = () => {
    const textToCopy = shareType === 'link' ? shareLink : shareCode;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success(`Share ${shareType} copied to clipboard`);
      
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
          
          <Tabs value={shareType} onValueChange={(value) => setShareType(value as 'link' | 'code')} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="link" className="flex items-center gap-1">
                <LinkIcon className="h-4 w-4" />
                <span>Share Link</span>
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-1">
                <LinkIcon className="h-4 w-4" />
                <span>Share Code</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="link" className="space-y-4">
              <Label className="text-base font-medium">Share Link</Label>
              <div className="flex items-center gap-2">
                <Input 
                  ref={linkInputRef}
                  value={shareLink || ''} 
                  placeholder="Generate a share link" 
                  readOnly
                  className={cn("font-mono text-sm", !shareLink && "text-muted-foreground")}
                  onClick={(e) => shareLink && e.currentTarget.select()}
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
            </TabsContent>
            
            <TabsContent value="code" className="space-y-4">
              <Label className="text-base font-medium">Share Code</Label>
              <div className="flex items-center gap-2">
                <Input 
                  ref={linkInputRef}
                  value={shareCode || ''} 
                  placeholder="Generate a share code" 
                  readOnly
                  className={cn("font-mono text-sm", !shareCode && "text-muted-foreground")}
                  onClick={(e) => shareCode && e.currentTarget.select()}
                />
                {shareCode ? (
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
                    onClick={handleGenerateCode} 
                    disabled={generateShareCodeMutation.isPending}
                    className="flex-shrink-0 whitespace-nowrap gap-2"
                  >
                    {generateShareCodeMutation.isPending ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        <span>Generate Code</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
              
              {shareCode && (
                <p className="text-xs text-muted-foreground">
                  Share this shorter code with users. They can enter it directly in the "Join a Project" dialog.
                </p>
              )}
            </TabsContent>
          </Tabs>
          
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
