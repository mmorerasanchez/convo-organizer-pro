
-- 1) Ensure a dedicated schema for extensions exists
CREATE SCHEMA IF NOT EXISTS extensions;

-- 2) Pin the search_path for the RPC used by context retrieval
--    Do this BEFORE moving the vector extension so the type name resolves reliably.
ALTER FUNCTION public.search_project_context(
  uuid,
  vector,
  text[],
  double precision,
  integer
) SET search_path = public, extensions;

-- 3) Move extensions out of the public schema
--    Safe to run if they are already in 'extensions' (no-op).
ALTER EXTENSION IF EXISTS pg_net SET SCHEMA extensions;
ALTER EXTENSION IF EXISTS vector SET SCHEMA extensions;
