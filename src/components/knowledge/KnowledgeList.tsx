
import React from 'react';
import { Knowledge } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Eye, Download, Pencil, Trash2, FileText, FileImage, FilePdf, FileArchive, FileCode } from 'lucide-react';
import EditKnowledgeDialog from './EditKnowledgeDialog';
import DeleteDialog from '@/components/common/DeleteDialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteKnowledge, downloadKnowledgeFile, getKnowledgeFileUrl } from '@/lib/api';
import { toast } from 'sonner';

interface KnowledgeListProps {
  knowledgeItems: Knowledge[];
}

const KnowledgeList: React.FC<KnowledgeListProps> = ({ knowledgeItems }) => {
  const queryClient = useQueryClient();

  const deleteKnowledgeMutation = useMutation({
    mutationFn: deleteKnowledge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge'] });
      toast.success('Knowledge item deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Error deleting knowledge item: ${error.message}`);
    }
  });

  const handleDelete = (id: string) => {
    deleteKnowledgeMutation.mutate(id);
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      await downloadKnowledgeFile(filePath, fileName);
      toast.success('File downloaded successfully');
    } catch (error) {
      toast.error(`Error downloading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handlePreview = async (filePath: string, fileType: string) => {
    try {
      const url = await getKnowledgeFileUrl(filePath);
      window.open(url, '_blank');
    } catch (error) {
      toast.error(`Error previewing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <FileImage className="w-8 h-8 text-blue-500" />;
    if (fileType.includes('pdf')) return <FilePdf className="w-8 h-8 text-red-500" />;
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('tar')) 
      return <FileArchive className="w-8 h-8 text-yellow-500" />;
    if (fileType.includes('code') || fileType.includes('json') || fileType.includes('xml') || fileType.includes('html')) 
      return <FileCode className="w-8 h-8 text-green-500" />;
    return <FileText className="w-8 h-8 text-gray-500" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {knowledgeItems.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1 mr-2">
                <CardTitle className="text-lg truncate">{item.title}</CardTitle>
                <CardDescription className="text-xs">
                  {format(new Date(item.createdAt), 'PPP')}
                </CardDescription>
              </div>
              {getFileIcon(item.fileType)}
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            {item.description && (
              <div className="text-sm truncate mb-2">{item.description}</div>
            )}
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="truncate">{item.fileName}</span>
              <span className="ml-1 flex-shrink-0">
                ({Math.round(item.fileSize / 1024)}KB)
              </span>
            </div>
          </CardContent>
          <CardFooter className="pt-2 flex justify-between border-t">
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => handlePreview(item.filePath, item.fileType)}
                title="Preview"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => handleDownload(item.filePath, item.fileName)}
                title="Download"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-1">
              <EditKnowledgeDialog knowledge={item} />
              <DeleteDialog
                title="Delete knowledge item"
                description={`Are you sure you want to delete "${item.title}"? This action cannot be undone.`}
                trigger={
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    disabled={deleteKnowledgeMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                }
                onConfirm={() => handleDelete(item.id)}
              />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default KnowledgeList;
