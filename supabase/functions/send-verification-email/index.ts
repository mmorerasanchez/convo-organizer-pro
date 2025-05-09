
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "https://esm.sh/resend@1.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Log that we're starting the email sending process
    console.log("Starting send-verification-email function");
    
    // Check if RESEND_API_KEY is available
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY environment variable not found");
      return new Response(
        JSON.stringify({ error: "Email service configuration error" }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    // Initialize Resend with API key
    console.log("Initializing Resend client");
    const resend = new Resend(resendApiKey);
    
    // Initialize Supabase admin client
    console.log("Initializing Supabase admin client");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase URL or Service Role Key not found");
      return new Response(
        JSON.stringify({ error: "Auth service configuration error" }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Extract email from request body
    console.log("Parsing request body");
    const { email } = await req.json();
    
    if (!email) {
      console.error("No email provided in request");
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    console.log(`Generating signup link for email: ${email}`);
    
    // Generate signup link
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "signup",
      email,
      options: {
        redirectTo: `${new URL(req.url).origin}/verify-success`,
      },
    });
    
    if (error) {
      console.error("Error generating signup link:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    // Send the verification email using Resend
    try {
      const verificationLink = data.properties.action_link;
      console.log(`Verification link generated successfully, sending email to ${email}`);
      
      const emailResult = await resend.emails.send({
        from: "Promptito <onboarding@resend.dev>",
        to: [email],
        subject: "Verify your email for Promptito",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e9e9; border-radius: 5px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #333; font-size: 24px; margin-bottom: 10px;">Welcome to Promptito</h1>
              <p style="color: #666; font-size: 16px; margin-bottom: 20px;">Please verify your email to get started</p>
            </div>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
              <p style="margin-bottom: 20px; font-size: 16px;">Click the button below to verify your email address and activate your account:</p>
              <div style="text-align: center;">
                <a href="${verificationLink}" style="display: inline-block; background-color: #000; color: white; text-decoration: none; padding: 12px 25px; border-radius: 3px; font-weight: bold;">Verify Email Address</a>
              </div>
            </div>
            <div style="color: #888; font-size: 14px; text-align: center; margin-top: 20px;">
              <p>If you didn't create an account with Promptito, you can ignore this email.</p>
              <p>© ${new Date().getFullYear()} Promptito.xyz</p>
            </div>
          </div>
        `,
      });
      
      console.log("Email sent successfully:", email, emailResult);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Verification email sent successfully"
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    } catch (emailError: any) {
      console.error("Failed to send email:", emailError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to send verification email", 
          details: emailError.message 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
