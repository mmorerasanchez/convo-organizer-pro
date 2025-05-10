
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, AlertCircle } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback triggered");
        console.log("Current URL:", window.location.href);
        console.log("URL hash:", location.hash);
        console.log("URL search:", location.search);
        
        // Extract type parameter to determine flow type (signup, recovery, etc.)
        const urlParams = new URLSearchParams(location.search);
        const hashParams = new URLSearchParams(location.hash.replace('#', '?'));
        
        // Get flow type from either query parameters or hash
        const typeFromQuery = urlParams.get('type');
        const typeFromHash = hashParams.get('type');
        const flowType = typeFromQuery || typeFromHash;
        
        // Check for OAuth provider info
        const provider = urlParams.get('provider') || hashParams.get('provider');
        
        console.log("Flow type:", flowType);
        console.log("Provider:", provider);
        
        const isVerification = flowType === 'signup' || flowType === 'recovery';
        const isOAuth = provider === 'google';
        
        console.log("Is verification flow:", isVerification);
        console.log("Is OAuth flow:", isOAuth);
        
        // Process the URL fragment (hash) and query parameters
        if (location.hash || location.search) {
          console.log("Processing auth parameters...");
          
          try {
            // Let Supabase auth handle the fragment/hash and query params
            const { data: sessionData, error: fragmentError } = await supabase.auth.getSession();
            
            if (fragmentError) {
              console.error("Error processing auth parameters:", fragmentError);
              setError(fragmentError.message);
              toast.error("Authentication failed: " + fragmentError.message);
              setProcessing(false);
              setTimeout(() => navigate('/login'), 2000);
              return;
            }
            
            // Check if we got a session
            if (sessionData.session) {
              console.log("Session found after parameter processing:", sessionData.session);
            }
          } catch (e) {
            console.error("Error during session processing:", e);
          }
        }
        
        // Get the current session
        console.log("Checking final session state");
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError.message);
          toast.error("Authentication failed: " + sessionError.message);
          setProcessing(false);
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        
        console.log("Final session data:", data);
        
        if (data.session) {
          // Check if user profile exists, if not create one
          await ensureUserProfile(data.session.user.id, data.session.user);
          
          // Check if user has roles assigned, if not assign default role
          await checkUserRoles(data.session.user.id);
          
          if (isVerification) {
            // This is from email verification, redirect to success page
            console.log("Email verified successfully, redirecting to success page");
            navigate('/verify-success', { replace: true });
          } else {
            // Standard login flow
            console.log("Login successful, redirecting to dashboard");
            toast.success(isOAuth ? "Successfully signed in with Google!" : "Successfully signed in!");
            navigate('/', { replace: true });
          }
        } else {
          // No session but no error either, unusual state
          console.warn("No session found but no error reported");
          setError("Unable to complete authentication. Please try signing in manually.");
          setProcessing(false);
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (error: any) {
        console.error("Error handling auth callback:", error);
        setError(error.message || "Authentication failed");
        toast.error("Authentication failed");
        setProcessing(false);
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    handleAuthCallback();
  }, [navigate, location]);

  // Ensure user has a profile
  const ensureUserProfile = async (userId: string, user: any) => {
    try {
      console.log("Checking if user profile exists for:", userId);
      
      // Check if user profile exists
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError || !profileData) {
        console.log("No profile found, creating one");
        
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: userId,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
            avatar_url: user.user_metadata?.avatar_url || null
          }]);
        
        if (insertError) {
          console.error("Failed to create user profile:", insertError);
          return;
        }
        
        console.log("Successfully created user profile");
      } else {
        console.log("User profile already exists:", profileData);
      }
    } catch (error) {
      console.error("Error in profile management:", error);
    }
  };

  // Check if user has roles and create one if missing
  const checkUserRoles = async (userId: string) => {
    try {
      console.log("Checking user roles for:", userId);
      
      // First check if user has any roles
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (roleError) {
        console.error("Error checking user roles:", roleError);
        return;
      }
      
      console.log("User roles data:", roleData);
      
      // If no roles found, assign the default 'customer' role
      if (!roleData || roleData.length === 0) {
        console.log("No roles found, assigning default 'customer' role");
        
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert([
            { user_id: userId, role: 'customer' }
          ]);
        
        if (insertError) {
          console.error("Failed to assign customer role:", insertError);
        } else {
          console.log("Successfully assigned 'customer' role to user");
        }
      } else {
        console.log("User already has roles assigned:", roleData);
      }
    } catch (error) {
      console.error("Error in role assignment:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <div>
            <div className="text-red-500 mb-4">
              <AlertCircle className="h-12 w-12 mx-auto mb-2" />
              <p className="text-xl font-semibold">Authentication Error</p>
              <p className="mt-2">{error}</p>
            </div>
            <p className="text-muted-foreground">Redirecting to login...</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto" />
            </div>
            <p className="text-lg font-medium">Processing your authentication</p>
            <p className="text-muted-foreground mt-2">This will only take a moment...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
