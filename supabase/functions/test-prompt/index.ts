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
    // Require auth (already enforced by config), get user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Authentication required" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const token = authHeader.replace('Bearer ', '');

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabaseAdmin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabaseAuth = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
    const { data: userData, error: userErr } = await supabaseAuth.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Invalid authentication token." }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    const user = userData.user;

    // Pre-check usage limits
    const monthStart = new Date();
    monthStart.setUTCHours(0, 0, 0, 0);
    monthStart.setUTCDate(1);

    const { data: sub } = await supabaseAdmin
      .from('subscribers').select('subscription_tier')
      .eq('user_id', user.id).maybeSingle();
    const tier = (sub?.subscription_tier as 'free' | 'starter' | 'pro' | 'advanced') || 'free';

    const { data: plan } = await supabaseAdmin
      .from('plan_limits').select('monthly_request_limit').eq('plan_name', tier).maybeSingle();
    const limit = plan?.monthly_request_limit ?? 30;

    if (limit !== null) {
      const { count } = await supabaseAdmin
        .from('ai_usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('occurred_at', monthStart.toISOString());
      if ((count ?? 0) >= limit) {
        return new Response(JSON.stringify({
          error: "You've reached your monthly request limit. Please upgrade to continue.",
          over_limit: true,
          current_usage: count ?? 0,
          limit
        }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    // Verify authentication - this function requires a JWT
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

    // Set up API call with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

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
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiApiKey}`,
      },
      body: JSON.stringify(openaiRequestBody),
    });
    
    clearTimeout(timeoutId);

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error("OpenAI API error:", errorData);
      
      // Classify error for better client experience
      let statusCode = openaiResponse.status;
      let errorMessage = "OpenAI API call failed";
      
      if (errorData.error?.type === 'insufficient_quota') {
        errorMessage = "API quota exceeded. Please try again later.";
      } else if (openaiResponse.status === 429) {
        errorMessage = "Rate limit exceeded. Please try again later.";
      } else if (openaiResponse.status >= 500) {
        errorMessage = "OpenAI service unavailable. Please try again later.";
      }
      
      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          details: errorData
        }),
        { status: statusCode, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    // Sanitize data to avoid potential injection issues
    const sanitizedCompletion = responseData.choices?.[0]?.message?.content || '';
    
    // Create response
    const result = {
      completion: sanitizedCompletion,
      raw_response: JSON.stringify(responseData),
      response_ms: responseMs,
      tokens_in: tokensIn,
      tokens_out: tokensOut,
      cost_usd: costUsd,
    };

    // After success, log usage (we'll place it right before returning success)
    try {
      await supabaseAdmin.from('ai_usage').insert({
        user_id: user.id,
        function: 'test-prompt',
        provider: 'openai',
        model: openaiRequestBody.model,
        tokens_in: tokensIn,
        tokens_out: tokensOut,
        success: true,
        cost_usd: costUsd,
        metadata: { tier }
      });
    } catch (logErr) {
      console.warn("[test-prompt] failed to log usage", logErr);
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    
    let errorMessage = 'An unexpected error occurred';
    let statusCode = 500;
    
    if ((error as any).name === 'AbortError') {
      errorMessage = "Request timed out. Please try again.";
      statusCode = 408;
    } else if (error instanceof SyntaxError) {
      errorMessage = "Invalid request data. Please check your input.";
      statusCode = 400;
    }
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
