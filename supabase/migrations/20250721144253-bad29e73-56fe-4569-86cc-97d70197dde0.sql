-- Create RPC function for vector similarity search
CREATE OR REPLACE FUNCTION search_project_context(
  project_id uuid,
  query_embedding vector(1536),
  content_types text[],
  similarity_threshold float DEFAULT 0.7,
  match_limit int DEFAULT 5
)
RETURNS TABLE (
  content_id uuid,
  content_type text,
  chunk_text text,
  similarity float,
  metadata jsonb
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ce.content_id,
    ce.content_type,
    ce.chunk_text,
    1 - (ce.embedding <=> query_embedding) as similarity,
    ce.metadata
  FROM content_embeddings ce
  WHERE ce.project_id = search_project_context.project_id
    AND ce.content_type = ANY(content_types)
    AND 1 - (ce.embedding <=> query_embedding) > similarity_threshold
  ORDER BY ce.embedding <=> query_embedding
  LIMIT match_limit;
END;
$$;