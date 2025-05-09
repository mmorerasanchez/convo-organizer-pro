
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
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError.message);
          toast.error("Authentication failed: " + sessionError.message);
          setTimeout(() => navigate('/auth'), 2000);
          return;
        }
        
        // Check if this is an email verification redirect
        if (location.hash && location.hash.includes('type=signup')) {
          // This is coming from email verification
          // Redirect to the verification success page
          navigate('/verify-success');
          return;
        }
        
        if (data.session) {
          toast.success("Successfully signed in!");
          navigate('/');
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
