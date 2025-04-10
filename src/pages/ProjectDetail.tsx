
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { 
  fetchProjectById, 
  fetchConversationsByProjectId, 
  fetchKnowledgeByProjectId 
} from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Skeleton } from '@/components/ui/skeleton';
import ProjectDetailHeader from '@/components/projects/ProjectDetailHeader';
import ProjectTabs from '@/components/projects/ProjectTabs';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ProjectDetail = () => {
  useRequireAuth();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("conversations");
  
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
  
  const {
    data: knowledgeItems = [],
    isLoading: isLoadingKnowledge,
    error: knowledgeError
  } = useQuery({
    queryKey: ['knowledge', 'project', id],
    queryFn: () => fetchKnowledgeByProjectId(id || ''),
    enabled: !!id && activeTab === "knowledge"
  });
  
  const error = projectError || (activeTab === "conversations" && conversationsError) || (activeTab === "knowledge" && knowledgeError);
  
  if (isLoadingProject) {
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

  return (
    <MainLayout>
      <div className="space-y-6">
        <ProjectDetailHeader project={project} />
        
        <ProjectTabs
          projectId={project.id}
          conversations={conversations}
          knowledgeItems={knowledgeItems}
          isLoadingConversations={isLoadingConversations}
          isLoadingKnowledge={isLoadingKnowledge}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </MainLayout>
  );
};

export default ProjectDetail;
