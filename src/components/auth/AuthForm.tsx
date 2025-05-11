
import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);

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
          <SignInForm isLoading={isLoading} setIsLoading={setIsLoading} />
        </TabsContent>
        
        <TabsContent value="signup">
          <SignUpForm isLoading={isLoading} setIsLoading={setIsLoading} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
