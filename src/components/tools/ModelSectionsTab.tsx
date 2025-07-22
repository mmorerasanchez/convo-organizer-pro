import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LLMModel } from '@/lib/types';
import { MessageSquare, CheckCircle, Zap, Monitor, Building, Clock, Play } from 'lucide-react';

// Model data organized by provider
const models: LLMModel[] = [
  // OpenAI Models (marked as available)
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    description: 'Most capable multimodal model for text, vision, and reasoning tasks',
    contextWindow: 128000,
    status: 'available',
    capabilities: ['text generation', 'reasoning', 'vision', 'code', 'creative writing'],
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    description: 'Efficient, cost-effective multimodal model with vision capabilities',
    contextWindow: 128000,
    status: 'available',
    capabilities: ['text generation', 'vision', 'code'],
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    description: 'High-capability model with improved reasoning and expanded knowledge',
    contextWindow: 128000,
    status: 'available',
    capabilities: ['text generation', 'reasoning', 'code'],
  },
  
  // Google Models (marked as coming soon)
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'google',
    description: 'Google\'s advanced model optimized for complex tasks and reasoning',
    contextWindow: 32000,
    status: 'coming-soon',
    capabilities: ['text generation', 'reasoning', 'code'],
  },
  {
    id: 'gemini-flash',
    name: 'Gemini Flash',
    provider: 'google',
    description: 'Google\'s fastest model for efficient text and code generation',
    contextWindow: 32000,
    status: 'coming-soon',
    capabilities: ['text generation', 'code'],
  },
  
  // Anthropic Models (marked as coming soon)
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    description: 'Anthropic\'s most powerful model with exceptional reasoning capabilities',
    contextWindow: 200000,
    status: 'coming-soon',
    capabilities: ['text generation', 'reasoning', 'analysis'],
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'anthropic',
    description: 'Balanced performance and cost with high-quality outputs',
    contextWindow: 200000,
    status: 'coming-soon',
    capabilities: ['text generation', 'reasoning', 'analysis'],
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    description: 'Anthropic\'s fast and cost-effective model for simpler tasks',
    contextWindow: 200000,
    status: 'coming-soon',
    capabilities: ['text generation', 'analysis'],
  }
];

const ModelSectionsTab: React.FC = () => {
  // Group models by provider
  const openaiModels = models.filter(model => model.provider === 'openai');
  const googleModels = models.filter(model => model.provider === 'google');
  const anthropicModels = models.filter(model => model.provider === 'anthropic');

  return (
    <div className="space-y-8">
      {/* OpenAI Models Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="mr-2">OpenAI Models</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {openaiModels.map(model => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </section>

      {/* Google Models Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Google Models</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {googleModels.map(model => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </section>

      {/* Anthropic Models Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Anthropic Models</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {anthropicModels.map(model => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      </section>
    </div>
  );
};

interface ModelCardProps {
  model: LLMModel;
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  const [isHovering, setIsHovering] = useState(false);
  const isAvailable = model.status === 'available';
  
  const getPricingLabel = () => {
    if (!model.pricing) return 'Standard';
    return model.pricing.charAt(0).toUpperCase() + model.pricing.slice(1);
  };

  return (
    <Card 
      className="overflow-hidden border border-border h-full flex flex-col hover:shadow-md transition-all duration-200 relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{model.name}</CardTitle>
          </div>
          <Badge 
            variant={isAvailable ? 'available' : 'secondary'} 
            className="capitalize"
          >
            {isAvailable ? 'Available' : 'Coming Soon'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{model.description}</p>
      </CardHeader>
      
      <CardContent className="pb-4 flex-grow">
        <div className="flex flex-wrap gap-1">
          {model.capabilities.map((capability, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {capability}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="border-t bg-muted/10 py-3 px-5 flex flex-col items-start gap-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>{isAvailable ? 'Available' : 'Coming Soon'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            <span>{getPricingLabel()} cost</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Monitor className="h-3 w-3" />
          <span>Context: {model.contextWindow.toLocaleString()} tokens</span>
        </div>
        <div className="flex items-center gap-1">
          <Building className="h-3 w-3" />
          <span>Provider: {model.provider}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Last used: {model.lastUsed || 'Never'}</span>
        </div>
      </CardFooter>

      {/* Hover Actions Overlay */}
      {isHovering && isAvailable && (
        <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-md p-1 shadow-sm border">
          <Button 
            variant="ghost" 
            size="sm"
            className="h-7 px-2 gap-1"
          >
            <Play className="h-3.5 w-3.5" />
            Use
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ModelSectionsTab;
