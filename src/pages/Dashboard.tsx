
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import RecentActivity from '@/components/dashboard/RecentActivity';
import ProjectList from '@/components/dashboard/ProjectList';
import { BarChart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects, fetchConversations } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchKnowledgeCount } from '@/lib/api/knowledge';
import AnalyticsDashboard from '@/components/dashboard/analytics/AnalyticsDashboard';
import PageHeader from '@/components/common/PageHeader';

const Dashboard = () => {
  const { user, loading: authLoading } = useRequireAuth();
  
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    enabled: !!user
  });
  
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
    enabled: !!user
  });

  const { data: knowledgeCount = 0, isLoading: knowledgeLoading } = useQuery({
    queryKey: ['knowledgeCount'],
    queryFn: fetchKnowledgeCount,
    enabled: !!user
  });

  // Sort conversations by date for recent activity
  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime()
  );
  
  // Sort projects by updated date
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const isLoading = authLoading || projectsLoading || conversationsLoading || knowledgeLoading;

  const tabs = [
    {
      value: 'overview',
      label: 'Overview'
    },
    {
      value: 'analytics',
      label: 'Analytics',
      icon: <BarChart size={14} />
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <PageHeader 
          title="Dashboard"
          description="Monitor your projects, conversations, and analytics at a glance"
          tabs={tabs}
          activeTab="overview"
        />
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-5 bg-muted/50 h-9 p-1">
              <TabsTrigger value="overview" className="h-7 px-3 text-sm font-mono">
                Overview
              </TabsTrigger>
              <TabsTrigger value="analytics" className="h-7 px-3 text-sm flex items-center gap-1.5 font-mono">
                <BarChart size={14} />
                Analytics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <RecentActivity conversations={sortedConversations} />
                <ProjectList projects={sortedProjects} />
              </div>
            </TabsContent>
            
            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
