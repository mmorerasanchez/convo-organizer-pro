
import React from 'react';
import ConversationCard from '@/components/conversations/ConversationCard';
import { Button } from '@/components/ui/button';
import { Plus, MessageCircle } from 'lucide-react';
import NewConversationDialog from '@/components/conversations/NewConversationDialog';
import { Conversation } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocation } from 'react-router-dom';

interface ProjectConversationsTabProps {
  projectId: string;
  conversations: Conversation[];
  isLoading: boolean;
}

const ProjectConversationsTab: React.FC<ProjectConversationsTabProps> = ({ 
  projectId, 
  conversations, 
  isLoading 
}) => {
  const location = useLocation();
  // Check if we're in a shared project view
  const isSharedProject = location.pathname.includes('/projects/shared/');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Conversations</h2>
        <NewConversationDialog projectId={projectId} />
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : conversations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {conversations.map((conversation) => (
            <ConversationCard 
              key={conversation.id} 
              conversation={conversation} 
              linkState={{ fromShared: isSharedProject }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 empty-state rounded-lg border">
          <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
          <p className="text-muted-foreground mb-4">
            Start adding conversations to this project
          </p>
          <NewConversationDialog projectId={projectId} trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Conversation
            </Button>
          } />
        </div>
      )}
    </div>
  );
};

export default ProjectConversationsTab;
