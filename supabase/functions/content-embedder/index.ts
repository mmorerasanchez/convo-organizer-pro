import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmbeddingRequest {
  projectId: string
  contentId: string
  contentType: 'conversation' | 'document' | 'prompt'
  text: string
  metadata?: Record<string, any>
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { projectId, contentId, contentType, text, metadata = {} }: EmbeddingRequest = await req.json()

    if (!projectId || !contentId || !contentType || !text) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
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

    // Delete existing embeddings for this content
    await supabase
      .from('content_embeddings')
      .delete()
      .eq('project_id', projectId)
      .eq('content_id', contentId)

    // Chunk the text into manageable pieces
    const chunks = chunkText(text, 1000, 200)
    const embeddings = []

    // Process chunks in batches
    for (let i = 0; i < chunks.length; i += 10) {
      const batch = chunks.slice(i, i + 10)
      const batchEmbeddings = await generateEmbeddings(batch, openaiApiKey)
      
      for (let j = 0; j < batch.length; j++) {
        embeddings.push({
          project_id: projectId,
          content_id: contentId,
          content_type: contentType,
          chunk_text: batch[j],
          chunk_index: i + j,
          embedding: batchEmbeddings[j],
          metadata: {
            ...metadata,
            chunk_length: batch[j].length,
            total_chunks: chunks.length
          }
        })
      }
    }

    // Insert embeddings into database
    const { error: insertError } = await supabase
      .from('content_embeddings')
      .insert(embeddings)

    if (insertError) {
      throw new Error(`Failed to save embeddings: ${insertError.message}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        chunks_processed: chunks.length,
        embeddings_created: embeddings.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in content embedder:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function chunkText(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = []
  let start = 0
  
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    const chunk = text.slice(start, end)
    
    // Try to break at word boundaries
    if (end < text.length) {
      const lastSpace = chunk.lastIndexOf(' ')
      if (lastSpace > chunkSize * 0.8) {
        chunks.push(chunk.slice(0, lastSpace))
        start += lastSpace - overlap
      } else {
        chunks.push(chunk)
        start = end - overlap
      }
    } else {
      chunks.push(chunk)
      break
    }
  }
  
  return chunks.filter(chunk => chunk.trim().length > 0)
}

async function generateEmbeddings(texts: string[], apiKey: string): Promise<number[][]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: texts,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data.map((item: any) => item.embedding)
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const supabase = createClient(supabaseUrl, supabaseServiceKey)