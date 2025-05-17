
import React from 'react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { CheckCircle } from 'lucide-react';

interface NavigationConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message?: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function NavigationConfirmDialog({
  open,
  onOpenChange,
  title = "View Saved Item",
  message = "Would you like to view the item you just saved?",
  onConfirm,
  isLoading = false
}: NavigationConfirmDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={message}
      confirmText="View Now"
      cancelText="Stay Here"
      onConfirm={onConfirm}
      variant="success"
      isProcessing={isLoading}
    />
  );
}
