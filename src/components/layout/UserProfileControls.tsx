
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const UserProfileControls: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <div className="ml-auto flex gap-2 items-center">
      {user ? (
        <>
          <div className="text-sm text-muted-foreground font-mono mr-2">
            {user.email}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleSignOut}
            title="Sign out"
            className="h-8 w-8"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <Link to="/auth">
          <Button variant="ghost" size="sm" className="gap-1.5 h-8 font-mono">
            <UserCircle className="h-4 w-4" />
            Sign In
          </Button>
        </Link>
      )}
    </div>
  );
};

export default UserProfileControls;
