
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function AuthenticationRequired() {
  return (
    <div className="space-y-4">
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Authentication Required</CardTitle>
          <CardDescription className="text-base">
            Please log in to use the Prompt Designer.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
