
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

  // Calculate the score badge variant
  const getScoreVariant = () => {
    if (tool.score >= 8) return 'success';
    if (tool.score >= 6) return 'warning';
    return 'destructive';
  };

  return (
    <Card className="h-full flex flex-col border-muted/60 hover:shadow-sm transition-all">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold leading-tight">{tool.name}</h3>
              <Badge variant={getScoreVariant()} className="text-xs">
                {tool.score}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{tool.model}</p>
          </div>
        </div>
      </CardHeader>
        <CardContent className="flex-grow">
        {tool.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {tool.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="border-t p-2 bg-muted/10 flex items-center justify-between">
        <EditToolDialog tool={tool} />
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDelete}
          disabled={deleteToolMutation.isPending}
          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-7 px-2"
        >
          <Trash className="h-3.5 w-3.5" />
          <span className="sr-only">Delete</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;
