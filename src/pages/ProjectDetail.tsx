
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ConversationCard from '@/components/conversations/ConversationCard';
import { getProjectById, getConversationsByProjectId } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, Plus } from 'lucide-react';
import NewConversationDialog from '@/components/conversations/NewConversationDialog';
import EditProjectDialog from '@/components/projects/EditProjectDialog';
import DeleteDialog from '@/components/common/DeleteDialog';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const project = getProjectById(id || '');
  const conversations = getConversationsByProjectId(id || '');
  
  if (!project) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <Link to="/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/projects">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <EditProjectDialog project={project} />
            <DeleteDialog 
              itemType="project" 
              itemName={project.name}
              redirectPath="/projects"
            />
          </div>
        </div>
        
        <p className="text-muted-foreground">{project.description}</p>
        
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Conversations</h2>
          <NewConversationDialog projectId={project.id} />
        </div>
        
        {conversations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conversations.map((conversation) => (
              <ConversationCard key={conversation.id} conversation={conversation} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 empty-state rounded-lg">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
            <p className="text-muted-foreground mb-4">
              Start adding conversations to this project
            </p>
            <NewConversationDialog projectId={project.id} trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Conversation
              </Button>
            } />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProjectDetail;
