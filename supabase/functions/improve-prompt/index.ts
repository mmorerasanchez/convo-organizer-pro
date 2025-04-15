
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

    // Best practices content - hardcoded to avoid network fetch issues
    const bestPractices = `
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
            { role: 'system', content: systemMessage },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API error:", errorData);
        
        // Check if it's a quota error
        const isQuotaError = errorData.error && 
                            (errorData.error.type === "insufficient_quota" || 
                             errorData.error.code === "insufficient_quota" ||
                             errorData.error.message.includes("quota"));
        
        if (isQuotaError) {
          return new Response(
            JSON.stringify({ 
              error: "OpenAI API quota exceeded. Please check your billing information or try again later.",
              errorType: "quota_exceeded"
            }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
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
      
      // Provide a fallback response with basic improvements to the prompt
      console.log("Using fallback prompt improvement method");
      
      // Simple fallback improvement logic
      let improvedPrompt = originalPrompt;
      
      // Add structure if it doesn't appear to have any
      if (!originalPrompt.includes("\n\n")) {
        improvedPrompt = `${originalPrompt}\n\nPlease provide the following in your response:
- Clear step-by-step instructions
- Examples where applicable
- Formatted output that is easy to read`;
      }
      
      // If it seems too short, suggest expanding
      if (originalPrompt.split(" ").length < 15 && !feedback) {
        improvedPrompt = `${originalPrompt}\n\nAdditional context to consider:
- The specific use case or problem being solved
- Desired format for the response
- Any constraints or requirements that must be met`;
      }
      
      return new Response(
        JSON.stringify({ 
          improvedPrompt,
          warning: "This is a fallback improvement due to OpenAI API issues. For better results, please try again later."
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error improving prompt:', error);
    return new Response(
      JSON.stringify({ 
        error: "An unexpected error occurred while processing your prompt. Please try again.",
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
