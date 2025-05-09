
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
  // Core props
  children: React.ReactNode;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  
  // Styling
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  
  // Control props
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  
  // Cancel button
  showCancel?: boolean;
  cancelText?: string;
  onCancel?: () => void;
  cancelButtonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  
  // State
  isProcessing?: boolean;
}

export function DialogWrapper({
  // Core props
  children,
  trigger,
  title,
  description,
  footer,
  
  // Styling
  className,
  contentClassName,
  headerClassName,
  footerClassName,
  
  // Control props
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultOpen = false,
  
  // Cancel button
  showCancel = false,
  cancelText = "Cancel",
  onCancel,
  cancelButtonVariant = "outline",
  
  // State
  isProcessing = false,
}: DialogWrapperProps) {
  // Handle controlled vs uncontrolled state
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = (value: boolean) => {
    if (isControlled) {
      controlledOnOpenChange?.(value);
    } else {
      setInternalOpen(value);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <DialogContent className={cn("sm:max-w-[425px]", className, contentClassName)}>
        {(title || description) && (
          <DialogHeader className={headerClassName}>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        
        {children}
        
        {(footer || showCancel) && (
          <DialogFooter className={cn(footerClassName)}>
            {showCancel && (
              <Button 
                variant={cancelButtonVariant}
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
