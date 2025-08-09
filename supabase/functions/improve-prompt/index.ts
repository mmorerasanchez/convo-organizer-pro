import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Best practices from our prompting guide
const promptingBestPractices = `
# Prompt Engineering Best Practices

## General Guidelines
- Be specific and clear about what you want
- Provide context about the task and desired outcome
- Specify your desired output format (e.g., bullet points, paragraphs, JSON)
- Break complex tasks into step-by-step instructions
- Use examples when possible to guide the model

## Structure
- Start with a clear instruction or question
- Include relevant context or background information
- Define roles when appropriate (e.g., "You are an expert in...")
- Use delimiters to separate different parts of your prompt (e.g., """content""")
- Consider using a Chain-of-Thought approach for complex reasoning tasks

## Style & Format
- Use imperative language for instructions (e.g., "Explain", "Analyze", "List")
- Be specific about length requirements (e.g., "Write a 300-word essay")
- Ask for structured outputs when appropriate (e.g., headings, bullet points)
- Request specific tone or writing style if needed (e.g., "academic", "conversational")
- For code generation, specify programming language, libraries, and constraints

## Common Improvements
- Replace vague terms with specific requests
- Add context about intended audience or use case
- Include parameters like length, tone, and depth
- Add step-by-step guidance for complex tasks
- Request explanations for generated content
- Include specific examples of desired outputs
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Request received at improve-prompt function");
    
    // Require authentication (payment wall)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Please sign in to use AI features." }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    const token = authHeader.replace("Bearer ", "");

    // Initialize Supabase clients
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabaseAuth = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
    const supabaseAdmin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

    const { data: userData, error: userErr } = await supabaseAuth.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Invalid authentication token." }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    const user = userData.user;

    // Enforce usage limits before proceeding
    const monthStart = new Date();
    monthStart.setUTCHours(0, 0, 0, 0);
    monthStart.setUTCDate(1);

    // Determine the user's plan
    const { data: sub } = await supabaseAdmin
      .from('subscribers')
      .select('subscription_tier')
      .eq('user_id', user.id)
      .maybeSingle();

    const tier = (sub?.subscription_tier as 'free' | 'starter' | 'pro' | 'advanced') || 'free';

    const { data: plan } = await supabaseAdmin
      .from('plan_limits')
      .select('monthly_request_limit')
      .eq('plan_name', tier)
      .maybeSingle();

    const limit = plan?.monthly_request_limit ?? 30; // null = unlimited, but fallback to 30 if missing

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
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Parse request body
    const requestBody = await req.json();
    console.log("Request payload:", requestBody);

    const { 
      prompt: originalPrompt, 
      originalPrompt: altOriginalPrompt,
      feedback,
      temperature = 0.7,
      maxTokens = 1000,
      useSystemPrompt = false,
      frameworkType = 'scanner'
    } = requestBody;

    // Use either prompt or originalPrompt parameter
    const promptToImprove = originalPrompt || altOriginalPrompt;

    if (!promptToImprove) {
      console.error("No prompt provided in request");
      return new Response(
        JSON.stringify({ error: "Original prompt is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if OpenAI API key is available
    if (!openAIApiKey) {
      console.error("OpenAI API key is not configured");
      return new Response(
        JSON.stringify({ error: "OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable." }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Calling OpenAI API with temperature:", temperature, "maxTokens:", maxTokens, "frameworkType:", frameworkType);
    
    try {
      let systemPrompt;
      
      // Use system prompt from database if requested
      if (useSystemPrompt) {
        try {
          console.log("Fetching system prompt for framework type:", frameworkType);
          const { data: systemPrompts, error } = await supabase
            .from('system_prompts')
            .select('prompt_text')
            .eq('framework_type', frameworkType)
            .eq('active', true)
            .limit(1)
            .maybeSingle();
            
          if (error) {
            console.warn("Failed to fetch system prompt:", error);
            systemPrompt = createFallbackSystemPrompt(feedback, frameworkType);
          } else if (systemPrompts?.prompt_text) {
            systemPrompt = systemPrompts.prompt_text;
            console.log("Using system prompt from database for framework:", frameworkType);
          } else {
            console.log("No active system prompt found, using fallback");
            systemPrompt = createFallbackSystemPrompt(feedback, frameworkType);
          }
        } catch (dbError) {
          console.warn("Database error fetching system prompt, using fallback:", dbError);
          systemPrompt = createFallbackSystemPrompt(feedback, frameworkType);
        }
      } else {
        systemPrompt = createFallbackSystemPrompt(feedback, frameworkType);
      }

      function createFallbackSystemPrompt(feedback?: string, type: string = 'scanner') {
        let basePrompt = `You are an expert prompt engineer who helps improve prompts for AI language models.
        
