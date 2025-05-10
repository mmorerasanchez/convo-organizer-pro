
import React from 'react';
import { useRole } from '@/hooks/useRole';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface RoleCheckProps {
  role: 'admin' | 'customer';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const RoleCheck: React.FC<RoleCheckProps> = ({ 
  role, 
  children, 
  fallback = <div className="p-6 text-center text-muted-foreground">You don't have permission to view this content.</div>
}) => {
  const { user, loading: authLoading } = useAuth();
  const { hasRole, loading: roleLoading } = useRole();
  
  // If still loading, show loading indicator
  if (authLoading || roleLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Checking permissions...</span>
      </div>
    );
  }

  // If no user or user doesn't have required role, show fallback
  if (!user || !hasRole(role)) {
    return <>{fallback}</>;
  }

  // User has correct role, render children
  return <>{children}</>;
};

export default RoleCheck;
