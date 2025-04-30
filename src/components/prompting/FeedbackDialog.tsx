
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedback: string;
  onFeedbackChange: (feedback: string) => void;
  onSubmit: () => void;
}

export function FeedbackDialog({
  open,
  onOpenChange,
  feedback,
  onFeedbackChange,
  onSubmit,
}: FeedbackDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6 gap-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-semibold">Provide Improvement Feedback</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Help us understand how you'd like the prompt to be improved.
          </DialogDescription>
        </DialogHeader>
        
        <Textarea
          value={feedback}
          onChange={(e) => onFeedbackChange(e.target.value)}
          placeholder="e.g., Make it more concise, Add more context, Change the tone..."
          className="min-h-[120px] border rounded-md"
        />
        
        <DialogFooter className="flex gap-3 pt-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="h-10"
          >
            Cancel
          </Button>
          <Button 
            onClick={onSubmit}
            disabled={!feedback.trim()}
            className="bg-primary hover:bg-primary/90 h-10"
          >
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
