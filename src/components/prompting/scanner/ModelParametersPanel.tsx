
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModelParametersPanelProps {
  temperature: number;
  onTemperatureChange: (value: number) => void;
  maxTokens: number;
  onMaxTokensChange: (value: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const ModelParametersPanel: React.FC<ModelParametersPanelProps> = ({
  temperature,
  onTemperatureChange,
  maxTokens,
  onMaxTokensChange,
  isOpen,
  onToggle
}) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-0 h-auto">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Settings className="h-4 w-4" />
            Advanced Parameters
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-4 mt-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="temperature" className="text-sm font-medium">
                Temperature: {temperature}
              </Label>
              <Slider
                id="temperature"
                min={0}
                max={2}
                step={0.1}
                value={[temperature]}
                onValueChange={([value]) => onTemperatureChange(value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Controls creativity vs consistency (0 = focused, 2 = creative)
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="maxTokens" className="text-sm font-medium">
                Max Tokens: {maxTokens}
              </Label>
              <Slider
                id="maxTokens"
                min={100}
                max={4000}
                step={100}
                value={[maxTokens]}
                onValueChange={([value]) => onMaxTokensChange(value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Maximum length of the generated response
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-3">
          <h4 className="text-sm font-medium mb-2">Parameter Tips</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Lower temperature (0-0.3) for factual, consistent responses</li>
            <li>• Higher temperature (0.7-1.2) for creative, varied responses</li>
            <li>• Adjust max tokens based on desired response length</li>
          </ul>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
