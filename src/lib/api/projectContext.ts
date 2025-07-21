import { supabase } from '@/integrations/supabase/client';

export interface ProjectContext {
  id: string;
  project_id: string;
  context_summary: string;
  key_themes: string[];
  learning_metadata: {
    job_id?: string;
    content_analyzed?: {
      conversations: number;
      knowledge: number;
      prompts: number;
    };
    analysis_date?: string;
  };
  version: number;
  created_at: string;
  updated_at: string;
}

export interface LearningJob {
  id: string;
  project_id: string;
  job_type: 'scheduled' | 'manual' | 'incremental';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processed_items: number;
  total_items: number;
  error_details?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface ContextUsage {
  id: string;
  project_id: string;
  conversation_id?: string;
  context_items: any;
  effectiveness_score?: number;
  created_at: string;
}

// Fetch project context
export async function getProjectContext(projectId: string): Promise<ProjectContext | null> {
  const { data, error } = await supabase
    .from('project_contexts')
    .select('*')
    .eq('project_id', projectId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    throw error;
  }

  if (!data) return null;

  return {
    ...data,
    key_themes: Array.isArray(data.key_themes) ? data.key_themes : [],
    learning_metadata: data.learning_metadata || {}
  } as ProjectContext;
}

// Update project context manually
export async function updateProjectContext(projectId: string): Promise<LearningJob> {
  const { data, error } = await supabase.functions.invoke('project-context-analyzer', {
    body: {
      projectId,
      jobType: 'manual'
    }
  });

  if (error) {
    throw error;
  }

  return data;
}

// Get project learning jobs
export async function getProjectLearningJobs(projectId: string): Promise<LearningJob[]> {
  const { data, error } = await supabase
    .from('learning_jobs')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    throw error;
  }

  return (data || []).map(job => ({
    ...job,
    job_type: job.job_type as 'scheduled' | 'manual' | 'incremental',
    status: job.status as 'pending' | 'processing' | 'completed' | 'failed'
  }));
}

// Get context suggestions for a query
export async function getContextSuggestions(
  projectId: string, 
  query: string,
  limit: number = 5,
  contentTypes: Array<'conversation' | 'document' | 'prompt'> = ['conversation', 'document', 'prompt']
) {
  const { data, error } = await supabase.functions.invoke('context-retriever', {
    body: {
      projectId,
      query,
      limit,
      contentTypes
    }
  });

  if (error) {
    throw error;
  }

  return data;
}

// Track context usage
export async function trackContextUsage(
  projectId: string,
  conversationId: string | null,
  contextItems: any,
  effectivenessScore?: number
): Promise<void> {
  const { error } = await supabase
    .from('context_usage')
    .insert({
      project_id: projectId,
      conversation_id: conversationId,
      context_items: contextItems,
      effectiveness_score: effectivenessScore
    });

  if (error) {
    throw error;
  }
}