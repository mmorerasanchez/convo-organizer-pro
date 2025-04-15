
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
    const { originalPrompt, feedback } = await req.json();

    if (!originalPrompt) {
      return new Response(
        JSON.stringify({ error: "Original prompt is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch the best practices file
    const bestPracticesResponse = await fetch('https://lovable.app/prompt_best_practices.txt');
    if (!bestPracticesResponse.ok) {
      throw new Error(`Failed to fetch best practices: ${bestPracticesResponse.statusText}`);
    }
    const bestPractices = await bestPracticesResponse.text();

    // Configure the system message with best practices
    const systemMessage = `You are an expert prompt engineer who helps improve prompts for AI language models. 
Your task is to enhance the user's prompt by applying these best practices:

${bestPractices}

Respond ONLY with the improved prompt text, without any explanations, introductions, or additional notes.`;

    // Configure the user message with their prompt and feedback if any
    let userMessage = `Please improve this prompt: ${originalPrompt}`;
    if (feedback) {
      userMessage += `\n\nI'd like further improvements based on this feedback: ${feedback}`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const improvedPrompt = data.choices[0].message.content.trim();

    return new Response(
      JSON.stringify({ improvedPrompt }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error improving prompt:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
