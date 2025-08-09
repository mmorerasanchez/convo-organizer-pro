
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain } from 'lucide-react';
import { AIModel } from '@/lib/types';
import { getModelRecommendations } from '@/lib/modelData';
import { OpenAILogo } from '@/components/ui/logos/OpenAILogo';
import { GoogleLogo } from '@/components/ui/logos/GoogleLogo';
import { useModelsRegistry } from '@/hooks/useModelsRegistry';

interface EnhancedModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  showRecommendations?: boolean;
  className?: string;
}

const getProviderIcon = (provider: string, size = 16) => {
  switch (provider) {
    case 'openai':
      return <OpenAILogo size={size} />;
    case 'google':
      return <GoogleLogo size={size} />;
    default:
      return <Brain className="h-4 w-4" />;
  }
};

export const EnhancedModelSelector: React.FC<EnhancedModelSelectorProps> = ({ 
  value, 
  onChange, 
  showRecommendations = true,
  className 
}) => {
  const { models: registryModels } = useModelsRegistry();
  const selectedModel = (registryModels as AIModel[]).find(m => m.id === value);
  const recommendations = selectedModel ? getModelRecommendations(selectedModel.id) : [];

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="model">AI Model</Label>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id="model" className="w-full">
            <SelectValue placeholder="Select AI model">
              {selectedModel && (
                <div className="flex items-center gap-2">
                  {getProviderIcon(selectedModel.provider)}
                  <span>{selectedModel.displayName}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {(registryModels as AIModel[]).map((model) => (
              <SelectItem key={model.id} value={model.id} className="pl-6">
                <div className="flex items-center justify-between w-full gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {getProviderIcon(model.provider)}
                    <span className="truncate">{model.displayName}</span>
                  </div>
                  {/* Availability badge if present via registry */}
                  {('available' in (model as any)) && (
                    <Badge variant={(model as any).available ? 'available' : 'secondary'} className="shrink-0">
                      {(model as any).available ? 'Available' : 'Not configured'}
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showRecommendations && selectedModel && recommendations.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            {getProviderIcon(selectedModel.provider)}
            Recommendations for {selectedModel.displayName}
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
