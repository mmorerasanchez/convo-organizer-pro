import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContextRequest {
  projectId: string
  query: string
  limit?: number
  contentTypes?: Array<'conversation' | 'document' | 'prompt'>
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { projectId, query, limit = 5, contentTypes = ['conversation', 'document', 'prompt'] }: ContextRequest = await req.json()

    if (!projectId || !query) {
      return new Response(
        JSON.stringify({ error: 'Project ID and query are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate embedding for the query
    const queryEmbedding = await generateQueryEmbedding(query, openaiApiKey)

    // Search for similar content using vector similarity
    const { data: similarContent, error: searchError } = await supabase.rpc(
      'search_project_context',
      {
        project_id: projectId,
        query_embedding: queryEmbedding,
        content_types: contentTypes,
        similarity_threshold: 0.7,
        match_limit: limit
      }
    )

    if (searchError) {
      throw new Error(`Context search failed: ${searchError.message}`)
    }

    // Get project context summary
    const { data: projectContext } = await supabase
      .from('project_contexts')
      .select('context_summary, key_themes')
      .eq('project_id', projectId)
      .single()

    // Format response with relevance scores and context
    const contextResults = similarContent?.map((item: any) => ({
      content_id: item.content_id,
      content_type: item.content_type,
      chunk_text: item.chunk_text,
      similarity_score: item.similarity,
      metadata: item.metadata,
      relevance_rank: calculateRelevanceRank(item, query)
    })) || []

    return new Response(
      JSON.stringify({ 
        success: true,
        project_context: projectContext,
        similar_content: contextResults,
        query_used: query,
        total_results: contextResults.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in context retriever:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function generateQueryEmbedding(query: string, apiKey: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: query,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data[0].embedding
}

function calculateRelevanceRank(item: any, query: string): number {
  let score = item.similarity * 100

  // Boost score for recent content (within last 30 days)
  const createdAt = new Date(item.metadata?.created_at || 0)
  const daysSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  if (daysSinceCreation <= 30) {
    score += 10
  }

  // Boost score for specific content types based on query context
  if (query.toLowerCase().includes('prompt') && item.content_type === 'prompt') {
    score += 15
  }
  if (query.toLowerCase().includes('conversation') && item.content_type === 'conversation') {
    score += 15
  }
  if (query.toLowerCase().includes('document') && item.content_type === 'document') {
    score += 15
  }

  return Math.min(score, 100)
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const supabase = createClient(supabaseUrl, supabaseServiceKey)