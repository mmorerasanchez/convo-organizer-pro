import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingModalProps {
  open: boolean;
  title?: string;
  lines?: number;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({ 
  open, 
  title = "Loading...", 
  lines = 4 
}) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingModal;