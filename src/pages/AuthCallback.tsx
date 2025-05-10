
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Check if this is a verification flow by examining URL hash or query params
        const isVerification = 
          (location.hash && (location.hash.includes('type=signup') || location.hash.includes('type=recovery'))) ||
          (location.search && (location.search.includes('type=signup') || location.search.includes('type=recovery')));
        
        console.log("Auth callback triggered, is verification:", isVerification);
        console.log("Current URL:", window.location.href);
        console.log("URL hash:", location.hash);
        console.log("URL search:", location.search);
        
        // Process the URL fragment (hash) and query parameters
        if (location.hash || location.search) {
          console.log("Processing auth parameters...");
          
          // Let Supabase auth handle the fragment/hash and query params
          const { error: fragmentError } = await supabase.auth.getSession();
          
          if (fragmentError) {
            console.error("Error processing auth parameters:", fragmentError);
            setError(fragmentError.message);
            toast.error("Authentication failed: " + fragmentError.message);
            setTimeout(() => navigate('/auth'), 2000);
            return;
          }
        }
        
        // Get the current session
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError.message);
          toast.error("Authentication failed: " + sessionError.message);
          setTimeout(() => navigate('/auth'), 2000);
          return;
        }
        
        console.log("Session data:", data);
        
        if (data.session) {
          if (isVerification) {
            // This is from email verification, redirect to success page
            console.log("Email verified successfully, redirecting to success page");
            navigate('/verify-success', { replace: true });
          } else {
            // Standard login flow
            console.log("Login successful, redirecting to dashboard");
            toast.success("Successfully signed in!");
            navigate('/', { replace: true });
          }
        } else {
          // No session but no error either, unusual state
          console.warn("No session found but no error reported");
          setError("Unable to complete authentication. Please try signing in manually.");
          setTimeout(() => navigate('/auth'), 2000);
        }
      } catch (error: any) {
        console.error("Error handling auth callback:", error);
        setError(error.message || "Authentication failed");
        toast.error("Authentication failed");
        setTimeout(() => navigate('/auth'), 2000);
      }
    };

    handleAuthCallback();
  }, [navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <div>
            <div className="text-red-500 mb-4">
              <p className="text-xl font-semibold">Authentication Error</p>
              <p>{error}</p>
            </div>
            <p className="text-muted-foreground">Redirecting to login...</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            </div>
            <p className="text-muted-foreground">Completing authentication...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
