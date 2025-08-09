
-- 1) Utility trigger to keep updated_at in sync
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 2) Subscribers table: one row per user for subscription status
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  email text unique not null,
  stripe_customer_id text,
  subscribed boolean not null default false,
  subscription_tier text,        -- 'free' | 'starter' | 'pro' | 'advanced'
  billing_interval text,          -- 'month' | 'year'
  price_id text,                  -- optional: last active Stripe price id
  subscription_end timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;

-- Users can view their own subscription
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'subscribers' and policyname = 'select_own_subscription'
  ) then
    create policy "select_own_subscription" on public.subscribers
      for select using (user_id = auth.uid() or email = auth.email());
  end if;
end$$;

-- (Optional) Let users update only their own row (edge functions will use service role and bypass RLS)
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'subscribers' and policyname = 'update_own_subscription'
  ) then
    create policy "update_own_subscription" on public.subscribers
      for update using (user_id = auth.uid() or email = auth.email());
  end if;
end$$;

-- Indexes to help lookups
create index if not exists subscribers_email_idx on public.subscribers (email);
create index if not exists subscribers_stripe_customer_idx on public.subscribers (stripe_customer_id);

-- updated_at trigger
drop trigger if exists subscribers_set_updated_at on public.subscribers;
create trigger subscribers_set_updated_at
before update on public.subscribers
for each row execute function public.set_updated_at();

-- 3) AI usage table: one row per AI request for monthly counting
create table if not exists public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  occurred_at timestamptz not null default now(),
  function text not null,       -- which edge function (e.g., 'improve-prompt', 'anthropic-chat', etc.)
  provider text,                -- 'openai' | 'anthropic' | 'google' | 'openrouter' ...
  model text,
  tokens_in integer default 0,
  tokens_out integer default 0,
  success boolean default true,
  cost_usd numeric default 0,
  metadata jsonb not null default '{}'::jsonb
);

alter table public.ai_usage enable row level security;

-- Users can view their own usage
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'ai_usage' and policyname = 'select_own_ai_usage'
  ) then
    create policy "select_own_ai_usage" on public.ai_usage
      for select using (user_id = auth.uid());
  end if;
end$$;

-- (Optional) Allow client-side inserts for own usage; edge functions with service role will bypass RLS anyway
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'ai_usage' and policyname = 'insert_own_ai_usage'
  ) then
    create policy "insert_own_ai_usage" on public.ai_usage
      for insert with check (user_id = auth.uid());
  end if;
end$$;

-- Helpful indexes for monthly queries
create index if not exists ai_usage_user_time_idx on public.ai_usage (user_id, occurred_at desc);
create index if not exists ai_usage_time_month_idx on public.ai_usage ((date_trunc('month', occurred_at)), user_id);

-- 4) Plan limits table: public-read configuration for pricing/limits (EUR)
create table if not exists public.plan_limits (
  plan_name text primary key,           -- 'free' | 'starter' | 'pro' | 'advanced'
  monthly_request_limit integer,        -- null = unlimited
  monthly_price_cents integer not null default 0,
  yearly_price_cents integer not null default 0,
  currency text not null default 'EUR',
  hard_cap boolean not null default true,
  description text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.plan_limits enable row level security;

-- Public read access (no write access for clients)
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' and tablename = 'plan_limits' and policyname = 'public_read_plan_limits'
  ) then
    create policy "public_read_plan_limits" on public.plan_limits
      for select using (true);
  end if;
end$$;

-- updated_at trigger
drop trigger if exists plan_limits_set_updated_at on public.plan_limits;
create trigger plan_limits_set_updated_at
before update on public.plan_limits
for each row execute function public.set_updated_at();

-- 5) Seed pricing model (EUR) with your requested limits
-- Free: 0€/mo, 30 req/mo
insert into public.plan_limits (plan_name, monthly_request_limit, monthly_price_cents, yearly_price_cents, currency, hard_cap, description)
values ('free', 30, 0, 0, 'EUR', true, 'Free tier: up to 30 requests/month')
on conflict (plan_name) do update
set monthly_request_limit = excluded.monthly_request_limit,
    monthly_price_cents = excluded.monthly_price_cents,
    yearly_price_cents = excluded.yearly_price_cents,
    currency = excluded.currency,
    hard_cap = excluded.hard_cap,
    description = excluded.description,
    updated_at = now();

-- Starter: 3€/mo or 30€/yr, 60 req/mo
insert into public.plan_limits (plan_name, monthly_request_limit, monthly_price_cents, yearly_price_cents, currency, hard_cap, description)
values ('starter', 60, 300, 3000, 'EUR', true, 'Starter: up to 60 requests/month')
on conflict (plan_name) do update
set monthly_request_limit = excluded.monthly_request_limit,
    monthly_price_cents = excluded.monthly_price_cents,
    yearly_price_cents = excluded.yearly_price_cents,
    currency = excluded.currency,
    hard_cap = excluded.hard_cap,
    description = excluded.description,
    updated_at = now();

-- Pro: 6€/mo or 60€/yr, 90 req/mo
insert into public.plan_limits (plan_name, monthly_request_limit, monthly_price_cents, yearly_price_cents, currency, hard_cap, description)
values ('pro', 90, 600, 6000, 'EUR', true, 'Pro: up to 90 requests/month')
on conflict (plan_name) do update
set monthly_request_limit = excluded.monthly_request_limit,
    monthly_price_cents = excluded.monthly_price_cents,
    yearly_price_cents = excluded.yearly_price_cents,
    currency = excluded.currency,
    hard_cap = excluded.hard_cap,
    description = excluded.description,
    updated_at = now();

-- Advanced: 9€/mo or 90€/yr, unlimited requests
insert into public.plan_limits (plan_name, monthly_request_limit, monthly_price_cents, yearly_price_cents, currency, hard_cap, description)
values ('advanced', null, 900, 9000, 'EUR', true, 'Advanced: unlimited requests')
on conflict (plan_name) do update
set monthly_request_limit = excluded.monthly_request_limit,
    monthly_price_cents = excluded.monthly_price_cents,
    yearly_price_cents = excluded.yearly_price_cents,
    currency = excluded.currency,
    hard_cap = excluded.hard_cap,
    description = excluded.description,
    updated_at = now();
