
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PromptState } from '@/hooks/prompting';
import { Zap, RefreshCw } from 'lucide-react';

interface FrameworkFieldsProps {
  activePrompt: PromptState;
  frameworkFields: any[];
  frameworks?: any[];
  handleFieldChange: (fieldName: string, value: string) => void;
  handleSavePrompt: () => void;
  handleTestPrompt: () => void;
  isTestingPrompt: boolean;
  showSaveModal?: () => void;
  handleNewPrompt: () => void;
}

export function FrameworkFields({
  activePrompt,
  frameworkFields,
  frameworks,
  handleFieldChange,
  handleTestPrompt,
  isTestingPrompt,
  handleNewPrompt,
}: FrameworkFieldsProps) {
  const selectedFramework = frameworks?.find(f => f.id === activePrompt.frameworkId);
  
  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardHeader className="bg-white pb-2">
        <CardTitle className="text-lg font-medium">
          {selectedFramework?.name || 'Framework'} Fields
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        {frameworkFields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.label} className="text-sm font-medium">
              {field.label}
            </Label>
            <Textarea
              id={field.label}
              className="min-h-24 resize-y"
              placeholder={`Enter ${field.label.toLowerCase()}`}
              value={activePrompt.fieldValues[field.label] || ''}
              onChange={(e) => handleFieldChange(field.label, e.target.value)}
            />
            {field.help_text && (
              <p className="text-xs text-muted-foreground mt-1">{field.help_text}</p>
            )}
          </div>
        ))}
      </CardContent>
      <CardFooter className="bg-muted/20 px-6 py-4 border-t flex flex-wrap gap-2">
        <Button 
          onClick={handleTestPrompt} 
          disabled={isTestingPrompt} 
          className="gap-2 mr-2"
        >
          {isTestingPrompt ? (
            <RefreshCw size={16} className="animate-spin h-3.5 w-3.5" />
          ) : (
            <Zap size={16} className="h-3.5 w-3.5" />
          )}
          {isTestingPrompt ? 'Generating...' : 'Generate model response'}
        </Button>
        <Button 
          onClick={handleNewPrompt}
          variant="outline" 
          className="gap-2" 
        >
          New Prompt
        </Button>
      </CardFooter>
    </Card>
  );
}
