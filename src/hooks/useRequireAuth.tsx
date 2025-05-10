
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useRole } from './useRole';
import { toast } from 'sonner';

interface UseRequireAuthOptions {
  redirectUrl?: string;
  requiredRole?: 'admin' | 'customer';
}

export const useRequireAuth = (options: UseRequireAuthOptions = {}) => {
  const { redirectUrl = '/login', requiredRole } = options;
  const { user, loading: authLoading } = useAuth();
  const { hasRole, loading: roleLoading } = useRole();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Skip check during loading
    if (authLoading || roleLoading) {
      return;
    }
    
    // Check if user is authenticated
    if (!user) {
      console.log("No user found, redirecting to login");
      navigate(redirectUrl);
      return;
    }
    
    // If a specific role is required, check if user has that role
    if (requiredRole && !hasRole(requiredRole)) {
      console.log(`User doesn't have required role: ${requiredRole}`);
      toast.error(`You need ${requiredRole} permissions to access this page`);
      navigate('/');
      setIsAuthorized(false);
      return;
    }
    
    // User is authenticated and authorized
    setIsAuthorized(true);
  }, [user, authLoading, roleLoading, requiredRole, hasRole, navigate, redirectUrl]);

  return { 
    user, 
    loading: authLoading || roleLoading,
    isAuthenticated: !!user,
    isAuthorized
  };
};
