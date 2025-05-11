
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardContent, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Validation schema for sign in form
const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

type SignInFormProps = {
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
};

const SignInForm = ({ setIsLoading, isLoading }: SignInFormProps) => {
  const { signInWithEmail } = useAuth();
  const navigate = useNavigate();

  // Setup form for sign in
  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleSignIn = async (values: z.infer<typeof signInSchema>) => {
    try {
      setIsLoading(true);
      await signInWithEmail(values.email, values.password);
      navigate('/');
    } catch (error: any) {
      // Error is already handled in signInWithEmail with toast
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
};

export default SignInForm;
