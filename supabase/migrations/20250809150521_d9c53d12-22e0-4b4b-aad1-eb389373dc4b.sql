-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests 
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule weekly project context updates (every Sunday at 2 AM)
SELECT cron.schedule(
  'weekly-project-context-update',
  '0 2 * * 0',
  $$
  SELECT
    net.http_post(
        url := 'https://whigwajpngjkxohfhvup.supabase.co/functions/v1/project-context-analyzer',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoaWd3YWpwbmdqa3hvaGZodnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzY3ODgyMCwiZXhwIjoyMDQ5MjU0ODIwfQ.u7Lzxs5tNXk4UJC_b0gMDp39vCMSPrQKjYOoq3ZcFr0"}'::jsonb,
        body := '{"jobType": "scheduled"}'::jsonb
    ) as request_id;
  $$
);