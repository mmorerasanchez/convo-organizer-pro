
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type PlanName = "free" | "starter" | "pro" | "advanced";
type Interval = "month" | "year";

function mapAmountToPlan(amount: number, interval: Interval): PlanName | null {
  const monthlyMap: Record<number, PlanName> = { 300: "starter", 600: "pro", 900: "advanced" };
  const yearlyMap: Record<number, PlanName> = { 3000: "starter", 6000: "pro", 9000: "advanced" };
  const map = interval === "month" ? monthlyMap : yearlyMap;
  return map[amount] ?? null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 401,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY") ?? "";

    if (!supabaseUrl || !serviceKey || !anonKey || !stripeSecret) {
      return new Response(JSON.stringify({ error: "Server misconfigured: missing secrets" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

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

    const stripe = new Stripe(stripeSecret, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email!, limit: 1 });

    let subscribed = false;
    let tier: PlanName = "free";
    let billing_interval: Interval | null = null;
    let subscription_end: string | null = null;
    let stripe_customer_id: string | null = null;

    if (customers.data.length > 0) {
      const customerId = customers.data[0].id;
      stripe_customer_id = customerId;
      const subs = await stripe.subscriptions.list({ customer: customerId, status: "active", limit: 1 });
      if (subs.data.length > 0) {
        subscribed = true;
        const s = subs.data[0];
        subscription_end = new Date(s.current_period_end * 1000).toISOString();
        const price = s.items.data[0].price;
        const amount = price.unit_amount ?? 0;
        const interval: Interval = (price.recurring?.interval as Interval) || "month";
        billing_interval = interval;
        const mapped = mapAmountToPlan(amount, interval);
        tier = mapped ?? "advanced"; // if amounts diverge, treat as highest tier
      }
    }

    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
    await admin.from("subscribers").upsert({
      email: user.email!,
      user_id: user.id,
      stripe_customer_id,
      subscribed,
      subscription_tier: tier,
      billing_interval,
      subscription_end,
      updated_at: new Date().toISOString(),
    }, { onConflict: "email" });

    return new Response(JSON.stringify({
      subscribed,
      subscription_tier: tier,
      subscription_end,
      billing_interval,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    console.error("[check-subscription] error", e);
    return new Response(JSON.stringify({ error: (e as Error).message || "Unexpected error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
