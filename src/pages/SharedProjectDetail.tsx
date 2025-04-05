
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ConversationCard from '@/components/conversations/ConversationCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, Share } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchProjectById, fetchConversationsByProjectId } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const SharedProjectDetail = () => {
  useRequireAuth();
  const { shareLink } = useParams<{ shareLink: string }>();
  
  const { 
    data: project, 
    isLoading: isLoadingProject, 
    error: projectError 
  } = useQuery({
    queryKey: ['project', 'shared', shareLink],
    queryFn: async () => {
      // This is a placeholder - we'd need to implement the actual API call to fetch a project by share link
      // For now, we're redirecting to projects
      return null;
    },
    enabled: !!shareLink
  });
  
  const { 
    data: conversations = [], 
    isLoading: isLoadingConversations, 
    error: conversationsError 
  } = useQuery({
    queryKey: ['conversations', 'project', project?.id],
    queryFn: () => fetchConversationsByProjectId(project?.id || ''),
    enabled: !!project?.id
  });
  
  const isLoading = isLoadingProject || isLoadingConversations;
  const error = projectError || conversationsError;
  
  // For now, redirect to projects page - we'll implement the actual shared project view in a future update
  return <Navigate to="/projects" />;
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      </MainLayout>
    );
  }
  
  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Error loading shared project</h1>
          <p className="mb-4 text-red-500">{(error as Error).message}</p>
          <Link to="/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  if (!project) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Shared project not found</h1>
          <p className="text-muted-foreground mb-6">
            The project you're looking for might have been removed or the share link is invalid.
          </p>
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
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
                <Badge variant="outline" className="ml-2">
                  <Share className="h-3 w-3 mr-1" />
                  Shared
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-muted-foreground">{project.description}</p>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Conversations</h2>
          
          {conversations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {conversations.map((conversation) => (
                <ConversationCard key={conversation.id} conversation={conversation} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 empty-state rounded-lg">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No conversations in this project</h3>
              <p className="text-muted-foreground">
                This shared project doesn't have any conversations yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SharedProjectDetail;
