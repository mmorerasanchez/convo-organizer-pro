
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Knowledge } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateKnowledge } from '@/lib/api';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditKnowledgeDialogProps {
  knowledge: Knowledge;
  trigger?: React.ReactNode;
}

const EditKnowledgeDialog: React.FC<EditKnowledgeDialogProps> = ({ knowledge, trigger }) => {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: knowledge.title,
      description: knowledge.description || "",
    },
  });

  const updateKnowledgeMutation = useMutation({
    mutationFn: (values: FormValues) => 
      updateKnowledge(knowledge.id, values.title, values.description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge', 'project', knowledge.projectId] });
      toast.success('Knowledge item updated successfully');
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Error updating knowledge: ${error.message}`);
    }
  });

  const onSubmit = (values: FormValues) => {
    updateKnowledgeMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Knowledge</DialogTitle>
          <DialogDescription>
            Update the details of this knowledge item.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter description (optional)" 
                      {...field} 
                      value={field.value || ""} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={updateKnowledgeMutation.isPending}
              >
                {updateKnowledgeMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditKnowledgeDialog;
