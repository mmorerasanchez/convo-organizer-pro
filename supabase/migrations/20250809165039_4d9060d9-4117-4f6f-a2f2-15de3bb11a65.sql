-- Alter models table to support external catalogs and provider routing
ALTER TABLE public.models
  ADD COLUMN IF NOT EXISTS external_id text,
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'static',
  ADD COLUMN IF NOT EXISTS vendor text,
  ADD COLUMN IF NOT EXISTS last_synced_at timestamptz;

-- Create unique constraint on (provider, external_id) where external_id is not null
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname = 'uq_models_provider_external_id'
  ) THEN
    EXECUTE 'CREATE UNIQUE INDEX uq_models_provider_external_id ON public.models (provider, external_id) WHERE external_id IS NOT NULL';
  END IF;
END $$;

-- Index for source
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname = 'idx_models_source'
  ) THEN
    EXECUTE 'CREATE INDEX idx_models_source ON public.models (source)';
  END IF;
END $$;

-- Seed recommended Anthropic models (upsert)
INSERT INTO public.models (display_name, provider, external_id, source, vendor, context_window)
VALUES
  ('Claude Sonnet 4 (Latest)', 'anthropic', 'claude-sonnet-4-20250514', 'anthropic', 'anthropic', 200000),
  ('Claude Opus 4', 'anthropic', 'claude-opus-4-20250514', 'anthropic', 'anthropic', 200000),
  ('Claude 3.5 Haiku (2024-10-22)', 'anthropic', 'claude-3-5-haiku-20241022', 'anthropic', 'anthropic', 200000)
ON CONFLICT (provider, external_id) WHERE external_id IS NOT NULL DO UPDATE
SET display_name = EXCLUDED.display_name,
    source = EXCLUDED.source,
    vendor = EXCLUDED.vendor,
    context_window = COALESCE(public.models.context_window, EXCLUDED.context_window),
    last_synced_at = now();