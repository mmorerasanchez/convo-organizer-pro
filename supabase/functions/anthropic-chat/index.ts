import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const start = Date.now();

  try {
    const { prompt, model, temperature = 0.7, max_tokens = 1000 } = await req.json();

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

    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid request: 'prompt' is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Anthropic API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000 * 60);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model || "claude-sonnet-4-20250514",
        max_tokens,
        temperature,
        messages: [
          { role: "user", content: prompt }
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic error:", errText);
      return new Response(
        JSON.stringify({ error: "Anthropic API error", details: errText }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // After successful response, log usage (before returning)
    // ... keep existing code up to building result ...
    const json = await response.json();
    const completion = Array.isArray(json.content) && json.content.length > 0 && json.content[0].type === "text"
      ? json.content[0].text : (json.output_text || "");
    const usage = json.usage || {};
    const result = {
      completion,
      response_ms: Date.now() - start,
      tokens_in: usage.input_tokens || 0,
      tokens_out: usage.output_tokens || 0,
      cost_usd: 0,
      provider: "anthropic",
      model: model,
    };

    try {
      await supabaseAdmin.from("ai_usage").insert({
        user_id: user.id,
        function: "anthropic-chat",
        provider: "anthropic",
        model: model,
        tokens_in: result.tokens_in,
        tokens_out: result.tokens_out,
        success: true,
        cost_usd: result.cost_usd,
        metadata: { tier }
      });
    } catch (e) {
      console.warn("[anthropic-chat] usage log failed", e);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("anthropic-chat error:", error);
    // ... keep existing code (error return) the same ...
    const isAbort = (error as Error).name === "AbortError";
    return new Response(
      JSON.stringify({ error: isAbort ? "Request timed out" : (error as Error).message }),
      { status: isAbort ? 504 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
