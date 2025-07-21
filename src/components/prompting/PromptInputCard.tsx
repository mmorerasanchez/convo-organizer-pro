
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, RefreshCw, XCircle } from 'lucide-react';
import { EnhancedModelSelector } from '@/components/common/EnhancedModelSelector';
import { ModelParametersPanel } from './scanner/ModelParametersPanel';

interface PromptInputCardProps {
  promptInput: string;
  onChange: (value: string) => void;
  onScan: () => void;
  onClear: () => void;
  isProcessing: boolean;
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
  temperature: number;
  onTemperatureChange: (temp: number) => void;
  maxTokens: number;
  onMaxTokensChange: (tokens: number) => void;
  showAdvancedParams: boolean;
  onToggleAdvancedParams: () => void;
}

export function PromptInputCard({
  promptInput,
  onChange,
  onScan,
  onClear,
  isProcessing,
  selectedModelId,
  onModelChange,
  temperature,
  onTemperatureChange,
  maxTokens,
  onMaxTokensChange,
  showAdvancedParams,
  onToggleAdvancedParams,
}: PromptInputCardProps) {
  return (
    <Card className="overflow-hidden border hover:shadow-md transition-all duration-200">
      <CardHeader>
        <CardTitle>Your Original Prompt</CardTitle>
        <CardDescription>
          Enter your informal prompt to get AI-powered improvement suggestions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <EnhancedModelSelector
          value={selectedModelId}
          onChange={onModelChange}
          showRecommendations={true}
        />
        
        <ModelParametersPanel
          temperature={temperature}
          onTemperatureChange={onTemperatureChange}
          maxTokens={maxTokens}
          onMaxTokensChange={onMaxTokensChange}
          isOpen={showAdvancedParams}
          onToggle={onToggleAdvancedParams}
        />
        
        <Textarea 
          placeholder="Enter your prompt here... (e.g., 'Tell me about climate change')"
          className="min-h-[180px] bg-background border text-sm font-mono prompt-area resize-none focus-visible:ring-2 focus-visible:ring-primary/20"
          value={promptInput}
          onChange={(e) => onChange(e.target.value)}
        />
      </CardContent>
      <CardFooter className="justify-between bg-muted/10 border-t">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClear} 
        >
          <XCircle className="h-4 w-4 mr-2" />
          Clear
        </Button>
        <Button 
          onClick={onScan} 
          disabled={!promptInput.trim() || isProcessing}
          size="sm"
          className="gap-2"
        >
          {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
          {isProcessing ? 'Processing...' : 'Scan & Improve'}
        </Button>
      </CardFooter>
    </Card>
  );
}
