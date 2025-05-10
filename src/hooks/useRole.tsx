
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'admin' | 'customer';

export const useRole = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user) {
        setRoles([]);
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching roles for user:", user.id);
        
        // Fetch user roles from the user_roles table
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching user roles:', error);
          setRoles([]);
        } else {
          // Map the data to an array of role names
          const userRoles = data.map(item => item.role as UserRole);
          console.log("Fetched user roles:", userRoles);
          
          // If no roles found, try to assign the default 'customer' role
          if (userRoles.length === 0) {
            console.log("No roles found for user, attempting to assign default 'customer' role");
            
            try {
              const { error: insertError } = await supabase
                .from('user_roles')
                .insert([
                  { user_id: user.id, role: 'customer' }
                ]);
              
              if (insertError) {
                console.error("Failed to assign customer role:", insertError);
              } else {
                console.log("Successfully assigned 'customer' role to user");
                setRoles(['customer']);
              }
            } catch (assignError) {
              console.error("Error assigning default role:", assignError);
            }
          } else {
            setRoles(userRoles);
          }
        }
      } catch (error) {
        console.error('Unexpected error fetching roles:', error);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();
  }, [user]);

  const hasRole = (role: UserRole) => roles.includes(role);
  const isAdmin = () => hasRole('admin');
  const isCustomer = () => hasRole('customer');

  return {
    roles,
    loading,
    hasRole,
    isAdmin,
    isCustomer,
  };
};
