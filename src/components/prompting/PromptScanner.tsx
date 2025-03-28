
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Copy, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PromptScanner = () => {
  const [promptInput, setPromptInput] = useState('');
  const [improvedPrompt, setImprovedPrompt] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleScanPrompt = () => {
    if (!promptInput.trim()) return;
    
    setIsScanning(true);
    
    // Simulate processing time
    setTimeout(() => {
      const improved = improvePrompt(promptInput);
      setImprovedPrompt(improved);
      setIsScanning(false);
      
      toast({
        title: "Prompt Enhanced",
        description: "Your prompt has been analyzed and improved based on best practices.",
      });
    }, 1500);
  };

  // This function applies the best practices from the guide to improve the prompt
  const improvePrompt = (prompt: string) => {
    let improved = prompt.trim();
    
    // 1. Add clear instruction if not present
    if (!improved.match(/^(summarize|explain|describe|list|create|write|generate|analyze|compare|evaluate|predict)/i)) {
      // Check if it's likely a question
      if (improved.endsWith('?')) {
        improved = `Answer the following question with detailed explanations: ${improved}`;
      } else {
        improved = `Process the following input and provide a comprehensive response: ${improved}`;
      }
    }
    
    // 2. Add context or role if not present
    if (!improved.includes("you are") && !improved.includes("act as")) {
      improved = `You are an expert assistant helping with the following task. ${improved}`;
    }
    
    // 3. Add output formatting if not specified
    if (!improved.toLowerCase().includes("format") && 
        !improved.includes("bullet") && 
        !improved.includes("point") &&
        !improved.includes("list")) {
      improved += "\n\nFormat your response as follows:\n1. Main points in a numbered list\n2. Follow with a brief summary\n3. End with one key takeaway";
    }
    
    // 4. Add step-by-step reasoning for complex questions
    if (improved.includes("why") || 
        improved.includes("how") || 
        improved.includes("explain") || 
        improved.includes("analyze")) {
      improved += "\n\nThink step by step and explain your reasoning clearly.";
    }
    
    // 5. Improve specificity
    improved = improved.replace(/something about/gi, "a detailed explanation of");
    improved = improved.replace(/tell me about/gi, "provide a comprehensive analysis of");
    
    // 6. Add length guidance if not present
    if (!improved.includes("words") && !improved.includes("sentences") && !improved.includes("paragraphs")) {
      improved += "\n\nAim for a response between 3-5 paragraphs, depending on the complexity of the topic.";
    }
    
    return improved;
  };

  const handleClear = () => {
    setPromptInput('');
    setImprovedPrompt('');
  };

  const handleCopy = () => {
    if (!improvedPrompt) return;
    
    navigator.clipboard.writeText(improvedPrompt);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "The improved prompt has been copied to your clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
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
            placeholder="Enter your prompt here... (e.g., 'Tell me about climate change')"
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
            Enhanced based on prompt engineering best practices
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
        <CardFooter className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            The scanner applies best practices from the prompting guide to enhance your prompt's effectiveness.
          </p>
          {improvedPrompt && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PromptScanner;
