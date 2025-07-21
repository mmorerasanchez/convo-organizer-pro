import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalysisRequest {
  projectId: string
  jobType: 'manual' | 'scheduled' | 'incremental'
}

interface ProjectContent {
  conversations: Array<{
    id: string
    title: string
    content: string
    created_at: string
    type: string
  }>
  knowledge: Array<{
    id: string
    title: string
    description: string
    file_type: string
    created_at: string
  }>
  prompts: Array<{
    id: string
    title: string
    compiled_text: string
    created_at: string
  }>
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { projectId, jobType = 'manual' }: AnalysisRequest = await req.json()

    if (!projectId) {
      return new Response(
        JSON.stringify({ error: 'Project ID is required' }),
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

    // Create a learning job record
    const { data: job, error: jobError } = await supabase
      .from('learning_jobs')
      .insert({
        project_id: projectId,
        job_type: jobType,
        status: 'processing',
        started_at: new Date().toISOString()
      })
      .select()
      .single()

    if (jobError) {
      throw new Error(`Failed to create learning job: ${jobError.message}`)
    }

    // Gather all project content
    const projectContent = await gatherProjectContent(projectId)

    if (!projectContent.conversations.length && !projectContent.knowledge.length && !projectContent.prompts.length) {
      // Update job as completed with no content
      await supabase
        .from('learning_jobs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          processed_items: 0,
          total_items: 0
        })
        .eq('id', job.id)

      return new Response(
        JSON.stringify({ 
          message: 'No content found to analyze',
          job_id: job.id 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate context analysis
    const contextAnalysis = await analyzeProjectContext(projectContent, openaiApiKey)

    // Save or update project context
    const { error: contextError } = await supabase
      .from('project_contexts')
      .upsert({
        project_id: projectId,
        context_summary: contextAnalysis.summary,
        key_themes: contextAnalysis.themes,
        learning_metadata: {
          job_id: job.id,
          content_analyzed: {
            conversations: projectContent.conversations.length,
            knowledge: projectContent.knowledge.length,
            prompts: projectContent.prompts.length
          },
          analysis_date: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'project_id'
      })

    if (contextError) {
      throw new Error(`Failed to save context: ${contextError.message}`)
    }

    // Update learning job as completed
    await supabase
      .from('learning_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        processed_items: projectContent.conversations.length + projectContent.knowledge.length + projectContent.prompts.length,
        total_items: projectContent.conversations.length + projectContent.knowledge.length + projectContent.prompts.length
      })
      .eq('id', job.id)

    // Update project with learning run timestamp
    await supabase
      .from('projects')
      .update({
        last_learning_run: new Date().toISOString(),
        context_quality_score: calculateContextQualityScore(contextAnalysis)
      })
      .eq('id', projectId)

    return new Response(
      JSON.stringify({ 
        success: true,
        context_summary: contextAnalysis.summary,
        key_themes: contextAnalysis.themes,
        job_id: job.id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in project context analyzer:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function gatherProjectContent(projectId: string): Promise<ProjectContent> {
  // Fetch conversations
  const { data: conversations = [] } = await supabase
    .from('conversations')
    .select('id, title, content, created_at, type')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  // Fetch knowledge items
  const { data: knowledge = [] } = await supabase
    .from('knowledge')
    .select('id, title, description, file_type, created_at')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  // Fetch prompts (from prompt versions if available)
  const { data: prompts = [] } = await supabase
    .from('prompt_versions')
    .select(`
      id,
      compiled_text,
      created_at,
      prompts!inner(title)
    `)
    .eq('prompts.project_id', projectId)
    .order('created_at', { ascending: false })

  return {
    conversations: conversations || [],
    knowledge: knowledge || [],
    prompts: prompts?.map(p => ({
      id: p.id,
      title: p.prompts?.title || 'Untitled Prompt',
      compiled_text: p.compiled_text || '',
      created_at: p.created_at
    })) || []
  }
}

async function analyzeProjectContext(content: ProjectContent, apiKey: string) {
  const analysisPrompt = `
Analyze this project's content and provide a comprehensive context summary:

CONVERSATIONS (${content.conversations.length}):
${content.conversations.map(c => `- ${c.title}: ${c.content.substring(0, 500)}...`).join('\n')}

KNOWLEDGE ITEMS (${content.knowledge.length}):
${content.knowledge.map(k => `- ${k.title}: ${k.description}`).join('\n')}

PROMPTS (${content.prompts.length}):
${content.prompts.map(p => `- ${p.title}: ${p.compiled_text.substring(0, 300)}...`).join('\n')}

Please provide:
1. A concise 2-3 paragraph summary of this project's main focus and goals
2. Key themes and patterns (return as array of strings)
3. Notable insights or recurring topics
4. Recommendations for future development

Format your response as JSON with keys: summary, themes, insights, recommendations
`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an AI project analyst. Analyze project content and provide structured insights in JSON format.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const result = await response.json()
  const analysisText = result.choices[0]?.message?.content

  try {
    return JSON.parse(analysisText)
  } catch {
    // Fallback if JSON parsing fails
    return {
      summary: analysisText || 'Analysis completed',
      themes: [],
      insights: [],
      recommendations: []
    }
  }
}

function calculateContextQualityScore(analysis: any): number {
  let score = 0
  
  // Base score for having content
  score += 20
  
  // Score for summary quality
  if (analysis.summary && analysis.summary.length > 100) score += 20
  
  // Score for themes
  if (analysis.themes && analysis.themes.length > 0) score += 20
  
  // Score for insights
  if (analysis.insights && analysis.insights.length > 0) score += 20
  
  // Score for recommendations
  if (analysis.recommendations && analysis.recommendations.length > 0) score += 20
  
  return Math.min(score, 100)
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const supabase = createClient(supabaseUrl, supabaseServiceKey)