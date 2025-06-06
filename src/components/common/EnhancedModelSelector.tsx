
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap } from 'lucide-react';
import { AIModel } from '@/lib/types';
import { modelProviders, comingSoonProviders, getModelRecommendations } from '@/lib/modelData';
import { OpenAILogo } from '@/components/ui/logos/OpenAILogo';
import { GoogleLogo } from '@/components/ui/logos/GoogleLogo';

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
  const selectedModel = modelProviders
    .flatMap(provider => provider.models)
    .find(model => model.id === value);

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
            {/* Available Models */}
            {modelProviders.map((provider) => (
              <div key={provider.id}>
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  {getProviderIcon(provider.id)}
                  {provider.name}
                </div>
                {provider.models.map((model) => (
                  <SelectItem key={model.id} value={model.id} className="pl-6">
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{model.displayName}</span>
                        <Badge variant="outline" className={
                          model.pricing === 'low' ? 'bg-green-50 text-green-700' :
                          model.pricing === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-red-50 text-red-700'
                        }>
                          {model.pricing}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{model.description}</p>
                    </div>
                  </SelectItem>
                ))}
              </div>
            ))}

            {/* Coming Soon Section */}
            <div className="border-t mt-2 pt-2">
              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                Coming Soon
              </div>
              {comingSoonProviders.map((provider) => (
                <div key={provider.id}>
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground/70 flex items-center gap-2">
                    <Zap className="h-3 w-3" />
                    {provider.name}
                  </div>
                  {provider.models.map((model) => (
                    <div key={model.id} className="pl-6 py-2 opacity-50 blur-[1px] cursor-not-allowed">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{model.displayName}</span>
                          <Badge variant="outline" className="text-xs">
                            {model.pricing}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{model.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
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
