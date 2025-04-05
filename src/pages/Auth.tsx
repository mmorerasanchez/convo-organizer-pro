
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';

const Auth = () => {
  const { user } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/40">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Prompt Copilot</h1>
        <p className="text-muted-foreground">Store and organize your AI conversations</p>
      </div>
      <AuthForm />
    </div>
  );
};

export default Auth;
