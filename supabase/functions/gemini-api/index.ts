import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

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
    const { prompt, model = 'gemini-1.5-flash', temperature = 0.7, maxTokens = 1000 } = await req.json();

    // Require auth to enforce usage
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Please sign in to use AI features." }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    const token = authHeader.replace("Bearer ", "");

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabaseAuth = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
    const supabaseAdmin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

    const { data: userData, error: userErr } = await supabaseAuth.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Invalid authentication token." }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    const user = userData.user;

    // Usage pre-check
    const monthStart = new Date(); monthStart.setUTCHours(0,0,0,0); monthStart.setUTCDate(1);
    const { data: sub } = await supabaseAdmin.from("subscribers").select("subscription_tier").eq("user_id", user.id).maybeSingle();
    const tier = (sub?.subscription_tier as "free"|"starter"|"pro"|"advanced") || "free";
    const { data: plan } = await supabaseAdmin.from("plan_limits").select("monthly_request_limit").eq("plan_name", tier).maybeSingle();
    const limit = plan?.monthly_request_limit ?? 30;
    if (limit !== null) {
      const { count } = await supabaseAdmin.from("ai_usage").select("*", { count: "exact", head: true })
        .eq("user_id", user.id).gte("occurred_at", monthStart.toISOString());
      if ((count ?? 0) >= limit) {
        return new Response(JSON.stringify({ error: "You've reached your monthly request limit. Please upgrade to continue.", over_limit: true, current_usage: count ?? 0, limit }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    console.log('Gemini API request:', { model, temperature, maxTokens });

    // Map model names to Gemini API model names
    const modelMap: Record<string, string> = {
      'gemini-1.5-flash': 'gemini-1.5-flash',
      'gemini-1.5-pro': 'gemini-1.5-pro',
      'gemini-pro': 'gemini-pro'
    };

    const geminiModel = modelMap[model] || 'gemini-1.5-flash';

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: maxTokens,
          topP: 0.8,
          topK: 10
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    console.log('Gemini API response received');

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

    // Log usage after success
    try {
      await supabaseAdmin.from("ai_usage").insert({
        user_id: user.id,
        function: "gemini-api",
        provider: "google",
        model: model,
        tokens_in: 0,
        tokens_out: 0,
        success: true,
        cost_usd: 0,
        metadata: { tier }
      });
    } catch (e) {
      console.warn("[gemini-api] usage log failed", e);
    }

    return new Response(JSON.stringify({ 
      completion: generatedText,
      model: geminiModel,
      provider: 'google'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in gemini-api function:', error);
    return new Response(JSON.stringify({ 
      error: (error as Error).message || 'An error occurred while processing your request'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
