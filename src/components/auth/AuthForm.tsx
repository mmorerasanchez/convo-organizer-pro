
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, AlertCircle, Check, Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from '@/components/ui/separator';

// Validation schema for authentication forms
const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
});

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const navigate = useNavigate();

  // Get the current origin for redirection
  const origin = window.location.origin;

  // Setup form for sign in
  const signInForm = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // Setup form for sign up
  const signUpForm = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleSignUp = async (values: z.infer<typeof authSchema>) => {
    try {
      setIsLoading(true);
      
      // Store email for verification message
      setVerificationEmail(values.email);
      
      try {
        // Call our custom Edge Function to send a verification email
        const response = await fetch(`${origin}/functions/v1/send-verification-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabase.auth.getSession()}`
          },
          body: JSON.stringify({ email: values.email }),
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to send verification email');
        }
        
        // Skip default Supabase email and use our custom email
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            emailRedirectTo: `${origin}/verify-success`,
          }
        });
        
        if (error) throw error;
        
        // Show verification message
        setVerificationSent(true);
        toast.success("Sign up successful! Please check your email for verification.");
        signUpForm.reset();
      } catch (edgeFunctionError: any) {
        console.error("Edge function error:", edgeFunctionError);
        // Fall back to default Supabase email if our Edge Function fails
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            emailRedirectTo: `${origin}/verify-success`,
          }
        });
        
        if (error) throw error;
        
        // Show verification message
        setVerificationSent(true);
        toast.success("Sign up successful! Please check your email for verification.");
        signUpForm.reset();
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during sign up");
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (values: z.infer<typeof authSchema>) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) throw error;
      
      toast.success("Successfully signed in!");
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || "An error occurred during sign in");
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // If verification email was sent, show confirmation screen
  if (verificationSent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Verification Email Sent</CardTitle>
          <CardDescription className="text-center">
            Check your inbox
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center my-6">
            <div className="rounded-full bg-green-100 p-3">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <Alert className="bg-blue-50 text-blue-800 border-blue-200">
            <InfoIcon className="h-4 w-4 mr-2" />
            <AlertDescription>
              We've sent a verification email to <strong>{verificationEmail}</strong>. 
              Please check your inbox and click the verification link.
            </AlertDescription>
          </Alert>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            After verifying your email, you'll be able to sign in to your account.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => {
              setVerificationSent(false);
              setVerificationEmail("");
            }}
          >
            Back to Sign In
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <Tabs defaultValue="signin">
        <CardHeader>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <TabsContent value="signin">
          <Form {...signInForm}>
            <form onSubmit={signInForm.handleSubmit(handleSignIn)}>
              <CardContent className="space-y-4">
                <CardDescription>
                  Enter your credentials to sign in to your account
                </CardDescription>
                
                <FormField
                  control={signInForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="your.email@example.com" 
                          autoComplete="username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signInForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </CardContent>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="signup">
          <Form {...signUpForm}>
            <form onSubmit={signUpForm.handleSubmit(handleSignUp)}>
              <CardContent className="space-y-4">
                <CardDescription>
                  Create a new account to get started
                </CardDescription>
                
                <Alert className="bg-blue-50 text-blue-800 border-blue-200 mb-4">
                  <InfoIcon className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    After signing up, you'll need to confirm your email before signing in.
                  </AlertDescription>
                </Alert>
                
                <FormField
                  control={signUpForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="your.email@example.com" 
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signUpForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Password requirements:</p>
                  <ul className="list-disc pl-4">
                    <li>At least 8 characters</li>
                    <li>At least one uppercase letter</li>
                    <li>At least one lowercase letter</li>
                    <li>At least one number</li>
                  </ul>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </CardContent>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
