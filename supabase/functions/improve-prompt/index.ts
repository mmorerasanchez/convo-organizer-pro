
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
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
      // Create a system prompt that incorporates both expert guidance and our best practices
      const systemPrompt = `You are an expert prompt engineer who helps improve prompts for AI language models.
      
Apply the following best practices when improving prompts:
${promptingBestPractices}

${feedback ? `Additionally, consider this specific feedback: ${feedback}` : ''}

Your task is to improve the given prompt by making it more effective, clearer, and following the best practices above.
Explain the reasoning behind your improvements.`;

      // Set up API call with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

      // Attempt to use the OpenAI API
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
            { role: 'user', content: `Please improve this prompt: ${originalPrompt}` }
          ],
          temperature: 0.7,
          max_tokens: 1000,
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
      console.log("Improved prompt generated successfully");

      return new Response(
        JSON.stringify({ improvedPrompt }),
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
