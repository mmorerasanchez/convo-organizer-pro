
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash, Save, Brain, RefreshCw } from 'lucide-react';
import { PromptState } from '@/hooks/use-prompt-designer';

interface FrameworkFieldsProps {
  activePrompt: PromptState;
  frameworkFields?: any[];
  frameworks?: any[];
  handleFieldChange: (fieldName: string, value: string) => void;
  handleDeletePrompt: () => void;
  handleSavePrompt: () => void;
  handleTestPrompt: () => void;
  isTestingPrompt: boolean;
}

export function FrameworkFields({
  activePrompt,
  frameworkFields,
  frameworks,
  handleFieldChange,
  handleDeletePrompt,
  handleSavePrompt,
  handleTestPrompt,
  isTestingPrompt,
}: FrameworkFieldsProps) {
  if (!activePrompt.frameworkId || !frameworkFields?.length) {
    return null;
  }

  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardHeader className="bg-white pb-2">
        <CardTitle className="text-lg font-medium">Framework Fields</CardTitle>
        <CardDescription className="text-sm">
          Fill out the sections for the {frameworks?.find(f => f.id === activePrompt.frameworkId)?.name} framework
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {frameworkFields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={`field-${field.id}`} className="text-sm font-medium">
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
              className="min-h-[100px] border"
            />
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/20 px-6 py-4 border-t">
        <Button variant="outline" onClick={handleDeletePrompt} disabled={!activePrompt.id} className="gap-2 h-9 text-sm">
          <Trash size={16} />
          Delete
        </Button>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleSavePrompt} className="gap-2 h-9 text-sm">
            <Save size={16} />
            Save Version
          </Button>
          <Button onClick={handleTestPrompt} disabled={isTestingPrompt} className="gap-2 h-9 text-sm bg-primary hover:bg-primary/90">
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
  );
}
