
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tool } from '@/lib/types';
import { Edit, Trash, Star, Cpu, Clock, Calendar } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTool } from '@/lib/api';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import EditToolDialog from './EditToolDialog';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const [isHovering, setIsHovering] = useState(false);
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

  return (
    <Card 
      className="h-full tools-card flex flex-col border-muted/60 hover:shadow-md transition-all duration-200 relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">{tool.name}</CardTitle>
          <Badge variant="available">Available</Badge>
        </div>
        <CardDescription className="text-sm">
          {tool.description || 'No description provided'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        {/* Content simplified - capabilities moved to footer as compact info */}
      </CardContent>
      
      <CardFooter className="border-t pt-4 bg-muted/10 flex flex-col items-start gap-1 text-xs text-muted-foreground px-5 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            <span>Score: {tool.score}/10</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Cpu className="h-3 w-3" />
          <span>Model: {tool.model}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Last used: Never</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>Created {formatDistanceToNow(new Date(tool.createdAt), { addSuffix: true })}</span>
        </div>
      </CardFooter>

      {/* Hover Actions Overlay */}
      {isHovering && (
        <div className="absolute top-2 right-2 flex gap-1 bg-background/90 backdrop-blur-sm rounded-md p-1 shadow-sm border">
          <EditToolDialog tool={tool} />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDelete}
            disabled={deleteToolMutation.isPending}
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-7 w-7 p-0"
          >
            <Trash className="h-3.5 w-3.5" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ToolCard;