Apply the following best practices when improving prompts:
${promptingBestPractices}`;

        if (type === 'designer') {
          basePrompt += `

## Framework-Specific Optimization
When working with structured prompt frameworks:
- Maintain the framework structure while enhancing clarity
- Ensure each field is properly utilized and optimized
- Add specific examples where appropriate
- Optimize for the intended model and use case

## Lovable.dev Specific Guidelines
- Optimize for React, TypeScript, and Tailwind CSS development
- Focus on component-based architecture considerations
- Include accessibility and performance best practices
- Consider mobile-first responsive design principles`;
        }

        if (feedback) {
          basePrompt += `\n\nAdditionally, consider this specific feedback: ${feedback}`;
        }

        basePrompt += `\n\nYour task is to improve the given prompt by making it more effective, clearer, and following the best practices above.
Return only the improved prompt without explanations or additional text.`;

        return basePrompt;
      }

      // Set up API call with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Please improve this prompt: ${promptToImprove}` }
          ],
          temperature: Math.min(Math.max(temperature, 0), 2), // Clamp between 0 and 2
          max_tokens: Math.min(Math.max(maxTokens, 100), 4000), // Clamp between 100 and 4000
        }),
      });
      
      clearTimeout(timeoutId);

      console.log("OpenAI API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error:", errorData);
        
        // Classify error for better client experience
        let statusCode = response.status;
        let errorMessage = "OpenAI API call failed";
        
        if (errorData.error?.type === 'insufficient_quota') {
          errorMessage = "API quota exceeded. Please try again later.";
        } else if (response.status === 429) {
          errorMessage = "Rate limit exceeded. Please try again later.";
        } else if (response.status >= 500) {
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

      const data = await response.json();
      const improvedPrompt = data.choices[0].message.content.trim();
      console.log("Improved prompt generated successfully, length:", improvedPrompt.length);

      // Log usage on success
      try {
        await supabaseAdmin.from('ai_usage').insert({
          user_id: user.id,
          function: 'improve-prompt',
          provider: 'openai',
          model: 'gpt-4o-mini',
          tokens_in: data.usage?.prompt_tokens || 0,
          tokens_out: data.usage?.completion_tokens || 0,
          success: true,
          cost_usd: 0,
          metadata: { tier }
        });
      } catch (logErr) {
        console.warn("Failed to log ai_usage:", logErr);
      }

      // Return standardized response format that matches both frontend expectations
      return new Response(
        JSON.stringify({ 
          completion: improvedPrompt,
          generatedText: improvedPrompt,
          improvedPrompt: improvedPrompt,
          tokens_in: data.usage?.prompt_tokens || 0,
          tokens_out: data.usage?.completion_tokens || 0,
          response_ms: 0 // We don't track this currently
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (apiError) {
      console.error("Error calling OpenAI API:", apiError);
      
      let errorMessage = "An unexpected error occurred while processing your prompt";
      let statusCode = 500;
      
      if (apiError.name === 'AbortError') {
        errorMessage = "Request timed out. Please try again.";
        statusCode = 408;
      }
      
      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          details: apiError.message
        }),
        { status: statusCode, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error improving prompt:', error);
    return new Response(
      JSON.stringify({ 
        error: "An unexpected error occurred while processing your prompt",
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
