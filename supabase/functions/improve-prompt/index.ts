
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Request received at improve-prompt function");
    
    // Parse request
    const { originalPrompt, feedback } = await req.json();
    console.log("Request payload:", { originalPrompt, feedback });

    if (!originalPrompt) {
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

    console.log("Calling OpenAI API");
    
    try {
      // Attempt to use the OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an expert prompt engineer who helps improve prompts for AI language models.' },
            { role: 'user', content: `Please improve this prompt: ${originalPrompt}` }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      console.log("OpenAI API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error:", errorData);
        
        // Detailed error logging
        return new Response(
          JSON.stringify({ 
            error: "OpenAI API call failed",
            details: errorData
          }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      const improvedPrompt = data.choices[0].message.content.trim();
      console.log("Improved prompt generated successfully");

      return new Response(
        JSON.stringify({ improvedPrompt }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (apiError) {
      console.error("Error calling OpenAI API:", apiError);
      
      return new Response(
        JSON.stringify({ 
          error: "An unexpected error occurred while processing your prompt",
          details: apiError.message
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
