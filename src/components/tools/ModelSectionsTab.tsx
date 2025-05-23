
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LLMModel } from '@/lib/types';
import { MessageSquare } from 'lucide-react';

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
  const isAvailable = model.status === 'available';
  
  return (
    <Card className="overflow-hidden border border-border h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{model.name}</CardTitle>
          </div>
          <Badge 
            variant={isAvailable ? 'default' : 'secondary'} 
            className="capitalize"
          >
            {isAvailable ? 'Available' : 'Coming Soon'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        <p className="text-sm text-muted-foreground mb-4">{model.description}</p>
        <div className="flex flex-wrap gap-1">
          {model.capabilities.map((capability, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {capability}
            </Badge>
          ))}
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          Context: {model.contextWindow.toLocaleString()} tokens
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 py-2 px-6">
        <div className="flex justify-end w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            disabled={!isAvailable}
            className={!isAvailable ? "opacity-50" : ""}
          >
            Use
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ModelSectionsTab;
