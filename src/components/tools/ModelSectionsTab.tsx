import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, CheckCircle, Zap, Monitor, Building, Clock, Play } from 'lucide-react';
import { useModelsRegistry } from '@/hooks/useModelsRegistry';

const ModelSectionsTab: React.FC = () => {
  const { byProvider, status, isLoading } = useModelsRegistry();

  const renderSection = (providerId: string, title: string) => {
    const models = byProvider[providerId] || [];
    const availableModels = models.filter((m: any) => m.available);
    const count = availableModels.length;
    if (count === 0) {
      if (providerId === 'openrouter' && status?.openrouter) {
        return (
          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">{title} (0)</span>
            </h2>
            <div className="text-sm text-muted-foreground">OpenRouter is connected. The catalog will populate shortly.</div>
          </section>
        );
      }
      return null;
    }
    return (
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="mr-2">{title} ({count})</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {availableModels.map((model) => (
            <ModelCard key={model.id} model={{
              id: model.id,
              title: model.displayName,
              provider: model.provider,
              description: model.description,
              contextWindow: model.contextWindow || 0,
              available: (model as any).available,
            }} />
          ))}
        </div>
      </section>
    );
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading models…</div>;
  }

  return (
    <div className="space-y-8">
      {renderSection('openai', 'OpenAI Models')}
      {renderSection('google', 'Google Models')}
      {renderSection('anthropic', 'Anthropic Models')}
      {renderSection('openrouter', 'OpenRouter Catalog')}
    </div>
  );
};

interface ModelCardProps {
  model: {
    id: string;
    title?: string;
    provider: string;
    description?: string;
    contextWindow: number;
    available?: boolean;
  };
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  const [isHovering, setIsHovering] = useState(false);
  const isAvailable = Boolean(model.available);
  
  return (
    <Card 
      className={`overflow-hidden border border-border h-full flex flex-col hover:shadow-md transition-all duration-200 relative ${!isAvailable ? 'opacity-70' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{model.title}</CardTitle>
          </div>
          <Badge 
            variant={isAvailable ? 'available' : 'secondary'} 
            className="capitalize"
          >
            {isAvailable ? 'Available' : 'Not configured'}
          </Badge>
        </div>
        {model.description && (
          <p className="text-sm text-muted-foreground mt-1">{model.description}</p>
        )}
      </CardHeader>
      
      <CardContent className="pb-4 flex-grow">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            <span>Provider: {model.provider}</span>
          </div>
          <div className="flex items-center gap-1">
            <Monitor className="h-3 w-3" />
            <span>Context: {model.contextWindow.toLocaleString()} tokens</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t bg-muted/10 py-3 px-5 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-3 w-3" />
          <span>{isAvailable ? 'Ready to use' : 'Add API key to enable'}</span>
        </div>
        {isHovering && isAvailable && (
          <Button 
            variant="ghost" 
            size="sm"
            className="h-7 px-2 gap-1"
          >
            <Play className="h-3.5 w-3.5" />
            Use
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ModelSectionsTab;

