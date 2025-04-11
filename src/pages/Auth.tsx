
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, Sparkles } from 'lucide-react';
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
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookOpen className="h-6 w-6 text-gray-800" />
          <h1 className="text-3xl font-mono font-bold tracking-tight text-gray-800">promptito</h1>
          <Badge variant="outline" className="ml-2 bg-gray-100 text-gray-600 border-gray-300 text-xs px-1.5 py-0.5 h-5 rounded-md font-medium">
            <Sparkles className="h-3 w-3 mr-1" />
            BETA
          </Badge>
        </div>
        <p className="text-muted-foreground">Store and organize your AI conversations</p>
      </div>
      <AuthForm />
    </div>
  );
};

export default Auth;
