
import { supabase } from '@/integrations/supabase/client';

// Project Analytics
export async function getProjectAnalytics() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, status, created_at, updated_at, context_quality_score, learning_frequency');

  if (error) throw error;

  const statusCounts = projects?.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const avgQualityScore = projects?.reduce((sum, p) => sum + (p.context_quality_score || 0), 0) / (projects?.length || 1);

  return {
    total: projects?.length || 0,
    statusDistribution: statusCounts,
    averageQualityScore: avgQualityScore,
    projects: projects || []
  };
}

// Conversation Analytics
export async function getConversationAnalytics() {
  const { data: conversations, error } = await supabase
    .from('conversations')
    .select('platform, type, status, created_at, captured_at');

  if (error) throw error;

  const platformCounts = conversations?.reduce((acc, conv) => {
    acc[conv.platform] = (acc[conv.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const typeCounts = conversations?.reduce((acc, conv) => {
    acc[conv.type] = (acc[conv.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Group by date for timeline
  const timelineData = conversations?.reduce((acc, conv) => {
    const date = new Date(conv.captured_at).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return {
    total: conversations?.length || 0,
    platformDistribution: platformCounts,
    typeDistribution: typeCounts,
    timeline: Object.entries(timelineData).map(([date, count]) => ({ date, count })),
    conversations: conversations || []
  };
}

// Knowledge Analytics
export async function getKnowledgeAnalytics() {
  const { data: knowledge, error } = await supabase
    .from('knowledge')
    .select('file_type, file_size, created_at, project_id');

  if (error) throw error;

  const fileTypeCounts = knowledge?.reduce((acc, file) => {
    acc[file.file_type] = (acc[file.file_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const totalSize = knowledge?.reduce((sum, file) => sum + (file.file_size || 0), 0) || 0;

  return {
    total: knowledge?.length || 0,
    fileTypeDistribution: fileTypeCounts,
    totalSize,
    averageFileSize: totalSize / (knowledge?.length || 1),
    knowledge: knowledge || []
  };
}

// Activity Analytics
export async function getActivityAnalytics() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: recentConversations, error: convError } = await supabase
    .from('conversations')
    .select('captured_at, created_at')
    .gte('captured_at', thirtyDaysAgo.toISOString());

  const { data: recentProjects, error: projError } = await supabase
    .from('projects')
    .select('created_at, updated_at')
    .gte('created_at', thirtyDaysAgo.toISOString());

  if (convError || projError) throw convError || projError;

  // Daily activity aggregation
  const dailyActivity = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = date.toISOString().split('T')[0];
    
    const conversationsCount = recentConversations?.filter(c => 
      new Date(c.captured_at).toISOString().split('T')[0] === dateStr
    ).length || 0;
    
    const projectsCount = recentProjects?.filter(p => 
      new Date(p.created_at).toISOString().split('T')[0] === dateStr
    ).length || 0;

    return {
      date: dateStr,
      conversations: conversationsCount,
      projects: projectsCount,
      total: conversationsCount + projectsCount
    };
  });

  return { dailyActivity };
}

// Tools Analytics
export async function getToolsAnalytics() {
  const { data: tools, error } = await supabase
    .from('tools')
    .select('model, score, created_at');

  if (error) throw error;

  const modelCounts = tools?.reduce((acc, tool) => {
    acc[tool.model] = (acc[tool.model] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const avgScore = tools?.reduce((sum, tool) => sum + tool.score, 0) / (tools?.length || 1);

  return {
    total: tools?.length || 0,
    modelDistribution: modelCounts,
    averageScore: avgScore,
    tools: tools || []
  };
}
