
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DialogWrapper } from '@/components/ui/dialog-wrapper';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedback: string;
  onFeedbackChange: (feedback: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function FeedbackDialog({
  open,
  onOpenChange,
  feedback,
  onFeedbackChange,
  onSubmit,
  isSubmitting = false,
}: FeedbackDialogProps) {
  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      title="Provide Improvement Feedback"
      description="Help us understand how you'd like the prompt to be improved."
      className="sm:max-w-[500px]"
      contentClassName="p-6 gap-6"
      showCancel={true}
      isProcessing={isSubmitting}
      footer={
        <Button 
          onClick={onSubmit}
          disabled={!feedback.trim() || isSubmitting}
          className="bg-primary hover:bg-primary/90 h-10"
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      }
    >
      <Textarea
        value={feedback}
        onChange={(e) => onFeedbackChange(e.target.value)}
        placeholder="e.g., Make it more concise, Add more context, Change the tone..."
        className="min-h-[120px] border rounded-md"
      />
    </DialogWrapper>
  );
}
