
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Auth = () => {
  const { user } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/40">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-2">
          <h1 className="text-3xl font-mono font-bold tracking-tight text-gray-800">promptito</h1>
          <div className="ml-2">
            <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300 text-xs px-2 py-1 rounded-md font-medium flex flex-col items-center">
              <div className="flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                BETA
              </div>
              <span className="text-[10px] mt-0.5">made with AI</span>
            </Badge>
          </div>
        </div>
        <p className="text-muted-foreground">Store and organize your AI conversations</p>
      </div>
      <AuthForm />
    </div>
  );
};

export default Auth;
