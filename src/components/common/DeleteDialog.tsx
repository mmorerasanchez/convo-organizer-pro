
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface DeleteDialogProps {
  itemType: 'project' | 'conversation' | 'knowledge';
  itemName: string;
  trigger?: React.ReactNode;
  redirectPath?: string;
  onDelete?: () => void;
  isDeleting?: boolean; // Make isDeleting optional
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  itemType,
  itemName,
  trigger,
  redirectPath,
  onDelete,
  isDeleting: externalIsDeleting // Accept the prop from outside
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
  
  const triggerButton = trigger || (
    <Button variant="outline" size="icon">
      <Trash className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {itemType}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{itemName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
