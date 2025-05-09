
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Check, Loader2, XCircle } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const VerifySuccess = () => {
  const navigate = useNavigate();
  const [verificationState, setVerificationState] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if this is a redirected verification
    const checkVerification = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Verification error:", error);
          setVerificationState('error');
          setErrorMessage(error.message);
          return;
        }
        
        if (data.session) {
          // If we have a session, verification was successful
          setVerificationState('success');
        } else {
          // No session, might need to process the hash
          const hash = window.location.hash;
          if (hash && hash.includes('access_token')) {
            // Process the redirect with hash
            const { error } = await supabase.auth.getUser();
            if (error) {
              console.error("Error processing auth redirect:", error);
              setVerificationState('error');
              setErrorMessage(error.message);
            } else {
              setVerificationState('success');
            }
          } else {
            // No hash and no session, might be a direct page visit
            setVerificationState('error');
            setErrorMessage("No verification data found. Please try signing in.");
          }
        }
      } catch (error: any) {
        console.error("Unexpected error during verification:", error);
        setVerificationState('error');
        setErrorMessage(error.message || "An unexpected error occurred");
      }
    };
    
    checkVerification();
  }, [navigate]);
  
  const handleGoToLogin = () => {
    navigate('/auth');
  };
  
  const handleGoToDashboard = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/40">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-2">
          <h1 className="text-3xl font-mono font-bold tracking-tight text-gray-800">promptito</h1>
          <div className="ml-2">
            <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300 text-xs px-2 py-1 rounded-md font-medium flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              BETA made with AI
            </Badge>
          </div>
        </div>
        <p className="text-muted-foreground">Store and organize your AI conversations</p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {verificationState === 'loading' ? 'Verifying Your Email' : 
             verificationState === 'success' ? 'Email Verified!' : 
             'Verification Error'}
          </CardTitle>
          <CardDescription className="text-center">
            {verificationState === 'loading' ? 'Please wait while we confirm your email address' :
             verificationState === 'success' ? 'Your account is now active' :
             'We encountered a problem verifying your email'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center justify-center py-6">
          {verificationState === 'loading' && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-center text-muted-foreground">This will only take a moment...</p>
            </div>
          )}
          
          {verificationState === 'success' && (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-green-100 p-4">
                <Check className="h-12 w-12 text-green-600" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">Your email has been successfully verified!</p>
                <p className="text-muted-foreground mt-1">You can now access all features of promptito.</p>
              </div>
            </div>
          )}
          
          {verificationState === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-red-100 p-4">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">Verification failed</p>
                <p className="text-muted-foreground mt-1">{errorMessage || "Please try signing in or request a new verification email."}</p>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3">
          {verificationState === 'success' ? (
            <>
              <Button 
                className="w-full" 
                onClick={handleGoToDashboard}
              >
                Go to Dashboard
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleGoToLogin}
              >
                Back to Login
              </Button>
            </>
          ) : verificationState === 'error' ? (
            <Button 
              className="w-full" 
              onClick={handleGoToLogin}
            >
              Back to Login
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifySuccess;
