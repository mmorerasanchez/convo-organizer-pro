
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Settings, Eye, Play, Copy, BookOpen, Zap } from 'lucide-react';
import { useFrameworks, useFrameworkFields, useFrameworkExamples, Framework } from '@/hooks/use-frameworks';
import { useModels } from '@/hooks/use-frameworks';
import { toast } from 'sonner';

interface FieldValues {
  [key: string]: string;
}

type MethodType = 'zero-shot' | 'few-shot';

interface PromptDesignerState {
  title: string;
  selectedMethod: MethodType;
  selectedFramework: Framework | null;
  fieldValues: FieldValues;
  modelId: string;
  temperature: number;
  maxTokens: number;
  compiledPrompt: string;
  aiResponse: string;
  isRunning: boolean;
  activeTab: 'preview' | 'response';
}

const MODEL_RECOMMENDATIONS = {
  'CoT (Chain-of-Thought)': { model: 'gpt-4o-mini', temp: 0.3, tokens: 1000 },
  'RTF (Role-Task-Format)': { model: 'claude-3-5-sonnet', temp: 0.4, tokens: 800 },
  'TAG (Task-Action-Goal)': { model: 'gemini-1.5-pro', temp: 0.5, tokens: 600 },
  'ReAct (Reasoning-Action)': { model: 'gpt-4o-mini', temp: 0.4, tokens: 1200 },
  'RACE (Role-Action-Context-Execute)': { model: 'claude-3-5-sonnet', temp: 0.3, tokens: 1500 },
  'PAR (Problem-Analysis-Response)': { model: 'gemini-1.5-pro', temp: 0.2, tokens: 2000 },
  'STAR (Situation-Task-Action-Result)': { model: 'claude-3-5-sonnet', temp: 0.4, tokens: 1000 }
};

