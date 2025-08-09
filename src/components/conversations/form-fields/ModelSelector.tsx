
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AIModel } from '@/lib/types';
import { Brain } from 'lucide-react';
import { OpenAILogo } from '@/components/ui/logos/OpenAILogo';
import { GoogleLogo } from '@/components/ui/logos/GoogleLogo';
import { useModelsRegistry } from '@/hooks/useModelsRegistry';

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  models?: AIModel[];
}

const getProviderIcon = (provider: string) => {
  switch (provider) {
    case 'openai':
      return <OpenAILogo size={16} />;
    case 'google':
      return <GoogleLogo size={16} />;
    default:
      return <Brain className="h-4 w-4" />;
  }
};

export const ModelSelector: React.FC<ModelSelectorProps> = ({ value, onChange, models }) => {
  const { models: registryModels } = useModelsRegistry();
  const availableModels: AIModel[] = models || registryModels;
  
  return (
    <div className="space-y-2">
      <Label htmlFor="model">Model</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger id="model">
          <SelectValue placeholder="Select AI model (optional)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {availableModels.map((model: AIModel) => (
            <SelectItem key={model.id} value={model.id}>
              <div className="flex items-center gap-2">
                {getProviderIcon(model.provider)}
                {model.displayName} ({model.provider})
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
