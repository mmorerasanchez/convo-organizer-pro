
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PromptingGuide = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prompting Best Practices</CardTitle>
        <CardDescription>
          A comprehensive guide to effectively structure prompts for AI systems
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          This guide will be populated with detailed prompting best practices that you provide later.
        </p>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Placeholder Content</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Be specific and clear in your instructions</li>
            <li>Break complex tasks into smaller steps</li>
            <li>Provide context and examples when possible</li>
            <li>Specify the format you want the response in</li>
            <li>Use delimiters to separate different parts of your prompt</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptingGuide;
