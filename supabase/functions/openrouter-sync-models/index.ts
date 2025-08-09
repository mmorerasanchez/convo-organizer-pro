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

  const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!OPENROUTER_API_KEY) {
    return new Response(JSON.stringify({ error: "Missing OPENROUTER_API_KEY" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Supabase service role not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("OpenRouter models error:", errText);
      return new Response(JSON.stringify({ error: "Failed to fetch OpenRouter models" }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const json = await res.json();
    const models = json.data || [];

    let upserted = 0;
    for (const m of models) {
      const external_id = m.id;
      const display_name = m.name || external_id;
      const vendor = m?.provider?.name || undefined;
      const context_window = m?.context_length || null;

      const { error } = await supabase.from("models").upsert({
        display_name,
        provider: "openrouter",
        external_id,
        source: "openrouter",
        vendor,
        context_window,
        last_synced_at: new Date().toISOString(),
      }, { onConflict: "provider,external_id" });

      if (error) {
        console.error("Upsert error for", external_id, error);
      } else {
        upserted += 1;
      }
    }

    return new Response(JSON.stringify({ upserted, total: models.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("openrouter-sync-models error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});