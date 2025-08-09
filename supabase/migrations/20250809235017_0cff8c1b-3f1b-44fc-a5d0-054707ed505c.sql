
-- 1) plan_limits table (used by create-checkout, usage-status, ai-edge functions)
CREATE TABLE IF NOT EXISTS public.plan_limits (
  plan_name TEXT PRIMARY KEY,
  monthly_request_limit INTEGER, -- NULL means unlimited
  monthly_price_cents INTEGER,
  yearly_price_cents INTEGER,
  currency TEXT NOT NULL DEFAULT 'EUR',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Public read access to plan_limits (safe to expose read-only)
ALTER TABLE public.plan_limits ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'plan_limits' AND policyname = 'Allow public read of plan_limits'
  ) THEN
    CREATE POLICY "Allow public read of plan_limits"
      ON public.plan_limits
      FOR SELECT
      USING (true);
  END IF;
END$$;

-- Seed or upsert defaults
INSERT INTO public.plan_limits (plan_name, monthly_request_limit, monthly_price_cents, yearly_price_cents, currency)
VALUES
  ('free', 30, 0, 0, 'EUR'),
  ('starter', 200, 300, 3000, 'EUR'),
  ('pro', 1000, 600, 6000, 'EUR'),
  ('advanced', NULL, 900, 9000, 'EUR')
ON CONFLICT (plan_name) DO UPDATE
SET
  monthly_request_limit = EXCLUDED.monthly_request_limit,
  monthly_price_cents   = EXCLUDED.monthly_price_cents,
  yearly_price_cents    = EXCLUDED.yearly_price_cents,
  currency              = EXCLUDED.currency,
  updated_at            = now();

-- 2) subscribers table (used by create-checkout, check-subscription, usage-status)
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  billing_interval TEXT,
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscriber row by user_id or email
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'subscribers' AND policyname = 'select_own_subscription'
  ) THEN
    CREATE POLICY "select_own_subscription" ON public.subscribers
      FOR SELECT
      USING (user_id = auth.uid() OR email = auth.email());
  END IF;
END$$;

-- Helpful index for lookups by user_id
CREATE INDEX IF NOT EXISTS subscribers_user_id_idx ON public.subscribers(user_id);

-- 3) ai_usage table (logged by anthropic-chat, openrouter-chat, gemini-api; read by usage-status)
CREATE TABLE IF NOT EXISTS public.ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  function TEXT,
  provider TEXT,
  model TEXT,
  tokens_in INTEGER DEFAULT 0,
  tokens_out INTEGER DEFAULT 0,
  success BOOLEAN DEFAULT false,
  cost_usd NUMERIC,
  metadata JSONB DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

-- Users can read their own usage
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'ai_usage' AND policyname = 'select_own_usage'
  ) THEN
    CREATE POLICY "select_own_usage" ON public.ai_usage
      FOR SELECT
      USING (user_id = auth.uid());
  END IF;
END$$;

-- Index to speed up monthly usage counting
CREATE INDEX IF NOT EXISTS ai_usage_user_time_idx ON public.ai_usage(user_id, occurred_at DESC);

-- 4) Enforce uniqueness for playbook progress/bookmarks to support upsert and prevent duplicates

-- guide_progress: unique by (user_id, chapter_id, slide_id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'guide_progress_user_chapter_slide_unique'
  ) THEN
    ALTER TABLE public.guide_progress
      ADD CONSTRAINT guide_progress_user_chapter_slide_unique
      UNIQUE (user_id, chapter_id, slide_id);
  END IF;
END$$;

-- guide_bookmarks: unique by (user_id, chapter_id, slide_id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'guide_bookmarks_user_chapter_slide_unique'
  ) THEN
    ALTER TABLE public.guide_bookmarks
      ADD CONSTRAINT guide_bookmarks_user_chapter_slide_unique
      UNIQUE (user_id, chapter_id, slide_id);
  END IF;
END$$;
