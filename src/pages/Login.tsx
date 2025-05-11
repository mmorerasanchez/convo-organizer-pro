
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogIn, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import LogoBadge from '@/components/common/LogoBadge';

const Login = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/40">
      <LogoBadge />

      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Sign in</h2>
          <p className="text-sm text-muted-foreground mt-1">Continue to promptito</p>
          <p className="text-xs text-green-600 mt-2 font-medium">No email verification required - sign up and use immediately!</p>
        </div>

        <div className="space-y-4">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => window.location.href = '/auth'}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign in with email
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
