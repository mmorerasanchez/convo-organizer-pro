import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Settings, Eye, Play, Copy, BookOpen } from 'lucide-react';
import { useFrameworks, useFrameworkFields, useFrameworkExamples, Framework } from '@/hooks/use-frameworks';
import { useModels } from '@/hooks/use-frameworks';
import { toast } from 'sonner';

interface FieldValues {
  [key: string]: string;
}

interface PromptDesignerState {
  selectedFramework: Framework | null;
  fieldValues: FieldValues;
  title: string;
  modelId: string;
  temperature: number;
  maxTokens: number;
  compiledPrompt: string;
  testResponse: string;
  isTesting: boolean;
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
    selectedFramework: null,
    fieldValues: {},
    title: '',
    modelId: 'gpt-4o-mini',
    temperature: 0.7,
    maxTokens: 1000,
    compiledPrompt: '',
    testResponse: '',
    isTesting: false
  });
  
  const [showExamples, setShowExamples] = useState(false);
  const [showAdvancedParams, setShowAdvancedParams] = useState(false);

  const { data: frameworks = [] } = useFrameworks();
  const { data: fields = [] } = useFrameworkFields(state.selectedFramework?.id || null);
  const { data: examples = [] } = useFrameworkExamples(state.selectedFramework?.id || null);
  const { data: models = [] } = useModels();

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

  const handleFrameworkChange = (frameworkId: string) => {
    const framework = frameworks.find(f => f.id === frameworkId) || null;
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

  const handleTestPrompt = async () => {
    if (!state.compiledPrompt.trim()) {
      toast.error("No compiled prompt to test");
      return;
    }

    setState(prev => ({ ...prev, isTesting: true }));
    
    try {
      // Simulate API call for testing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResponse = `This is a test response for the ${state.selectedFramework?.name} framework. The prompt has been successfully compiled and would be sent to ${state.modelId} with temperature ${state.temperature} and max tokens ${state.maxTokens}.`;
      
      setState(prev => ({ 
        ...prev, 
        testResponse: mockResponse,
        isTesting: false 
      }));
      
      toast.success("Prompt tested successfully");
    } catch (error) {
      console.error('Error testing prompt:', error);
      toast.error("Failed to test prompt");
      setState(prev => ({ ...prev, isTesting: false }));
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
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Prompt Designer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Framework</Label>
              <Select value={state.selectedFramework?.id || ''} onValueChange={handleFrameworkChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a prompting framework" />
                </SelectTrigger>
                <SelectContent>
                  {frameworks.map(framework => (
                    <SelectItem key={framework.id} value={framework.id}>
                      <div className="flex items-center gap-2">
                        <span>{framework.name}</span>
                        <Badge variant={framework.framework_type === 'zero-shot' ? 'default' : 'secondary'}>
                          {framework.framework_type}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Prompt Title</Label>
              <Input
                placeholder="Enter a title for your prompt"
                value={state.title}
                onChange={(e) => setState(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
          </div>

          {state.selectedFramework && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">{state.selectedFramework.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Framework Fields and Examples */}
      {state.selectedFramework && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Framework Fields */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Framework Fields</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map(renderFieldInput)}
              </CardContent>
            </Card>
          </div>

          {/* Examples and Settings */}
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
                    <CardContent className="space-y-4">
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
            <Card>
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
        </div>
      )}

      {/* Compiled Prompt Preview */}
      {state.compiledPrompt && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Compiled Prompt Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="response">Test Response</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="space-y-4">
                <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">{state.compiledPrompt}</pre>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleTestPrompt} disabled={state.isTesting}>
                    <Play className="h-4 w-4 mr-2" />
                    {state.isTesting ? 'Testing...' : 'Test Prompt'}
                  </Button>
                  <Button variant="outline" onClick={handleCopyPrompt}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Prompt
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="response" className="space-y-4">
                {state.testResponse ? (
                  <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm">{state.testResponse}</pre>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No test response yet. Test your prompt to see the results here.
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