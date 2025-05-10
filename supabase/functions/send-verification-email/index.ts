
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Use npm instead of importing directly from esm.sh to avoid the Headers constructor issue
import { Resend } from "npm:resend@1.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request for CORS");
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
    console.log("Initializing Resend client with npm package");
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
    const { email, origin } = await req.json();
    
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
    
    // Get the origin either from request or use production URL as fallback
    const requestOrigin = origin || "https://app.promptito.xyz";
    console.log(`Using origin: ${requestOrigin}`);
    
    // Always redirect to the auth callback path
    const redirectUrl = `${requestOrigin}/auth/callback`;
    console.log(`Setting redirect URL to: ${redirectUrl}`);
    
    try {
      // First check if user already exists to handle the case properly
      const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers({
        filter: {
          email: email
        }
      });
      
      // If user already exists, handle differently
      if (existingUser && existingUser.users && existingUser.users.length > 0) {
        console.log("User already exists, generating password reset link instead");
        
        // Generate password reset link instead
        const { data: resetData, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
          type: "recovery",
          email,
          options: {
            redirectTo: redirectUrl,
          },
        });
        
        if (resetError) {
          console.error("Error generating reset link:", resetError);
          throw resetError;
        }
        
        // Send the reset email using Resend
        const resetLink = resetData.properties.action_link;
        console.log(`Reset link generated successfully: ${resetLink}`);
        
        const emailResult = await resend.emails.send({
          from: "Promptito <onboarding@resend.dev>",
          to: [email],
          subject: "Reset your password for Promptito",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e9e9; border-radius: 5px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #333; font-size: 24px; margin-bottom: 10px;">Promptito Password Reset</h1>
                <p style="color: #666; font-size: 16px; margin-bottom: 20px;">Click below to reset your password</p>
              </div>
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                <p style="margin-bottom: 20px; font-size: 16px;">Click the button below to reset your password:</p>
                <div style="text-align: center;">
                  <a href="${resetLink}" style="display: inline-block; background-color: #000; color: white; text-decoration: none; padding: 12px 25px; border-radius: 3px; font-weight: bold;">Reset Password</a>
                </div>
              </div>
              <div style="color: #888; font-size: 14px; text-align: center; margin-top: 20px;">
                <p>If you didn't request a password reset, you can ignore this email.</p>
                <p>© ${new Date().getFullYear()} Promptito.xyz</p>
              </div>
            </div>
          `,
        });
        
        console.log("Reset email sent successfully:", emailResult);
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Password reset email sent successfully",
            userExists: true,
            redirectUrl
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      // User doesn't exist, proceed with signup flow
      console.log("User doesn't exist, generating signup link");
      
      // Generate signup link with redirect to auth callback handler
      const { data, error } = await supabaseAdmin.auth.admin.generateLink({
        type: "signup",
        email,
        options: {
          redirectTo: redirectUrl,
        },
      });
      
      if (error) {
        console.error("Error generating signup link:", error);
        throw error;
      }
      
      // Send the verification email using Resend
      const verificationLink = data.properties.action_link;
      console.log(`Verification link generated successfully: ${verificationLink}`);
      
      console.log(`Attempting to send email to ${email}`);
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
      
      console.log("Email sent successfully:", emailResult);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Verification email sent successfully",
          redirectUrl
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
      
    } catch (emailError) {
      console.error("Error during authentication process:", emailError);
      
      // Fall back to standard Supabase auth flow
      return new Response(
        JSON.stringify({ 
          error: "Failed to process authentication", 
          details: emailError.message,
          fallback: true
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
