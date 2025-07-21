
-- Enable pgvector extension for semantic search capabilities
CREATE EXTENSION IF NOT EXISTS vector;

-- Create project contexts table for storing analyzed project summaries
CREATE TABLE IF NOT EXISTS public.project_contexts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  context_summary text NOT NULL,
  key_themes jsonb,
  learning_metadata jsonb,
  version integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create content embeddings table for vector storage
CREATE TABLE IF NOT EXISTS public.content_embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  content_id uuid NOT NULL, -- conversation, knowledge, or prompt ID
  content_type text NOT NULL CHECK (content_type IN ('conversation', 'document', 'prompt')),
  chunk_text text NOT NULL,
  chunk_index integer DEFAULT 0,
  embedding vector(1536), -- OpenAI text-embedding-3-small dimensions
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Create learning jobs table for tracking automated context processing
CREATE TABLE IF NOT EXISTS public.learning_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  job_type text NOT NULL CHECK (job_type IN ('scheduled', 'manual', 'incremental')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  processed_items integer DEFAULT 0,
  total_items integer DEFAULT 0,
  error_details text,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Create context usage table for tracking effectiveness
CREATE TABLE IF NOT EXISTS public.context_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
  context_items jsonb, -- which context was used
  effectiveness_score numeric CHECK (effectiveness_score >= 1 AND effectiveness_score <= 5),
  created_at timestamp with time zone DEFAULT now()
);

-- Enhance existing projects table with context-related fields
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS context_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS last_learning_run timestamp with time zone,
ADD COLUMN IF NOT EXISTS learning_frequency text DEFAULT 'three_daily' CHECK (learning_frequency IN ('once_daily', 'twice_daily', 'three_daily', 'manual')),
ADD COLUMN IF NOT EXISTS context_quality_score numeric CHECK (context_quality_score >= 0 AND context_quality_score <= 100);

-- Enhance existing conversations table with context metadata
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS context_tags jsonb,
ADD COLUMN IF NOT EXISTS used_context_ids uuid[];

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_embeddings_project_id ON public.content_embeddings(project_id);
CREATE INDEX IF NOT EXISTS idx_content_embeddings_content_type ON public.content_embeddings(content_type);
CREATE INDEX IF NOT EXISTS idx_content_embeddings_embedding ON public.content_embeddings USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_project_contexts_project_id ON public.project_contexts(project_id);
CREATE INDEX IF NOT EXISTS idx_learning_jobs_project_id ON public.learning_jobs(project_id);
CREATE INDEX IF NOT EXISTS idx_learning_jobs_status ON public.learning_jobs(status);
CREATE INDEX IF NOT EXISTS idx_context_usage_project_id ON public.context_usage(project_id);

-- Enable Row Level Security for all new tables
ALTER TABLE public.project_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.context_usage ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for project_contexts
CREATE POLICY "Users can view contexts for their own projects" 
  ON public.project_contexts 
  FOR SELECT 
  USING (project_id IN (
    SELECT id FROM public.projects 
    WHERE user_id = auth.uid() 
    OR id IN (
      SELECT project_id FROM public.project_shares 
      WHERE shared_with_user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can insert contexts for their own projects" 
  ON public.project_contexts 
  FOR INSERT 
  WITH CHECK (project_id IN (
    SELECT id FROM public.projects 
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update contexts for their own projects" 
  ON public.project_contexts 
  FOR UPDATE 
  USING (project_id IN (
    SELECT id FROM public.projects 
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete contexts for their own projects" 
  ON public.project_contexts 
  FOR DELETE 
  USING (project_id IN (
    SELECT id FROM public.projects 
    WHERE user_id = auth.uid()
  ));

-- Create RLS policies for content_embeddings
CREATE POLICY "Users can view embeddings for their own projects" 
  ON public.content_embeddings 
  FOR SELECT 
  USING (project_id IN (
    SELECT id FROM public.projects 
    WHERE user_id = auth.uid() 
    OR id IN (
      SELECT project_id FROM public.project_shares 
      WHERE shared_with_user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can insert embeddings for their own projects" 
  ON public.content_embeddings 
  FOR INSERT 
  WITH CHECK (project_id IN (
    SELECT id FROM public.projects 
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete embeddings for their own projects" 
  ON public.content_embeddings 
  FOR DELETE 
  USING (project_id IN (
    SELECT id FROM public.projects 
    WHERE user_id = auth.uid()
  ));

-- Create RLS policies for learning_jobs
CREATE POLICY "Users can view learning jobs for their own projects" 
  ON public.learning_jobs 
  FOR SELECT 
  USING (project_id IN (
    SELECT id FROM public.projects 
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert learning jobs for their own projects" 
  ON public.learning_jobs 
  FOR INSERT 
  WITH CHECK (project_id IN (
    SELECT id FROM public.projects 
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update learning jobs for their own projects" 
  ON public.learning_jobs 
  FOR UPDATE 
  USING (project_id IN (
    SELECT id FROM public.projects 
    WHERE user_id = auth.uid()
  ));

-- Create RLS policies for context_usage
CREATE POLICY "Users can view context usage for their own projects" 
  ON public.context_usage 
  FOR SELECT 
  USING (project_id IN (
    SELECT id FROM public.projects 
    WHERE user_id = auth.uid() 
    OR id IN (
      SELECT project_id FROM public.project_shares 
      WHERE shared_with_user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can insert context usage for their own projects" 
  ON public.context_usage 
  FOR INSERT 
  WITH CHECK (project_id IN (
    SELECT id FROM public.projects 
    WHERE user_id = auth.uid()
  ));
