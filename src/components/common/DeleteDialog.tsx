
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { DialogWrapper } from '@/components/ui/dialog-wrapper';

interface DeleteDialogProps {
  itemType: 'project' | 'conversation' | 'knowledge';
  itemName: string;
  trigger?: React.ReactNode;
  redirectPath?: string;
  onDelete?: () => void;
  isDeleting?: boolean;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  itemType,
  itemName,
  trigger,
  redirectPath,
  onDelete,
  isDeleting: externalIsDeleting
}) => {
  const [open, setOpen] = useState(false);
  const [internalIsDeleting, setInternalIsDeleting] = useState(false);
  const navigate = useNavigate();
  
  // Use external isDeleting state if provided, otherwise use internal state
  const isDeleting = externalIsDeleting !== undefined ? externalIsDeleting : internalIsDeleting;
  
  const handleDelete = () => {
    if (externalIsDeleting === undefined) {
      setInternalIsDeleting(true);
    }
    
    if (onDelete) {
      onDelete();
      if (externalIsDeleting === undefined) {
        setInternalIsDeleting(false);
      }
      setOpen(false);
    } else {
      // For the prototype we're just simulating a successful deletion
      setTimeout(() => {
        toast.success(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} deleted successfully`);
        if (externalIsDeleting === undefined) {
          setInternalIsDeleting(false);
        }
        setOpen(false);
        
        if (redirectPath) {
          navigate(redirectPath);
        }
      }, 500);
    }
  };
  
  const defaultTrigger = (
    <Button variant="outline" size="icon">
      <Trash className="h-4 w-4" />
    </Button>
  );

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      trigger={trigger || defaultTrigger}
      title={`Delete ${itemType}`}
      description={`Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
      showCancel={true}
      isProcessing={isDeleting}
      footer={
        <Button 
          variant="destructive" 
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      }
    >
      <div className="py-2">
        <p className="text-center text-sm text-muted-foreground">
          This will permanently delete this {itemType} and any associated data.
        </p>
      </div>
    </DialogWrapper>
  );
};

export default DeleteDialog;
