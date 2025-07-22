
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tool } from '@/lib/types';
import { Edit, Trash, MessageSquare } from 'lucide-react';
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
    <Card className="h-full tools-card flex flex-col border-muted/60 hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <CardTitle className="text-xl font-semibold">{tool.name}</CardTitle>
          </div>
          <Badge variant="available">Available</Badge>
        </div>
        <CardDescription className="text-sm">
          {tool.description || 'No description provided'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="capability">text generation</Badge>
          <Badge variant="capability">reasoning</Badge>
          {tool.model && (
            <Badge variant="secondary">{tool.model}</Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Score: {tool.score}/10</span>
          <span>Model: {tool.model}</span>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 bg-muted/10 flex items-center justify-between">
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
