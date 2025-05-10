
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useRole } from './useRole';
import { toast } from 'sonner';

interface UseRequireAuthOptions {
  redirectUrl?: string;
  requiredRole?: 'admin' | 'customer';
}

export const useRequireAuth = (options: UseRequireAuthOptions = {}) => {
  const { redirectUrl = '/auth', requiredRole } = options;
  const { user, loading: authLoading } = useAuth();
  const { hasRole, loading: roleLoading } = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    // Only check after auth and role loading is complete
    if (!authLoading && !roleLoading) {
      // If user is not authenticated, redirect to login
      if (!user) {
        toast.error("Please log in to access this page");
        navigate(redirectUrl);
        return;
      }
      
      // If a specific role is required, check if user has that role
      if (requiredRole && !hasRole(requiredRole)) {
        toast.error(`You need ${requiredRole} permissions to access this page`);
        navigate('/'); // Redirect to home page if no permission
        return;
      }
    }
  }, [user, authLoading, roleLoading, requiredRole, hasRole, navigate, redirectUrl]);

  return { 
    user, 
    loading: authLoading || roleLoading,
    isAuthenticated: !!user
  };
};
