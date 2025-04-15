import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Copy, CheckCircle2, ArrowLeft, RefreshCw, ThumbsUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const PromptScanner = () => {
  const [promptInput, setPromptInput] = useState('');
  const [improvedPrompt, setImprovedPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackHistory, setFeedbackHistory] = useState<Array<{feedback: string, improvedPrompt: string}>>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const { toast } = useToast();
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState('');

  const handleImprovePrompt = async (originalPrompt: string, userFeedback?: string) => {
    if (!originalPrompt.trim()) return;
    
    setIsProcessing(true);
    setApiError(null);
    
    try {
      const response = await fetch('https://lovable.app/functions/v1/improve-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalPrompt,
          feedback: userFeedback,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to improve prompt');
      }
      
      const data = await response.json();
      setImprovedPrompt(data.improvedPrompt);
      
      toast({
        title: userFeedback ? "Prompt Refined" : "Prompt Enhanced",
        description: userFeedback 
          ? "Your prompt has been refined based on your feedback."
          : "Your prompt has been enhanced using best practices.",
      });
    } catch (error) {
      console.error('Error improving prompt:', error);
      setApiError(error instanceof Error ? error.message : 'An unexpected error occurred');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to improve your prompt. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenFeedbackDialog = () => {
    setFeedbackDialogOpen(true);
  };

  const handleSubmitFeedback = () => {
    if (currentFeedback.trim()) {
      handleImprovePrompt(promptInput, currentFeedback);
      setFeedbackDialogOpen(false);
      setCurrentFeedback('');
    }
  };

  const handleInitialScan = () => {
    handleImprovePrompt(promptInput);
  };

  const handleTryAgain = () => {
    setFeedbackOpen(true);
  };

  const handleSubmitFeedback2 = () => {
    if (feedback.trim()) {
      // Store the current improvement in history before getting a new one
      setFeedbackHistory([
        ...feedbackHistory,
        {
          feedback,
          improvedPrompt
        }
      ]);
      
      handleImprovePrompt(promptInput, feedback);
      setFeedbackOpen(false);
      setFeedback('');
    } else {
      toast({
        variant: "destructive",
        title: "Feedback Required",
        description: "Please provide feedback to help improve the prompt.",
      });
    }
  };

  const handleAccept = () => {
    toast({
      title: "Prompt Accepted",
      description: "The improved prompt has been copied to your clipboard and is ready to use.",
    });
    
    navigator.clipboard.writeText(improvedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevertToPrevious = () => {
    if (feedbackHistory.length > 0) {
      const previousState = feedbackHistory[feedbackHistory.length - 1];
      setImprovedPrompt(previousState.improvedPrompt);
      
      // Remove the last item from history
      setFeedbackHistory(feedbackHistory.slice(0, -1));
      
      toast({
        title: "Reverted to Previous Version",
        description: "You've returned to the previous prompt improvement.",
      });
    }
  };

  const handleClear = () => {
    setPromptInput('');
    setImprovedPrompt('');
    setFeedbackHistory([]);
    setApiError(null);
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
    <div className="space-y-6">
      {apiError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            {apiError}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Original Prompt</CardTitle>
            <CardDescription>
              Enter your informal prompt to get AI-powered improvement suggestions
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
              onClick={handleInitialScan} 
              disabled={!promptInput.trim() || isProcessing}
              className="gap-2"
            >
              {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
              {isProcessing ? 'Processing...' : 'Scan & Improve'}
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
          <CardFooter className="flex flex-col space-y-4">
            <div className="w-full flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Not satisfied? Provide feedback for further improvement.
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
            </div>
            
            {improvedPrompt && (
              <div className="w-full flex justify-between gap-4">
                {feedbackHistory.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={handleRevertToPrevious}
                    className="gap-2"
                  >
                    <ArrowLeft size={16} />
                    Previous Version
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={handleOpenFeedbackDialog}
                  className="gap-2"
                  disabled={isProcessing}
                >
                  <RefreshCw size={16} />
                  Try Again
                </Button>
                
                <Button 
                  onClick={handleAccept}
                  className="gap-2"
                  disabled={isProcessing}
                >
                  <ThumbsUp size={16} />
                  Accept
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>

      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provide Improvement Feedback</DialogTitle>
            <DialogDescription>
              Help us understand how you'd like the prompt to be improved.
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            value={currentFeedback}
            onChange={(e) => setCurrentFeedback(e.target.value)}
            placeholder="e.g., Make it more concise, Add more context, Change the tone..."
            className="mt-4 min-h-[100px]"
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitFeedback}
              disabled={!currentFeedback.trim()}
            >
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromptScanner;
