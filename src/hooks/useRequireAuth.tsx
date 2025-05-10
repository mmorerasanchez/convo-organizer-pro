
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useRole } from './useRole';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
    // Only check after auth and role loading is complete
    if (!authLoading && !roleLoading) {
      // If user is not authenticated, redirect to login
      if (!user) {
        toast.error("Please log in to access this page");
        navigate(redirectUrl);
        return;
      }
      
      // If a specific role is required, check if user has that role
      if (requiredRole) {
        const checkRole = async () => {
          try {
            // First check directly
            const hasRequiredRole = hasRole(requiredRole);
            
            if (!hasRequiredRole) {
              // If no role, try to fetch again to make sure
              const { data, error } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', user.id)
                .eq('role', requiredRole);
              
              if (error || !data || data.length === 0) {
                // User truly doesn't have the role
                toast.error(`You need ${requiredRole} permissions to access this page`);
                navigate('/'); // Redirect to home page if no permission
                setIsAuthorized(false);
                return;
              } else {
                // User does have the role
                setIsAuthorized(true);
                return;
              }
            }
            
            setIsAuthorized(true);
          } catch (error) {
            console.error("Error checking role:", error);
            toast.error(`Error verifying permissions`);
            navigate('/');
            setIsAuthorized(false);
          }
        };
        
        checkRole();
      } else {
        // No specific role required, just being authenticated is enough
        setIsAuthorized(true);
      }
    }
  }, [user, authLoading, roleLoading, requiredRole, hasRole, navigate, redirectUrl]);

  return { 
    user, 
    loading: authLoading || roleLoading,
    isAuthenticated: !!user,
    isAuthorized
  };
};
