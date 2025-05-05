
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { PromptState } from '@/hooks/use-prompt-designer';

interface PromptSettingsProps {
  activePrompt: PromptState;
  setActivePrompt: (prompt: PromptState) => void;
  frameworks?: any[];
  models?: any[];
}

export function PromptSettings({
  activePrompt,
  setActivePrompt,
  frameworks,
  models,
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
        
        <div className="space-y-2">
          <Label htmlFor="model" className="text-sm font-medium">Model</Label>
          <Select 
            value={activePrompt.modelId || undefined} 
            onValueChange={(value) => setActivePrompt({ ...activePrompt, modelId: value })}
          >
            <SelectTrigger className="h-9 border">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {models?.map((model) => (
                <SelectItem 
                  key={model.id} 
                  value={model.id}
                  disabled={model.provider !== 'OpenAI'}
                  className={model.provider !== 'OpenAI' ? 'opacity-50' : ''}
                >
                  {model.display_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {activePrompt.modelId && (
            <p className="text-xs text-muted-foreground mt-1">
              Provider: {models?.find(m => m.id === activePrompt.modelId)?.provider}
              {" | "}
              Context: {models?.find(m => m.id === activePrompt.modelId)?.context_window} tokens
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="temperature" className="text-sm font-medium">Temperature: {activePrompt.temperature.toFixed(1)}</Label>
          </div>
          <Slider 
            id="temperature"
            min={0} 
            max={2} 
            step={0.1}
            value={[activePrompt.temperature]} 
            onValueChange={(value) => setActivePrompt({ ...activePrompt, temperature: value[0] })}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Low = More consistent, High = More creative
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="maxTokens" className="text-sm font-medium">Max Tokens: {activePrompt.maxTokens}</Label>
          </div>
          <Slider 
            id="maxTokens"
            min={100} 
            max={4000} 
            step={100}
            value={[activePrompt.maxTokens]} 
            onValueChange={(value) => setActivePrompt({ ...activePrompt, maxTokens: value[0] })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
