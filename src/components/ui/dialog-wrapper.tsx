
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DialogWrapperProps {
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  showCancel?: boolean;
  cancelText?: string;
  onCancel?: () => void;
  isProcessing?: boolean;
}

export function DialogWrapper({
  trigger,
  title,
  description,
  children,
  footer,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  className,
  showCancel = false,
  cancelText = "Cancel",
  onCancel,
  isProcessing = false,
}: DialogWrapperProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalOpen;

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (!isControlled) {
      setInternalOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <DialogContent className={cn("sm:max-w-[425px]", className)}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        
        {children}
        
        {(footer || showCancel) && (
          <DialogFooter>
            {showCancel && (
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={isProcessing}
              >
                {cancelText}
              </Button>
            )}
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
