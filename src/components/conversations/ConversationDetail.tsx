
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Conversation, Project } from '@/lib/types';
import { format } from 'date-fns';
import TagList from './TagList';
import { ArrowLeft, Edit, ExternalLink, Share, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import EditConversationDialog from './EditConversationDialog';
import DeleteDialog from '../common/DeleteDialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteConversation } from '@/lib/api';
import { toast } from 'sonner';
import TagManagement from './TagManagement';
import { Badge } from '@/components/ui/badge';

interface ConversationDetailProps {
  conversation: Conversation;
  project?: Project;
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({ conversation, project }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  // Check if we came from a shared project view
  const isFromSharedProject = location.state?.fromShared || false;
  
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'in progress':
        return 'bg-blue-500'; 
      case 'draft':
        return 'bg-yellow-500';
      case 'final':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Determine where to navigate back to
  const getBackLink = () => {
    if (!project) {
      return "/conversations";
    }
    
    // If we came from a shared project view, use that URL format
    if (isFromSharedProject && project.shareLink) {
      return `/projects/shared/${project.shareLink}`;
    }
    
    // Otherwise, use the regular project URL
    return `/projects/${project.id}`;
  };

  return (
    <div className="space-y-6">
      {/* Header section matching ProjectDetailHeader style */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to={getBackLink()} state={{ activeTab: "conversations" }}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{conversation.title}</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 opacity-60 cursor-not-allowed"
              disabled
            >
              <Share className="h-4 w-4" />
              Share
            </Button>
            
            <EditConversationDialog 
              conversation={conversation} 
              trigger={
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              }
            />
            
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 text-red-600 hover:bg-red-50"
              onClick={handleDelete}
              disabled={deleteConversationMutation.isPending}
            >
              <Trash className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      
        {/* Metadata section */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
            {conversation.platform}
          </span>
          
          {conversation.status && (
            <span className={`inline-block px-2 py-1 text-xs rounded-full text-white ${getStatusColor(conversation.status)}`}>
              {conversation.status}
            </span>
          )}
          
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
        
        {conversation.externalId && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ExternalLink className="h-4 w-4" />
            <span>External ID: {conversation.externalId}</span>
          </div>
        )}
      </div>
      
      {/* Content card with monospaced font */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <TagManagement conversationId={conversation.id} assignedTags={conversation.tags} />
          </div>
          <div className="p-4">
            <div className="whitespace-pre-wrap text-sm font-mono bg-muted/30 p-4 rounded-md">
              {conversation.content}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Project context section if project exists */}
      {project && (
        <div className="bg-muted/30 p-4 rounded-md">
          <h3 className="text-sm font-medium mb-2">Part of Project: {project.name}</h3>
          <p className="text-sm text-muted-foreground">
            This conversation is organized within a project that may contain other related conversations and knowledge files.
          </p>
          <div className="mt-3">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/projects/${project.id}`}>
                View Project
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationDetail;
