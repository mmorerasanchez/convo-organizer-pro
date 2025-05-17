
import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ConversationDetailComponent from '@/components/conversations/ConversationDetail';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { fetchConversationById, fetchProjectById } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Skeleton } from '@/components/ui/skeleton';

const ConversationDetailPage = () => {
  useRequireAuth();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  
  // Check if we're coming from a shared project view
  const isFromSharedProject = location.state?.fromShared || false;
  
  const { 
    data: conversation, 
    isLoading: isLoadingConversation,
    error: conversationError
  } = useQuery({
    queryKey: ['conversation', id],
    queryFn: () => fetchConversationById(id || ''),
    enabled: !!id
  });
  
  const { 
    data: project, 
    isLoading: isLoadingProject,
    error: projectError
  } = useQuery({
    queryKey: ['project', conversation?.projectId],
    queryFn: () => fetchProjectById(conversation?.projectId || ''),
    enabled: !!conversation?.projectId
  });
  
  const isLoading = isLoadingConversation || isLoadingProject;
  const error = conversationError || projectError;
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      </MainLayout>
    );
  }
  
  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Error loading conversation</h1>
          <p className="mb-4 text-red-500">{(error as Error).message}</p>
          <Link to="/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  if (!conversation) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Conversation not found</h1>
          <Link to="/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ConversationDetailComponent 
        conversation={conversation} 
        project={project || undefined} 
      />
    </MainLayout>
  );
};

export default ConversationDetailPage;
