
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import LogoBadge from '@/components/common/LogoBadge';

const Auth = () => {
  const { user } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/40">
      <LogoBadge />
      <AuthForm />
    </div>
  );
};

export default Auth;
