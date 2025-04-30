
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useFrameworks, useFrameworkFields, useModels } from '@/hooks/use-frameworks';
import { usePromptDesigner, PromptState } from '@/hooks/use-prompt-designer';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Brain, Save, Copy, Trash, PlusCircle, RefreshCw } from 'lucide-react';

const PromptDesigner = () => {
  const { user, loading } = useRequireAuth();
  const { data: frameworks } = useFrameworks();
  const { data: models } = useModels();
  const { toast } = useToast();
  
  const [promptResponse, setPromptResponse] = useState<string>('');
  const [isTestingPrompt, setIsTestingPrompt] = useState(false);
  
  const {
    activePrompt,
    setActivePrompt,
    prompts,
    createPrompt,
    saveVersion,
    deletePrompt,
    testPrompt,
    compilePromptText
  } = usePromptDesigner();

  const { data: frameworkFields } = useFrameworkFields(activePrompt.frameworkId);
  
  // If framework changes, reset field values
  useEffect(() => {
    if (activePrompt.frameworkId && frameworkFields && frameworkFields.length > 0) {
      const newFieldValues = { ...activePrompt.fieldValues };
      
      // Initialize empty fields for any missing ones
      frameworkFields.forEach(field => {
        if (!newFieldValues[field.label]) {
          newFieldValues[field.label] = '';
        }
      });
      
      setActivePrompt({ ...activePrompt, fieldValues: newFieldValues });
    }
  }, [activePrompt.frameworkId, frameworkFields]);
  
  // Handle field value changes
  const handleFieldChange = (fieldName: string, value: string) => {
    setActivePrompt({
      ...activePrompt,
      fieldValues: {
        ...activePrompt.fieldValues,
        [fieldName]: value
      }
    });
  };
  
  // Handle prompt save
  const handleSavePrompt = async () => {
    try {
      if (!activePrompt.frameworkId) {
        toast({
          variant: "destructive",
          title: "Framework Required",
          description: "Please select a framework for your prompt."
        });
        return;
      }
      
      if (activePrompt.id) {
        await saveVersion.mutateAsync(activePrompt);
      } else {
        await createPrompt.mutateAsync(activePrompt);
      }
    } catch (error) {
      console.error("Error saving prompt:", error);
    }
  };
  
  // Handle prompt test
  const handleTestPrompt = async () => {
    try {
      setIsTestingPrompt(true);
      
      if (!activePrompt.modelId) {
        toast({
          variant: "destructive",
          title: "Model Required",
          description: "Please select a model for testing."
        });
        return;
      }
      
      const compiledPrompt = compilePromptText(activePrompt.fieldValues);
      
      const selectedModel = models?.find(m => m.id === activePrompt.modelId);
      const modelName = selectedModel?.provider === 'OpenAI' ? 'gpt-4o' : 'gpt-4o'; // Default to GPT-4o
      
      const result = await testPrompt.mutateAsync({
        versionId: activePrompt.id ? undefined : undefined,  // Only store test results for saved versions
        prompt: compiledPrompt,
        model: modelName,
        temperature: activePrompt.temperature,
        maxTokens: activePrompt.maxTokens
      });
      
      setPromptResponse(result.completion);
      
      toast({
        title: "Prompt Test Complete",
        description: `Response generated in ${result.response_ms}ms (${result.tokens_in} input tokens, ${result.tokens_out} output tokens)`
      });
    } catch (error) {
      console.error("Error testing prompt:", error);
      toast({
        variant: "destructive",
        title: "Test Failed",
        description: "Failed to test prompt. Check your inputs and try again."
      });
    } finally {
      setIsTestingPrompt(false);
    }
  };
  
  // Handle new prompt creation
  const handleNewPrompt = () => {
    setActivePrompt({
      title: 'Untitled Prompt',
      frameworkId: null,
      fieldValues: {},
      temperature: 0.7,
      maxTokens: 1000,
      modelId: null
    });
    setPromptResponse('');
  };
  
  // Handle prompt deletion
  const handleDeletePrompt = async () => {
    if (activePrompt.id && window.confirm('Are you sure you want to delete this prompt?')) {
      try {
        await deletePrompt.mutateAsync(activePrompt.id);
        handleNewPrompt();
      } catch (error) {
        console.error("Error deleting prompt:", error);
      }
    }
  };
  
  // If loading auth, show spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If user is not authenticated, show login message
  if (!user) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to use the Prompt Designer.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Prompt Designer</h2>
          <p className="text-muted-foreground">Create, test, and iterate on prompts using proven frameworks</p>
        </div>
        <Button onClick={handleNewPrompt} className="gap-2">
          <PlusCircle size={16} />
          New Prompt
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Editor Section */}
        <div className="space-y-4">
          {/* Prompt Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Prompt Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={activePrompt.title} 
                  onChange={(e) => setActivePrompt({ ...activePrompt, title: e.target.value })} 
                  placeholder="Enter a title for your prompt"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="framework">Framework</Label>
                <Select 
                  value={activePrompt.frameworkId || undefined} 
                  onValueChange={(value) => setActivePrompt({ ...activePrompt, frameworkId: value })}
                >
                  <SelectTrigger>
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
                  <p className="text-sm text-muted-foreground mt-1">
                    {frameworks?.find(f => f.id === activePrompt.frameworkId)?.description}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Select 
                  value={activePrompt.modelId || undefined} 
                  onValueChange={(value) => setActivePrompt({ ...activePrompt, modelId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models?.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {activePrompt.modelId && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Provider: {models?.find(m => m.id === activePrompt.modelId)?.provider}
                    {" | "}
                    Context: {models?.find(m => m.id === activePrompt.modelId)?.context_window} tokens
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="temperature">Temperature: {activePrompt.temperature.toFixed(1)}</Label>
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
                  <Label htmlFor="maxTokens">Max Tokens: {activePrompt.maxTokens}</Label>
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
          
          {/* Framework Fields */}
          {activePrompt.frameworkId && frameworkFields?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Framework Fields</CardTitle>
                <CardDescription>
                  Fill out the sections for the {frameworks?.find(f => f.id === activePrompt.frameworkId)?.name} framework
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {frameworkFields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={`field-${field.id}`}>
                      {field.label}
                      {field.help_text && (
                        <span className="text-xs text-muted-foreground ml-2">({field.help_text})</span>
                      )}
                    </Label>
                    <Textarea 
                      id={`field-${field.id}`}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      value={activePrompt.fieldValues[field.label] || ''}
                      onChange={(e) => handleFieldChange(field.label, e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleDeletePrompt} disabled={!activePrompt.id} className="gap-2">
                  <Trash size={16} />
                  Delete
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleSavePrompt} className="gap-2">
                    <Save size={16} />
                    Save Version
                  </Button>
                  <Button onClick={handleTestPrompt} disabled={isTestingPrompt} className="gap-2">
                    {isTestingPrompt ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Brain size={16} />
                    )}
                    {isTestingPrompt ? 'Testing...' : 'Test Prompt'}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}
        </div>
        
        {/* Preview Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compiled Prompt</CardTitle>
              <CardDescription>
                This is how your prompt will be sent to the model
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md overflow-auto max-h-[300px]">
                <pre className="font-mono text-sm whitespace-pre-wrap">
                  {compilePromptText(activePrompt.fieldValues)}
                </pre>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  navigator.clipboard.writeText(compilePromptText(activePrompt.fieldValues));
                  toast({
                    title: "Copied to clipboard",
                    description: "The compiled prompt has been copied to your clipboard."
                  });
                }}
                className="gap-2"
              >
                <Copy size={16} />
                Copy to Clipboard
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Model Response</CardTitle>
              <CardDescription>
                The output from the model based on your prompt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md overflow-auto max-h-[300px]">
                {promptResponse ? (
                  <div className="font-mono text-sm whitespace-pre-wrap">
                    {promptResponse}
                  </div>
                ) : (
                  <div className="text-muted-foreground italic">
                    Test your prompt to see the response here
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PromptDesigner;
