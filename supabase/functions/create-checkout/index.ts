
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type PlanName = "starter" | "pro" | "advanced";
type Interval = "month" | "year";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Clients must be authenticated
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 401,
    });
  }

  try {
    const { plan, interval }: { plan: PlanName; interval: Interval } = await req.json();

    if (!plan || !interval) {
      return new Response(JSON.stringify({ error: "plan and interval are required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY") ?? "";

    if (!supabaseUrl || !anonKey || !serviceKey || !stripeSecret) {
      return new Response(JSON.stringify({ error: "Server misconfigured: missing secrets" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Get user from token
    const token = authHeader.replace("Bearer ", "");
    const supabaseAuth = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
    const { data: userData, error: userErr } = await supabaseAuth.auth.getUser(token);
    if (userErr || !userData?.user?.email) {
      return new Response(JSON.stringify({ error: "Invalid auth token" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }
    const user = userData.user;

    // Read pricing (cents) from plan_limits to avoid hardcoding
    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
    const { data: planRow, error: planErr } = await admin
      .from("plan_limits")
      .select("plan_name, monthly_price_cents, yearly_price_cents, currency")
      .eq("plan_name", plan)
      .maybeSingle();

    if (planErr || !planRow) {
      return new Response(JSON.stringify({ error: "Unknown plan" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const amount = interval === "month" ? planRow.monthly_price_cents : planRow.yearly_price_cents;
    const currency = (planRow.currency || "EUR").toLowerCase();

    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: "Selected plan has no price configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Create or reuse Stripe customer by email
    const stripe = new Stripe(stripeSecret, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
    let customerId = customers.data[0]?.id;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email! });
      customerId = customer.id;
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: `Lovable AI - ${plan.charAt(0).toUpperCase() + plan.slice(1)}` },
            unit_amount: amount,
            recurring: { interval },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancelled`,
      allow_promotion_codes: true,
    });

    // Best-effort upsert subscribers
    await admin.from("subscribers").upsert({
      email: user.email!,
      user_id: user.id,
      stripe_customer_id: customerId,
      subscription_tier: plan,
      billing_interval: interval,
      updated_at: new Date().toISOString(),
    }, { onConflict: "email" });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    console.error("[create-checkout] error", e);
    return new Response(JSON.stringify({ error: (e as Error).message || "Unexpected error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
