
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PromptState } from '@/hooks/prompting';
import { EnhancedModelSelector } from '@/components/common/EnhancedModelSelector';
import { ModelParametersPanel } from '@/components/prompting/scanner/ModelParametersPanel';

interface PromptSettingsProps {
  activePrompt: PromptState;
  setActivePrompt: (prompt: PromptState) => void;
  frameworks?: any[];
  showAdvancedParams?: boolean;
  onToggleAdvancedParams?: () => void;
}

export function PromptSettings({
  activePrompt,
  setActivePrompt,
  frameworks,
  showAdvancedParams = false,
  onToggleAdvancedParams,
}: PromptSettingsProps) {
  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardHeader className="bg-white pb-2">
        <CardTitle className="text-lg font-medium">Prompt Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">Title</Label>
          <Input 
            id="title" 
            value={activePrompt.title} 
            onChange={(e) => setActivePrompt({ ...activePrompt, title: e.target.value })} 
            placeholder="Enter a title for your prompt"
            className="h-9 border"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="framework" className="text-sm font-medium">Framework</Label>
          <Select 
            value={activePrompt.frameworkId || undefined} 
            onValueChange={(value) => setActivePrompt({ ...activePrompt, frameworkId: value })}
          >
            <SelectTrigger className="h-9 border">
              <SelectValue placeholder="Select a framework" />
            </SelectTrigger>
            <SelectContent>
              {frameworks?.map((framework) => (
                <SelectItem key={framework.id} value={framework.id}>
                  {framework.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {activePrompt.frameworkId && (
            <p className="text-xs text-muted-foreground mt-1">
              {frameworks?.find(f => f.id === activePrompt.frameworkId)?.description}
            </p>
          )}
        </div>
        
        <EnhancedModelSelector
          value={activePrompt.modelId || 'gpt-4o-mini'}
          onChange={(value) => setActivePrompt({ ...activePrompt, modelId: value })}
          showRecommendations={true}
        />
        
        <ModelParametersPanel
          temperature={activePrompt.temperature}
          onTemperatureChange={(temp) => setActivePrompt({ ...activePrompt, temperature: temp })}
          maxTokens={activePrompt.maxTokens}
          onMaxTokensChange={(tokens) => setActivePrompt({ ...activePrompt, maxTokens: tokens })}
          isOpen={showAdvancedParams}
          onToggle={onToggleAdvancedParams || (() => {})}
        />
      </CardContent>
    </Card>
  );
}
