
import React from 'react';
import { useRole } from '@/hooks/useRole';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface AdminOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AdminOnly: React.FC<AdminOnlyProps> = ({ 
  children, 
  fallback = (
    <Alert variant="destructive" className="my-4">
      <AlertTriangle className="h-4 w-4 mr-2" />
      <AlertDescription>
        This section requires admin privileges.
      </AlertDescription>
    </Alert>
  )
}) => {
  const { isAdmin, loading } = useRole();
  
  if (loading) {
    return <div className="py-2 text-sm text-muted-foreground">Checking permissions...</div>;
  }

  return isAdmin() ? <>{children}</> : <>{fallback}</>;
};

export default AdminOnly;
