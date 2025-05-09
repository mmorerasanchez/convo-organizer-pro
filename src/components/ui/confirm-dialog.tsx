
import React from 'react';
import { DialogWrapper } from '@/components/ui/dialog-wrapper';
import { Button } from '@/components/ui/button';
import { AlertCircle, AlertTriangle, CheckCircle, HelpCircle, Info } from 'lucide-react';

export type ConfirmVariant = 'default' | 'destructive' | 'warning' | 'success' | 'info';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: ConfirmVariant;
  isProcessing?: boolean;
  trigger?: React.ReactNode;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  isProcessing = false,
  trigger,
}: ConfirmDialogProps) {
  // Map variant to button style and icon
  const variantMap: Record<ConfirmVariant, {
    buttonVariant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link",
    icon: React.ReactNode,
    iconClass: string,
    buttonClass: string
  }> = {
    default: { 
      buttonVariant: "default", 
      icon: <HelpCircle className="h-5 w-5" />,
      iconClass: "text-primary",
      buttonClass: ""
    },
    destructive: { 
      buttonVariant: "destructive", 
      icon: <AlertCircle className="h-5 w-5" />, 
      iconClass: "text-destructive",
      buttonClass: ""
    },
    warning: { 
      buttonVariant: "outline", 
      icon: <AlertTriangle className="h-5 w-5" />, 
      iconClass: "text-amber-500",
      buttonClass: "border-amber-500 text-amber-500 hover:bg-amber-50"
    },
    success: { 
      buttonVariant: "outline", 
      icon: <CheckCircle className="h-5 w-5" />, 
      iconClass: "text-emerald-500",
      buttonClass: "border-emerald-500 text-emerald-500 hover:bg-emerald-50"
    },
    info: { 
      buttonVariant: "outline", 
      icon: <Info className="h-5 w-5" />, 
      iconClass: "text-blue-500",
      buttonClass: "border-blue-500 text-blue-500 hover:bg-blue-50"
    }
  };

  const { buttonVariant, icon, iconClass, buttonClass } = variantMap[variant];

  return (
    <DialogWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      trigger={trigger}
      showCancel={true}
      cancelText={cancelText}
      onCancel={onCancel}
      isProcessing={isProcessing}
      footer={
        <Button 
          variant={buttonVariant}
          onClick={onConfirm}
          disabled={isProcessing}
          className={buttonClass}
        >
          {isProcessing ? "Processing..." : confirmText}
        </Button>
      }
    >
      <div className="flex items-center justify-center py-4">
        <div className={`rounded-full p-3 bg-muted ${iconClass}`}>
          {icon}
        </div>
      </div>
    </DialogWrapper>
  );
}
