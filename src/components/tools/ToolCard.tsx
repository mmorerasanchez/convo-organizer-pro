
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tool } from '@/lib/types';
import { Edit, Trash } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTool } from '@/lib/api';
import { toast } from 'sonner';
import EditToolDialog from './EditToolDialog';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const queryClient = useQueryClient();
  
  const deleteToolMutation = useMutation({
    mutationFn: () => deleteTool(tool.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      toast.success(`Tool "${tool.name}" deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Error deleting tool: ${error.message}`);
    }
  });

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${tool.name}"?`)) {
      deleteToolMutation.mutate();
    }
  };

  // Calculate the style for the score badge
  const getScoreColor = () => {
    if (tool.score >= 8) return 'bg-green-100 text-green-800';
    if (tool.score >= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card className="h-full flex flex-col border-muted/60">
      <CardHeader className="p-5 pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-medium">{tool.name}</h3>
              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getScoreColor()}`}>
                {tool.score}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{tool.model}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-5 pt-0 pb-5 flex-grow">
        {tool.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {tool.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="border-t p-3 bg-muted/10 flex items-center justify-between">
        <EditToolDialog tool={tool} />
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDelete}
          disabled={deleteToolMutation.isPending}
          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
        >
          <Trash className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;
