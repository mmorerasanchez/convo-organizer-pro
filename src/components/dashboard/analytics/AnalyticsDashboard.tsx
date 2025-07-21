
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  getProjectAnalytics, 
  getConversationAnalytics, 
  getKnowledgeAnalytics, 
  getActivityAnalytics,
  getToolsAnalytics 
} from '@/lib/api/analytics';
import AnalyticsKPIs from './AnalyticsKPIs';
import ProjectStatusChart from './ProjectStatusChart';
import ActivityTimelineChart from './ActivityTimelineChart';
import PlatformUsageChart from './PlatformUsageChart';
import KnowledgeDistributionChart from './KnowledgeDistributionChart';
import { Skeleton } from '@/components/ui/skeleton';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const AnalyticsDashboard: React.FC = () => {
  const { user, loading: authLoading } = useRequireAuth();

  const { data: projectAnalytics, isLoading: projectsLoading } = useQuery({
    queryKey: ['projectAnalytics'],
    queryFn: getProjectAnalytics,
    enabled: !!user
  });

  const { data: conversationAnalytics, isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversationAnalytics'],
    queryFn: getConversationAnalytics,
    enabled: !!user
  });

  const { data: knowledgeAnalytics, isLoading: knowledgeLoading } = useQuery({
    queryKey: ['knowledgeAnalytics'],
    queryFn: getKnowledgeAnalytics,
    enabled: !!user
  });

  const { data: activityAnalytics, isLoading: activityLoading } = useQuery({
    queryKey: ['activityAnalytics'],
    queryFn: getActivityAnalytics,
    enabled: !!user
  });

  const { data: toolsAnalytics, isLoading: toolsLoading } = useQuery({
    queryKey: ['toolsAnalytics'],
    queryFn: getToolsAnalytics,
    enabled: !!user
  });

  const isLoading = authLoading || projectsLoading || conversationsLoading || 
                   knowledgeLoading || activityLoading || toolsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Section */}
      <AnalyticsKPIs
        projectCount={projectAnalytics?.total || 0}
        conversationCount={conversationAnalytics?.total || 0}
        knowledgeCount={knowledgeAnalytics?.total || 0}
        toolsCount={toolsAnalytics?.total || 0}
        avgQualityScore={projectAnalytics?.averageQualityScore || 0}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Chart */}
        {projectAnalytics?.statusDistribution && (
          <ProjectStatusChart data={projectAnalytics.statusDistribution} />
        )}

        {/* Platform Usage Chart */}
        {conversationAnalytics?.platformDistribution && (
          <PlatformUsageChart data={conversationAnalytics.platformDistribution} />
        )}

        {/* Activity Timeline */}
        {activityAnalytics?.dailyActivity && (
          <ActivityTimelineChart data={activityAnalytics.dailyActivity} />
        )}

        {/* Knowledge Distribution */}
        {knowledgeAnalytics?.fileTypeDistribution && (
          <KnowledgeDistributionChart data={knowledgeAnalytics.fileTypeDistribution} />
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
