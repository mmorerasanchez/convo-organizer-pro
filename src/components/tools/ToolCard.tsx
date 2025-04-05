
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
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{tool.name}</h3>
            <p className="text-sm text-muted-foreground">{tool.model}</p>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor()}`}>
            Score: {tool.score}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {tool.description && (
          <p className="text-sm text-muted-foreground">{tool.description}</p>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <EditToolDialog tool={tool} />
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleDelete}
          disabled={deleteToolMutation.isPending}
        >
          <Trash className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ToolCard;
