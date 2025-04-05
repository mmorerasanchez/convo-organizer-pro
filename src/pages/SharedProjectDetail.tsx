
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { fetchConversationsByProjectId, fetchProjectById } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Skeleton } from '@/components/ui/skeleton';
import ConversationCard from '@/components/conversations/ConversationCard';
import NewConversationDialog from '@/components/conversations/NewConversationDialog';

const SharedProjectDetail = () => {
  useRequireAuth();
  const { shareLink } = useParams<{ shareLink: string }>();
  const navigate = useNavigate();

  const { data: project, isLoading: isLoadingProject, error: projectError } = useQuery({
    queryKey: ['shared-project', shareLink],
    queryFn: async () => {
      try {
        // Fetch project using the share link
        const projectData = await fetchProjectById(shareLink || '');
        return projectData;
      } catch (error) {
        console.error('Error fetching shared project:', error);
        return null;
      }
    },
    enabled: !!shareLink
  });

  const { data: conversations = [], isLoading: isLoadingConversations } = useQuery({
    queryKey: ['conversations', 'project', project?.id],
    queryFn: () => fetchConversationsByProjectId(project?.id || ''),
    enabled: !!project?.id
  });

  const isLoading = isLoadingProject || isLoadingConversations;

  if (projectError || (!isLoading && !project)) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The shared project link you provided is invalid or has expired.
          </p>
          <Button onClick={() => navigate('/projects')}>
            Back to Projects
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {isLoadingProject ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-3xl font-bold">{project?.name}</h1>
            </div>
            <p className="text-muted-foreground">{project?.description}</p>
            
            <div className="mt-4 flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Shared project view
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Conversations</h2>
            {project && (
              <NewConversationDialog projectId={project.id} />
            )}
          </div>
          
          {isLoadingConversations ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          ) : conversations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {conversations.map((conversation) => (
                <ConversationCard key={conversation.id} conversation={conversation} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/40">
              <p className="text-muted-foreground">
                No conversations found in this project. Get started by creating a new conversation.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SharedProjectDetail;
