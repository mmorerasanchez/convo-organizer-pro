
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Conversation, Project } from '@/lib/types';
import { format } from 'date-fns';
import TagList from './TagList';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import EditConversationDialog from './EditConversationDialog';
import DeleteDialog from '../common/DeleteDialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteConversation } from '@/lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import TagManagement from './TagManagement';

interface ConversationDetailProps {
  conversation: Conversation;
  project?: Project;
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({ conversation, project }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const deleteConversationMutation = useMutation({
    mutationFn: () => deleteConversation(conversation.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      if (project) {
        queryClient.invalidateQueries({ queryKey: ['conversations', 'project', project.id] });
      }
      toast.success(`Conversation "${conversation.title}" deleted successfully`);
      navigate('/conversations');
    },
    onError: (error: Error) => {
      toast.error(`Error deleting conversation: ${error.message}`);
    }
  });

  const handleDelete = () => {
    deleteConversationMutation.mutate();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/conversations">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{conversation.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <EditConversationDialog conversation={conversation} />
          <Button 
            variant="destructive" 
            size="icon" 
            onClick={handleDelete}
            disabled={deleteConversationMutation.isPending}
          >
            <span className="sr-only">Delete</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 items-center">
        <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
          {conversation.platform}
        </span>
        
        {project && (
          <Link to={`/projects/${project.id}`}>
            <span className="inline-block px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
              {project.name}
            </span>
          </Link>
        )}
        
        <span className="text-sm text-muted-foreground">
          Captured on {format(new Date(conversation.capturedAt), 'PPP')}
        </span>
      </div>
      
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <TagManagement conversationId={conversation.id} assignedTags={conversation.tags} />
          </div>
          <div className="p-4">
            <div className="whitespace-pre-wrap text-sm">
              {conversation.content}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationDetail;
