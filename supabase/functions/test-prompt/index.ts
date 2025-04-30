
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
async function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  return null;
}

serve(async (req) => {
  // Handle CORS
  const corsResponse = await handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { prompt, model, temperature, max_tokens } = await req.json();

    // Validate request
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // Get OpenAI API key from environment variables
    const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiApiKey) {
      return new Response(JSON.stringify({ error: 'OpenAI API key is not configured' }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
    
    // Start tracking time for response_ms
    const startTime = new Date();

    // Call OpenAI API
    const openaiUrl = 'https://api.openai.com/v1/chat/completions';
    const openaiRequestBody = {
      model: model || 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: temperature != null ? parseFloat(temperature) : 0.7,
      max_tokens: max_tokens ? parseInt(max_tokens, 10) : 1000,
    };

    const openaiResponse = await fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiApiKey}`,
      },
      body: JSON.stringify(openaiRequestBody),
    });

    const responseData = await openaiResponse.json();

    // Calculate elapsed time
    const endTime = new Date();
    const responseMs = endTime.getTime() - startTime.getTime();

    // Extract usage data
    const tokensIn = responseData.usage?.prompt_tokens || 0;
    const tokensOut = responseData.usage?.completion_tokens || 0;
    
    // Calculate cost (approximate based on model)
    // GPT-4o pricing: $5 per 1M input tokens, $15 per 1M output tokens
    const inputCost = (tokensIn / 1000000) * 5;
    const outputCost = (tokensOut / 1000000) * 15;
    const costUsd = inputCost + outputCost;

    // Create response
    const result = {
      completion: responseData.choices?.[0]?.message?.content || '',
      raw_response: JSON.stringify(responseData),
      response_ms: responseMs,
      tokens_in: tokensIn,
      tokens_out: tokensOut,
      cost_usd: costUsd,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
