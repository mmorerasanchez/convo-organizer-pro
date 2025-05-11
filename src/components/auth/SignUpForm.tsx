
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardContent, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Validation schema for sign up form
const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
});

type SignUpFormProps = {
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
};

const SignUpForm = ({ setIsLoading, isLoading }: SignUpFormProps) => {
  const { signUpWithEmail } = useAuth();
  const navigate = useNavigate();

  // Setup form for sign up
  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      acceptTerms: false
    }
  });

  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    try {
      setIsLoading(true);
      await signUpWithEmail(values.email, values.password, values.acceptTerms);
      navigate('/');
    } catch (error: any) {
      // Error is already handled in signUpWithEmail with toast
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...signUpForm}>
      <form onSubmit={signUpForm.handleSubmit(handleSignUp)}>
        <CardContent className="space-y-4">
          <CardDescription>
            Create a new account to get started
          </CardDescription>
          
          <Alert className="bg-blue-50 text-blue-800 border-blue-200 mb-4">
            <CheckCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              You'll be immediately logged in after creating your account.
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
          
          <FormField
            control={signUpForm.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I accept the terms and conditions
                  </FormLabel>
                  <FormMessage />
                </div>
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
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </CardContent>
      </form>
    </Form>
  );
};

export default SignUpForm;
