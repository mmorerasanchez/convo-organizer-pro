
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, acceptedTerms: boolean) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signInWithGoogle: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        // Update session and user synchronously
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession ? "Session found" : "No session");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      toast.success('Signed in successfully');
    } catch (error: any) {
      console.error('Error signing in with email:', error);
      toast.error(error.message || 'Error signing in');
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, acceptedTerms: boolean) => {
    try {
      if (!acceptedTerms) {
        throw new Error('You must accept the terms and conditions');
      }

      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            accepted_terms: acceptedTerms,
          }
        }
      });
      
      if (error) throw error;
      
      // With email confirmation disabled, the user should be automatically logged in
      if (data.user) {
        toast.success('Account created successfully!');
      } else {
        throw new Error('Failed to create account');
      }
    } catch (error: any) {
      console.error('Error signing up with email:', error);
      toast.error(error.message || 'Error creating account');
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Construct full redirect URL
      const origin = window.location.origin;
      const redirectTo = `${origin}/auth/callback`;
      console.log("Using redirect URL:", redirectTo);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            prompt: 'select_account' // Force account selection, prevents automatic sign-in
          }
        }
      });
      
      if (error) {
        console.error('Error signing in with Google:', error);
        throw error;
      }
    } catch (error) {
      console.error('Unexpected error during Google sign-in:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signOut,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
