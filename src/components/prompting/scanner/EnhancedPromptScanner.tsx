
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Sparkles, 
  Copy, 
  RefreshCw, 
  Zap, 
  Settings, 
  ChevronDown,
  MessageSquare,
  TrendingUp 
} from 'lucide-react';
import { useModels } from '@/hooks/use-frameworks';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ScannerState {
  originalPrompt: string;
  improvedPrompt: string;
  feedback: string;
  modelId: string;
  temperature: number;
  maxTokens: number;
  isProcessing: boolean;
  requestCount: number;
  activeTab: 'original' | 'improved';
  showAdvancedParams: boolean;
}

const INITIAL_STATE: ScannerState = {
  originalPrompt: '',
  improvedPrompt: '',
  feedback: '',
  modelId: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 1000,
  isProcessing: false,
  requestCount: 0,
  activeTab: 'original',
  showAdvancedParams: false,
};

export const EnhancedPromptScanner = () => {
  const [state, setState] = useState<ScannerState>(INITIAL_STATE);
  const { data: models = [] } = useModels();
  
  const requestLimit = 10; // Free tier limit

  const handleImprovePrompt = async (withFeedback = false) => {
    if (!state.originalPrompt.trim()) {
      toast.error("Please enter a prompt to improve.");
      return;
    }

    if (state.requestCount >= requestLimit) {
      toast.error(`Request limit reached (${requestLimit}). Please try again later.`);
      return;
    }

    setState(prev => ({ ...prev, isProcessing: true, activeTab: 'improved' }));
    
    try {
      console.log('Improving prompt:', state.originalPrompt);
      console.log('With feedback:', withFeedback ? state.feedback : 'none');
      
      // Use Supabase edge function instead of fetch API
      const { data, error } = await supabase.functions.invoke('improve-prompt', {
        body: {
          originalPrompt: state.originalPrompt,
          feedback: withFeedback ? state.feedback : '',
          frameworkType: 'scanner',
          useSystemPrompt: true,
          temperature: state.temperature,
          maxTokens: state.maxTokens
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from edge function');
      }

      console.log('Edge function response:', data);
      
      const improvedText = data.completion || data.improvedPrompt || data.generatedText;
      
      if (!improvedText) {
        throw new Error('No improved prompt returned');
      }

      setState(prev => ({ 
        ...prev, 
        improvedPrompt: improvedText,
        requestCount: prev.requestCount + 1,
        isProcessing: false,
        feedback: withFeedback ? '' : prev.feedback // Clear feedback only if it was used
      }));
      
      toast.success("Prompt improved successfully");
    } catch (error) {
      console.error('Error improving prompt:', error);
      toast.error(error instanceof Error ? error.message : "Failed to improve prompt");
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const handleInitialScan = () => {
    handleImprovePrompt(false);
  };

  const handleFeedbackSubmit = () => {
    if (!state.feedback.trim()) {
      toast.error("Please enter feedback to improve the prompt further.");
      return;
    }
    handleImprovePrompt(true);
  };

  const handleClear = () => {
    setState(INITIAL_STATE);
  };

  const handleCopyPrompt = (promptType: 'original' | 'improved') => {
    const textToCopy = promptType === 'original' ? state.originalPrompt : state.improvedPrompt;
    navigator.clipboard.writeText(textToCopy);
    toast.success(`${promptType === 'original' ? 'Original' : 'Improved'} prompt copied to clipboard`);
  };

  const handleAcceptImprovement = () => {
    setState(prev => ({
      ...prev,
      originalPrompt: prev.improvedPrompt,
      improvedPrompt: '',
      activeTab: 'original'
    }));
    toast.success("Improvement accepted and set as new original prompt");
  };

  return (
    <div className="space-y-6">
      {/* Header with Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Enhanced Prompt Scanner
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {state.requestCount}/{requestLimit} requests
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Analyze and improve your prompts using AI-powered best practices and system prompt optimization.
          </p>
        </CardContent>
      </Card>

      {/* Main Scanner Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Input and Settings */}
        <div className="space-y-6">
          {/* Original Prompt Input */}
          <Card>
            <CardHeader>
              <CardTitle>Original Prompt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your prompt here to analyze and improve it..."
                value={state.originalPrompt}
                onChange={(e) => setState(prev => ({ ...prev, originalPrompt: e.target.value }))}
                className="min-h-32"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleInitialScan} 
                  disabled={state.isProcessing || !state.originalPrompt.trim()}
                  className="flex-1"
                >
                  {state.isProcessing ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  {state.isProcessing ? 'Scanning...' : 'Scan & Improve'}
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Model Settings */}
          <Card>
            <CardHeader>
              <Collapsible open={state.showAdvancedParams} onOpenChange={(open) => setState(prev => ({ ...prev, showAdvancedParams: open }))}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-0">
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Advanced Settings
                    </CardTitle>
                    <ChevronDown className={`h-4 w-4 transition-transform ${state.showAdvancedParams ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            </CardHeader>
            <Collapsible open={state.showAdvancedParams} onOpenChange={(open) => setState(prev => ({ ...prev, showAdvancedParams: open }))}>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Select value={state.modelId} onValueChange={(value) => setState(prev => ({ ...prev, modelId: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map(model => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.display_name || model.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Temperature: {state.temperature}</Label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={state.temperature}
                      onChange={(e) => setState(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Max Tokens</Label>
                    <Input
                      type="number"
                      value={state.maxTokens}
                      onChange={(e) => setState(prev => ({ ...prev, maxTokens: parseInt(e.target.value) || 1000 }))}
                      min={100}
                      max={4000}
                      step={100}
                    />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="space-y-6">
          {/* Improved Prompt Display */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Improved Prompt
              </CardTitle>
            </CardHeader>
            <CardContent>
              {state.isProcessing ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">Analyzing and improving your prompt...</p>
                </div>
              ) : state.improvedPrompt ? (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm">{state.improvedPrompt}</pre>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleCopyPrompt('improved')} variant="outline" size="sm">
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button onClick={handleAcceptImprovement} size="sm">
                      Accept Improvement
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No improved prompt yet. Run the scanner to see enhanced results here.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feedback Input */}
          {state.improvedPrompt && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Provide Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter specific feedback to further improve the prompt..."
                  value={state.feedback}
                  onChange={(e) => setState(prev => ({ ...prev, feedback: e.target.value }))}
                  className="min-h-20"
                />
                <Button 
                  onClick={handleFeedbackSubmit} 
                  disabled={state.isProcessing || !state.feedback.trim()}
                  className="w-full"
                >
                  {state.isProcessing ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Improve with Feedback
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