export const EnhancedPromptDesigner = () => {
  const [state, setState] = useState<PromptDesignerState>({
    title: '',
    selectedMethod: 'zero-shot',
    selectedFramework: null,
    fieldValues: {},
    modelId: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 1000,
    compiledPrompt: '',
    aiResponse: '',
    isRunning: false,
    activeTab: 'preview'
  });
  
  const [showExamples, setShowExamples] = useState(false);
  const [showAdvancedParams, setShowAdvancedParams] = useState(false);

  const { data: frameworks = [] } = useFrameworks();
  const { data: fields = [] } = useFrameworkFields(state.selectedFramework?.id || null);
  const { data: examples = [] } = useFrameworkExamples(state.selectedFramework?.id || null);
  const { data: models = [] } = useModels();

  // Filter frameworks by selected method
  const compatibleFrameworks = frameworks.filter(framework => 
    framework.framework_type === state.selectedMethod
  );

  // Auto-populate parameters when framework changes
  useEffect(() => {
    if (state.selectedFramework?.name) {
      const recommendation = MODEL_RECOMMENDATIONS[state.selectedFramework.name as keyof typeof MODEL_RECOMMENDATIONS];
      if (recommendation) {
        setState(prev => ({
          ...prev,
          modelId: recommendation.model,
          temperature: recommendation.temp,
          maxTokens: recommendation.tokens
        }));
      }
    }
  }, [state.selectedFramework]);

  // Compile prompt when field values change
  useEffect(() => {
    if (state.selectedFramework && fields.length > 0) {
      compilePrompt();
    }
  }, [state.fieldValues, state.selectedFramework, fields]);

  const compilePrompt = () => {
    if (!state.selectedFramework || fields.length === 0) return;

    let compiled = '';
    
    // Add framework context
    compiled += `Using ${state.selectedFramework.name} framework:\n\n`;
    
    // Add field values
    fields.forEach(field => {
      const value = state.fieldValues[field.id];
      if (value && value.trim()) {
        compiled += `${field.label}:\n${value}\n\n`;
      }
    });

    // Add Lovable-specific optimizations
    compiled += `\nLovable.dev Optimization Guidelines:
- Use React, TypeScript, and Tailwind CSS
- Implement mobile-first responsive design
- Follow atomic design principles for components
- Use Supabase for backend functionality
- Ensure proper RLS policies and authentication
- Optimize for performance and accessibility`;

    setState(prev => ({ ...prev, compiledPrompt: compiled.trim() }));
  };

  const handleMethodChange = (method: MethodType) => {
    setState(prev => ({
      ...prev,
      selectedMethod: method,
      selectedFramework: null,
      fieldValues: {},
      compiledPrompt: ''
    }));
  };

  const handleFrameworkChange = (frameworkId: string) => {
    const framework = compatibleFrameworks.find(f => f.id === frameworkId) || null;
    setState(prev => ({
      ...prev,
      selectedFramework: framework as Framework | null,
      fieldValues: {},
      compiledPrompt: ''
    }));
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setState(prev => ({
      ...prev,
      fieldValues: {
        ...prev.fieldValues,
        [fieldId]: value
      }
    }));
  };

  const handleRunPrompt = async () => {
    if (!state.compiledPrompt.trim()) {
      toast.error("No compiled prompt to run");
      return;
    }

    setState(prev => ({ ...prev, isRunning: true, activeTab: 'response' }));
    
    try {
      // Call the improve-prompt edge function with framework type
      const response = await fetch('/api/improve-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: state.compiledPrompt,
          frameworkType: 'designer',
          useSystemPrompt: true,
          temperature: state.temperature,
          maxTokens: state.maxTokens
        })
      });

      if (!response.ok) {
        throw new Error('Failed to run prompt');
      }

      const data = await response.json();
      
      setState(prev => ({ 
        ...prev, 
        aiResponse: data.completion || data.improvedPrompt || 'No response received',
        isRunning: false 
      }));
      
      toast.success("Prompt run successfully");
    } catch (error) {
      console.error('Error running prompt:', error);
      toast.error("Failed to run prompt");
      setState(prev => ({ ...prev, isRunning: false }));
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(state.compiledPrompt);
    toast.success("Compiled prompt copied to clipboard");
  };

  const renderFieldInput = (field: any) => (
    <div key={field.id} className="space-y-2">
      <Label htmlFor={field.id} className="text-sm font-medium">
        {field.label}
      </Label>
      <Textarea
        id={field.id}
        placeholder={field.help_text}
        value={state.fieldValues[field.id] || ''}
        onChange={(e) => handleFieldChange(field.id, e.target.value)}
        className="min-h-20"
      />
      {field.help_text && (
        <p className="text-xs text-muted-foreground">{field.help_text}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Prompt Title */}
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Prompt Designer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Prompt Title</Label>
            <Input
              placeholder="Enter a title for your prompt"
              value={state.title}
              onChange={(e) => setState(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          {/* Two Column Method and Framework Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Method Selection */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Method</Label>
              <RadioGroup 
                value={state.selectedMethod} 
                onValueChange={handleMethodChange}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="zero-shot" id="zero-shot" />
                  <Label htmlFor="zero-shot" className="cursor-pointer">
                    <div>
                      <span className="font-medium">Zero-shot</span>
                      <p className="text-sm text-muted-foreground">Direct instruction-based prompting</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="few-shot" id="few-shot" />
                  <Label htmlFor="few-shot" className="cursor-pointer">
                    <div>
                      <span className="font-medium">Few-shot</span>
                      <p className="text-sm text-muted-foreground">Example-based prompting with demonstrations</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Right Column: Framework Selection */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Framework</Label>
              <Select 
                value={state.selectedFramework?.id || ''} 
                onValueChange={handleFrameworkChange}
                disabled={compatibleFrameworks.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    compatibleFrameworks.length === 0 
                      ? `No ${state.selectedMethod} frameworks available`
                      : "Choose a compatible framework"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {compatibleFrameworks.map(framework => (
                    <SelectItem key={framework.id} value={framework.id}>
                      <div className="flex items-center gap-2">
                        <span>{framework.name}</span>
                        <Badge variant="secondary">
                          {framework.framework_type}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {state.selectedFramework && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">{state.selectedFramework.description}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Framework Fields and Model Settings - Equal Height */}
      {state.selectedFramework && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Framework Fields */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Framework Fields</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 min-h-[400px]">
              {fields.map(renderFieldInput)}
            </CardContent>
          </Card>

          {/* Model Settings and Examples */}
          <div className="space-y-6">
            {/* Examples (for few-shot frameworks) */}
            {state.selectedFramework.framework_type === 'few-shot' && examples.length > 0 && (
              <Card>
                <CardHeader>
                  <Collapsible open={showExamples} onOpenChange={setShowExamples}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between p-0">
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Examples
                        </CardTitle>
                        <ChevronDown className={`h-4 w-4 transition-transform ${showExamples ? 'rotate-180' : ''}`} />
                      </Button>
                    </CollapsibleTrigger>
                  </Collapsible>
                </CardHeader>
                <Collapsible open={showExamples} onOpenChange={setShowExamples}>
                  <CollapsibleContent>
                    <CardContent className="space-y-4 max-h-32 overflow-y-auto">
                      {examples.map((example, index) => (
                        <div key={example.id} className="space-y-2">
                          <h5 className="text-sm font-medium">{example.title}</h5>
                          <div className="bg-muted p-2 rounded text-xs">
                            <pre className="whitespace-pre-wrap">{example.content}</pre>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            )}

            {/* Model Settings */}
            <Card className="h-fit">
              <CardHeader>
                <Collapsible open={showAdvancedParams} onOpenChange={setShowAdvancedParams}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-0">
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Model Settings
                      </CardTitle>
                      <ChevronDown className={`h-4 w-4 transition-transform ${showAdvancedParams ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>
              </CardHeader>
              <Collapsible open={showAdvancedParams} onOpenChange={setShowAdvancedParams}>
                <CollapsibleContent>
                  <CardContent className="space-y-4 min-h-[300px]">
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
        </div>
      )}

      {/* Enhanced Compiled Prompt Preview with Dual Tabs */}
      {state.compiledPrompt && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Compiled Prompt Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={state.activeTab} onValueChange={(value) => setState(prev => ({ ...prev, activeTab: value as 'preview' | 'response' }))}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="response" disabled={!state.aiResponse && !state.isRunning}>
                  AI Response {state.isRunning && <Zap className="h-3 w-3 ml-1 animate-pulse" />}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="space-y-4">
                <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">{state.compiledPrompt}</pre>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleRunPrompt} disabled={state.isRunning}>
                    <Play className="h-4 w-4 mr-2" />
                    {state.isRunning ? 'Running...' : 'Run Prompt'}
                  </Button>
                  <Button variant="outline" onClick={handleCopyPrompt}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Prompt
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="response" className="space-y-4">
                {state.isRunning ? (
                  <div className="text-center py-8">
                    <Zap className="h-8 w-8 animate-pulse mx-auto mb-2" />
                    <p className="text-muted-foreground">Running prompt with AI system prompts...</p>
                  </div>
                ) : state.aiResponse ? (
                  <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm">{state.aiResponse}</pre>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No AI response yet. Run your prompt to see the enhanced results here.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
