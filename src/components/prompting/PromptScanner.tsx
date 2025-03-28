
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

const PromptScanner = () => {
  const [promptInput, setPromptInput] = useState('');
  const [improvedPrompt, setImprovedPrompt] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleScanPrompt = () => {
    if (!promptInput.trim()) return;
    
    setIsScanning(true);
    
    // This is a placeholder for the actual prompt improvement logic
    // In the future, this will use your guide's best practices to improve the prompt
    setTimeout(() => {
      const improved = improvePrompt(promptInput);
      setImprovedPrompt(improved);
      setIsScanning(false);
    }, 1500);
  };

  // Placeholder function - replace with actual improvement logic later
  const improvePrompt = (prompt: string) => {
    // Simple placeholder improvements
    let improved = prompt;
    
    // Add specificity
    improved = improved.trim() + "\n\nPlease provide a detailed response with examples if possible.";
    
    // Add format guidance
    improved += "\n\nFormat your response as a numbered list of key points, followed by a brief summary.";
    
    return improved;
  };

  const handleClear = () => {
    setPromptInput('');
    setImprovedPrompt('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Original Prompt</CardTitle>
          <CardDescription>
            Enter your informal prompt to get suggestions for improvement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Enter your prompt here..."
            className="min-h-[200px]"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClear}>Clear</Button>
          <Button 
            onClick={handleScanPrompt} 
            disabled={!promptInput.trim() || isScanning}
            className="gap-2"
          >
            <Brain size={16} />
            {isScanning ? 'Analyzing...' : 'Scan & Improve'}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Improved Prompt</CardTitle>
          <CardDescription>
            Based on best practices and guidelines
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="Your improved prompt will appear here..."
            className="min-h-[200px]"
            value={improvedPrompt}
            readOnly
          />
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            The scanner applies best practices from the prompting guide to enhance your prompt's effectiveness.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PromptScanner;
