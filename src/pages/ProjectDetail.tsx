
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ConversationCard from '@/components/conversations/ConversationCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, Plus } from 'lucide-react';
import NewConversationDialog from '@/components/conversations/NewConversationDialog';
import EditProjectDialog from '@/components/projects/EditProjectDialog';
import DeleteDialog from '@/components/common/DeleteDialog';
import { useQuery } from '@tanstack/react-query';
import { fetchProjectById, fetchConversationsByProjectId, deleteProject } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const ProjectDetail = () => {
  useRequireAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { 
    data: project, 
    isLoading: isLoadingProject, 
    error: projectError 
  } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProjectById(id || ''),
    enabled: !!id
  });
  
  const { 
    data: conversations = [], 
    isLoading: isLoadingConversations, 
    error: conversationsError 
  } = useQuery({
    queryKey: ['conversations', 'project', id],
    queryFn: () => fetchConversationsByProjectId(id || ''),
    enabled: !!id
  });
  
  const deleteProjectMutation = useMutation({
    mutationFn: () => deleteProject(id || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully');
      navigate('/projects');
    },
    onError: (error: Error) => {
      toast.error(`Error deleting project: ${error.message}`);
    }
  });
  
  const isLoading = isLoadingProject || isLoadingConversations;
  const error = projectError || conversationsError;
  
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
          <h1 className="text-2xl font-bold mb-4">Error loading project</h1>
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
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <Link to="/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const handleDelete = () => {
    deleteProjectMutation.mutate();
  };

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
            <Button 
              variant="destructive" 
              size="icon" 
              onClick={handleDelete}
              disabled={deleteProjectMutation.isPending}
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
