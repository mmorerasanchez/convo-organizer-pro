
-- Create templates table with comprehensive metadata and RLS policies
CREATE TABLE IF NOT EXISTS public.templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  tag text NOT NULL CHECK (tag IN ('Research', 'Content Creation', 'Analysis', 'Customer Support', 'Development', 'Custom')),
  framework_id uuid REFERENCES public.frameworks(id),
  framework_config jsonb NOT NULL DEFAULT '{}',
  field_values jsonb NOT NULL DEFAULT '{}',
  temperature numeric DEFAULT 0.7,
  max_tokens integer DEFAULT 1000,
  model_id text,
  variables jsonb NOT NULL DEFAULT '{}',
  visibility text NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'shared', 'public')),
  created_by uuid NOT NULL REFERENCES auth.users(id),
  usage_count integer DEFAULT 0,
  effectiveness_score numeric(3,2),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(name, created_by)
);

-- Create template versions for change tracking
CREATE TABLE IF NOT EXISTS public.template_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  configuration_snapshot jsonb NOT NULL,
  change_description text,
  created_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(template_id, version_number)
);

-- Create template usage analytics
CREATE TABLE IF NOT EXISTS public.template_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES public.templates(id) ON DELETE CASCADE,
  used_by uuid NOT NULL REFERENCES auth.users(id),
  project_id uuid REFERENCES public.projects(id),
  usage_context jsonb,
  success_rating integer CHECK (success_rating BETWEEN 1 AND 5),
  execution_time_ms integer,
  used_at timestamp with time zone DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_templates_tag ON public.templates(tag);
CREATE INDEX IF NOT EXISTS idx_templates_framework_id ON public.templates(framework_id);
CREATE INDEX IF NOT EXISTS idx_templates_visibility ON public.templates(visibility);
CREATE INDEX IF NOT EXISTS idx_templates_created_by ON public.templates(created_by);
CREATE INDEX IF NOT EXISTS idx_template_usage_template_id ON public.template_usage(template_id);
CREATE INDEX IF NOT EXISTS idx_template_usage_used_by ON public.template_usage(used_by);

-- Enable Row Level Security
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for templates
CREATE POLICY "Users can view their own templates and shared templates" 
  ON public.templates 
  FOR SELECT 
  USING (
    created_by = auth.uid() OR 
    visibility = 'shared' OR 
    visibility = 'public'
  );

CREATE POLICY "Users can create their own templates" 
  ON public.templates 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own templates" 
  ON public.templates 
  FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own templates" 
  ON public.templates 
  FOR DELETE 
  USING (auth.uid() = created_by);

-- RLS policies for template versions
CREATE POLICY "Users can view versions of accessible templates" 
  ON public.template_versions 
  FOR SELECT 
  USING (
    template_id IN (
      SELECT id FROM public.templates 
      WHERE created_by = auth.uid() OR visibility IN ('shared', 'public')
    )
  );

CREATE POLICY "Users can create versions for their own templates" 
  ON public.template_versions 
  FOR INSERT 
  WITH CHECK (
    template_id IN (
      SELECT id FROM public.templates 
      WHERE created_by = auth.uid()
    )
  );

-- RLS policies for template usage
CREATE POLICY "Users can view their own template usage" 
  ON public.template_usage 
  FOR SELECT 
  USING (used_by = auth.uid());

CREATE POLICY "Users can record their own template usage" 
  ON public.template_usage 
  FOR INSERT 
  WITH CHECK (auth.uid() = used_by);
