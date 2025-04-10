
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, Book, Link as LinkIcon, AlertCircle, Users } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { fetchConversationsByProjectId, fetchProjectById, fetchKnowledgeByProjectId } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Skeleton } from '@/components/ui/skeleton';
import ConversationCard from '@/components/conversations/ConversationCard';
import NewConversationDialog from '@/components/conversations/NewConversationDialog';
import KnowledgeList from '@/components/knowledge/KnowledgeList';
import KnowledgeEmptyState from '@/components/knowledge/KnowledgeEmptyState';
import NewKnowledgeDialog from '@/components/knowledge/NewKnowledgeDialog';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const SharedProjectDetail = () => {
  useRequireAuth();
  const { shareLink } = useParams<{ shareLink: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("conversations");

  const { data: project, isLoading: isLoadingProject, error: projectError } = useQuery({
    queryKey: ['shared-project', shareLink],
    queryFn: async () => {
      try {
        console.log(`Fetching project with share link: ${shareLink}`);
        // Fetch project using the share link
        const result = await fetchProjectById(shareLink || '');
        if (!result) {
          console.error('Project not found with share link:', shareLink);
          toast.error('Project not found or share link is invalid');
        } else {
          console.log(`Successfully fetched project: ${result.id}`);
        }
        return result;
      } catch (error) {
        console.error('Error fetching shared project:', error);
        toast.error('Error loading shared project');
        throw error;
      }
    },
    enabled: !!shareLink,
    retry: 1
  });

  useEffect(() => {
    if (shareLink && !isLoadingProject && !project) {
      toast.error('Project not found or share link is invalid');
    }
  }, [shareLink, isLoadingProject, project]);

  const { data: conversations = [], isLoading: isLoadingConversations } = useQuery({
    queryKey: ['conversations', 'project', project?.id],
    queryFn: () => fetchConversationsByProjectId(project?.id || ''),
    enabled: !!project?.id && activeTab === "conversations"
  });

  const { data: knowledgeItems = [], isLoading: isLoadingKnowledge } = useQuery({
    queryKey: ['knowledge', 'project', project?.id],
    queryFn: () => fetchKnowledgeByProjectId(project?.id || ''),
    enabled: !!project?.id && activeTab === "knowledge"
  });

  const isLoading = isLoadingProject || 
    (isLoadingConversations && activeTab === "conversations") || 
    (isLoadingKnowledge && activeTab === "knowledge");

  if (projectError) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto text-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Unable to Access Project</h2>
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error Loading Project</AlertTitle>
            <AlertDescription>
              {projectError instanceof Error ? projectError.message : 'The shared project link is invalid or you do not have permission to access it.'}
            </AlertDescription>
          </Alert>
          <p className="text-muted-foreground mb-6">
            Please check that you've entered the correct share link or ask the project owner to share it with you again.
          </p>
          <Button onClick={() => navigate('/projects')}>
            Back to Projects
          </Button>
        </div>
      </MainLayout>
    );
  }

  if (!isLoadingProject && !project) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto text-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The shared project link you provided is invalid or has expired.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={() => navigate('/projects')}>
              Back to Projects
            </Button>
            <Button variant="outline" onClick={() => navigate('/projects')}>
              <LinkIcon className="h-4 w-4 mr-2" />
              Try Another Share Link
            </Button>
          </div>
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
              <div className="flex items-center text-sm text-muted-foreground bg-primary/10 px-3 py-1 rounded-full">
                <Users className="h-3 w-3 mr-1" />
                <span>Shared project</span>
              </div>
            </div>
          </div>
        )}

        <Tabs 
          defaultValue="conversations"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="conversations" className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>Conversations</span>
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-1">
              <Book className="h-4 w-4" />
              <span>Knowledge</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="conversations" className="space-y-4">
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
          </TabsContent>
          
          <TabsContent value="knowledge" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Knowledge & Documentation</h2>
              {project && (
                <NewKnowledgeDialog projectId={project.id} />
              )}
            </div>
            
            {isLoadingKnowledge ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            ) : knowledgeItems.length > 0 ? (
              <KnowledgeList knowledgeItems={knowledgeItems} />
            ) : (
              project ? (
                <KnowledgeEmptyState projectId={project.id} />
              ) : (
                <div className="text-center py-12 border rounded-lg bg-muted/40">
                  <p className="text-muted-foreground">
                    No knowledge documents found in this project.
                  </p>
                </div>
              )
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SharedProjectDetail;
