
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Sparkles, 
  Copy, 
  RefreshCw, 
  MessageSquare,
  Brain,
  Info
} from 'lucide-react';
import { useModels } from '@/hooks/use-frameworks';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PromptingHeader } from '../shared/PromptingHeader';
import { useProjectContext } from '@/hooks/use-project-context';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { track } from '@/lib/analytics/mixpanel';

interface ScannerState {
  originalPrompt: string;
  improvedPrompt: string;
  feedback: string;
  modelId: string;
  temperature: number;
  maxTokens: number;
  isProcessing: boolean;
  requestCount: number;
  selectedProjectId?: string;
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
};

export const EnhancedPromptScanner = () => {
  const [state, setState] = useState<ScannerState>(INITIAL_STATE);
  const { currentUsage, limit, refreshUsage } = useSubscription();
  const { data: models = [] } = useModels();

  // Project context integration
  const {
    contextEnabled,
    setContextEnabled,
    contextData,
    formatContextForAI,
    hasContext,
    isContextStale
  } = useProjectContext(state.selectedProjectId, state.originalPrompt);

  const handleImprovePrompt = async (withFeedback = false) => {
    if (!state.originalPrompt.trim()) {
      toast.error("Please enter a prompt to improve.");
      return;
    }

    const effectiveLimit = limit ?? Infinity;
    if (currentUsage >= effectiveLimit) {
      toast.error(`Request limit reached (${Number.isFinite(effectiveLimit) ? effectiveLimit : '∞'}). Please upgrade to continue.`);
      return;
    }

    setState(prev => ({ ...prev, isProcessing: true }));
    const startedAt = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    track('Prompt Improvement Started', {
      withFeedback,
      modelId: state.modelId,
      temperature: state.temperature,
      maxTokens: state.maxTokens,
      contextEnabled,
      hasContext,
      projectId: state.selectedProjectId,
    });
    
    try {
      console.log('Improving prompt:', state.originalPrompt);
      console.log('With feedback:', withFeedback ? state.feedback : 'none');
      console.log('Context enabled:', contextEnabled);
      
      // Format prompt with context if enabled and available
      const promptToSend = contextEnabled && hasContext ? 
        formatContextForAI(state.originalPrompt) : 
        state.originalPrompt;

      const { data, error } = await supabase.functions.invoke('improve-prompt', {
        body: {
          originalPrompt: promptToSend,
          feedback: withFeedback ? state.feedback : '',
          frameworkType: 'scanner',
          useSystemPrompt: true,
          temperature: state.temperature,
          maxTokens: state.maxTokens,
          projectId: state.selectedProjectId // Pass project ID for context tracking
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
        isProcessing: false,
        feedback: withFeedback ? '' : prev.feedback
      }));
      await refreshUsage();
      track('Prompt Improvement Succeeded', {
        duration_ms: (typeof performance !== 'undefined' ? performance.now() : Date.now()) - startedAt,
        withFeedback,
        modelId: state.modelId,
        contextEnabled,
        hasContext,
        projectId: state.selectedProjectId,
        original_length: state.originalPrompt.length,
        improved_length: improvedText.length,
      });
      
      toast.success(contextEnabled && hasContext ? 
        "Prompt improved with project context" : 
        "Prompt improved successfully"
      );
    } catch (error) {
      console.error('Error improving prompt:', error);
      track('Prompt Improvement Failed', {
        duration_ms: (typeof performance !== 'undefined' ? performance.now() : Date.now()) - startedAt,
        withFeedback,
        modelId: state.modelId,
        contextEnabled,
        hasContext,
        projectId: state.selectedProjectId,
        error: error instanceof Error ? error.message : String(error),
      });
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
      improvedPrompt: ''
    }));
    toast.success("Improvement accepted and set as new original prompt");
  };

  const handleProjectSelect = (projectId: string) => {
    setState(prev => ({ ...prev, selectedProjectId: projectId }));
  };

  return (
    <div className="space-y-6">
      {/* Unified Header */}
      <PromptingHeader
        title="Enhanced Prompt Scanner"
        description="Analyze and improve your prompts using AI-powered best practices and system prompt optimization."
        icon={null}
        currentUsage={currentUsage}
        limit={limit ?? Infinity}
        onProjectSelect={handleProjectSelect}
        selectedProjectId={state.selectedProjectId}
      />

      {/* Project Context Status */}
      {state.selectedProjectId && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="h-4 w-4 text-primary" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Project Context</span>
                    <Switch
                      checked={contextEnabled}
                      onCheckedChange={setContextEnabled}
                      disabled={!hasContext}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {hasContext ? 
                      (contextEnabled ? 'Context will be included in prompt improvement' : 'Context available but disabled') :
                      'No context available for this project'
                    }
                  </p>
                </div>
              </div>
              
              {contextData && contextEnabled && (
                <div className="text-xs text-muted-foreground">
                  {contextData.relevantChunks.length} relevant items
                </div>
              )}
            </div>

            {isContextStale && hasContext && (
              <Alert className="mt-3">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Project context is older than 30 days. Consider updating it for better results.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Model Settings */}
      <Card>
        <CardHeader>
          <CardTitle>
            Model Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
        </CardContent>
      </Card>

      {/* Main Scanner Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Original Prompt */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Original Prompt
            </CardTitle>
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
              <Button variant="outline" onClick={() => handleCopyPrompt('original')}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Improved Prompt */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
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
                <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto min-h-32">
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
              <div className="text-center py-8 text-muted-foreground min-h-32 flex items-center justify-center">
                No improved prompt yet. Run the scanner to see enhanced results here.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Feedback Section */}
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
  );
};
