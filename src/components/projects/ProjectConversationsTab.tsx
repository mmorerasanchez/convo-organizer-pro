
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
        <div className="space-y-4">
          <div className="text-center p-8 bg-muted/20 rounded-lg border border-dashed">
            <p className="text-muted-foreground">No conversations found. Create a project first to get started</p>
          </div>
          <div className="text-center">
            <NewConversationDialog projectId={projectId} trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Conversation
              </Button>
            } />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectConversationsTab;
