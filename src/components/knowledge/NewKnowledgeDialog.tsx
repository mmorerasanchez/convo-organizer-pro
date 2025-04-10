
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileUp, Plus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addKnowledge } from '@/lib/api';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  file: z.instanceof(File, { message: "File is required" })
    .refine(file => file.size <= MAX_FILE_SIZE, 'Max file size is 5MB')
});

type FormValues = z.infer<typeof formSchema>;

interface NewKnowledgeDialogProps {
  projectId: string;
  trigger?: React.ReactNode;
}

const NewKnowledgeDialog: React.FC<NewKnowledgeDialogProps> = ({ projectId, trigger }) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const addKnowledgeMutation = useMutation({
    mutationFn: (values: FormValues) => 
      addKnowledge(projectId, values.title, values.description || null, values.file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge', 'project', projectId] });
      toast.success('Knowledge added successfully');
      setOpen(false);
      form.reset();
      setSelectedFile(null);
    },
    onError: (error: Error) => {
      toast.error(`Error adding knowledge: ${error.message}`);
    }
  });

  const onSubmit = (values: FormValues) => {
    addKnowledgeMutation.mutate(values);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue('file', file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Knowledge
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Knowledge</DialogTitle>
          <DialogDescription>
            Upload documentation, images, or other files related to this project.
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
                    <Input placeholder="Enter a title for this document" {...field} />
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
                      placeholder="Enter an optional description" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <FormLabel>Upload File</FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                      <Input
                        type="file"
                        className="hidden"
                        id="file-upload"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                        <FileUp className="h-8 w-8 text-gray-400 mb-2" />
                        {selectedFile ? (
                          <div className="text-center">
                            <span className="font-medium text-gray-900">{selectedFile.name}</span>
                            <p className="text-xs text-gray-500 mt-1">
                              {(selectedFile.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <span className="font-medium text-gray-900">Click to upload a file</span>
                            <p className="text-xs text-gray-500 mt-1">
                              PDF, Word, Excel, Images, etc. (Max 5MB)
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload any file relevant to your project.
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={addKnowledgeMutation.isPending || !selectedFile}
              >
                {addKnowledgeMutation.isPending ? 'Uploading...' : 'Upload File'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewKnowledgeDialog;
