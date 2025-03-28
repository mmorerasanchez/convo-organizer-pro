
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/dashboard/StatCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import ProjectList from '@/components/dashboard/ProjectList';
import AITools from '@/components/dashboard/AITools';
import { mockProjects, mockConversations } from '@/lib/mockData';
import { BookOpen, MessageCircle, Tags, Brain } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  // For a real app, we would fetch this data from an API
  // but for this demo, we'll use our mock data
  const projectCount = mockProjects.length;
  const conversationCount = mockConversations.length;
  const tagCount = [...new Set(mockConversations.flatMap(c => c.tags.map(t => t.id)))].length;
  
  // Sort conversations by date for recent activity
  const sortedConversations = [...mockConversations].sort(
    (a, b) => new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime()
  );
  
  // Sort projects by updated date
  const sortedProjects = [...mockProjects].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Total Projects" 
            value={projectCount} 
            icon={<BookOpen size={16} />} 
            description="Across all categories"
          />
          <StatCard 
            title="Conversations" 
            value={conversationCount} 
            icon={<MessageCircle size={16} />} 
            description="From various platforms"
          />
          <StatCard 
            title="Available Tags" 
            value={tagCount} 
            icon={<Tags size={16} />} 
            description="For organizing content"
          />
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ai-tools">
              <span className="flex items-center gap-2">
                <Brain size={16} />
                AI Tools
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <RecentActivity conversations={sortedConversations} />
              <ProjectList projects={sortedProjects} />
            </div>
          </TabsContent>
          
          <TabsContent value="ai-tools">
            <AITools />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
