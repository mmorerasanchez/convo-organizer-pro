
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/dashboard/StatCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import ProjectList from '@/components/dashboard/ProjectList';
import AITools from '@/components/dashboard/AITools';
import { BookOpen, MessageCircle, Database, BarChart, Lightbulb } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects, fetchConversations } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchKnowledgeCount } from '@/lib/api/knowledge';
import { OnboardingButton } from '@/components/onboarding/OnboardingButton';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/components/onboarding/OnboardingContext';

const Dashboard = () => {
  const { user, loading: authLoading } = useRequireAuth();
  const { startOnboarding, hasCompletedOnboarding } = useOnboarding();
  
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
  
  const projectCount = projects.length;
  const conversationCount = conversations.length;

  const isLoading = authLoading || projectsLoading || conversationsLoading || knowledgeLoading;

  const startFullOnboarding = () => {
    startOnboarding('projects');
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <div className="flex gap-2">
            {!hasCompletedOnboarding && (
              <Button 
                onClick={startFullOnboarding}
                className="flex gap-1.5 items-center"
                size="sm"
              >
                <Lightbulb className="h-4 w-4" />
                Show Interactive Tour
              </Button>
            )}
            <OnboardingButton />
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <StatCard 
                title="Projects" 
                value={projectCount} 
                icon={<BookOpen size={18} />} 
                description="Across all categories"
                className="bg-red-50 text-red-800"
              />
              <StatCard 
                title="Knowledge Files" 
                value={knowledgeCount} 
                icon={<Database size={18} />} 
                description="Project documentation"
                className="bg-yellow-50 text-yellow-800"
              />
              <StatCard 
                title="Conversations" 
                value={conversationCount} 
                icon={<MessageCircle size={18} />} 
                description="From various platforms"
                className="bg-blue-50 text-blue-800"
              />
            </div>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-5 bg-muted/50 h-9 p-1">
                <TabsTrigger value="overview" className="h-7 px-3 text-sm">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="analytics" className="h-7 px-3 text-sm flex items-center gap-1.5 opacity-60 cursor-not-allowed" disabled>
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
                <div className="text-center py-12 rounded-lg border bg-muted/20">
                  <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium mb-2">Analytics coming soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Detailed insights and analytics for your projects and tools will be available in a future update.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
