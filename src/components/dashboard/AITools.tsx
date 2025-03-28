
import React from 'react';
import { Brain, Bot, MessageSquareCode, Cpu } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface AITool {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof aiToolIcons;
  type: 'model' | 'prompt' | 'function' | 'integration';
  status: 'active' | 'inactive' | 'pending';
  lastUsed?: string;
}

// Map of icon names to their components
const aiToolIcons = {
  Brain,
  Bot,
  MessageSquareCode,
  Cpu
};

interface AIToolsProps {
  tools?: AITool[];
}

const AITools: React.FC<AIToolsProps> = ({ tools = defaultTools }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center">
        <h2 className="text-2xl font-semibold">AI Tools</h2>
        <Button className="flex items-center gap-2">
          <Brain size={16} />
          Add New Tool
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => {
          const IconComponent = aiToolIcons[tool.icon];
          return (
            <Card key={tool.id} className="overflow-hidden border border-border">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                  </div>
                  <Badge 
                    variant={
                      tool.status === 'active' 
                        ? 'default' 
                        : tool.status === 'inactive' 
                          ? 'secondary' 
                          : 'outline'
                    }
                    className="capitalize"
                  >
                    {tool.status}
                  </Badge>
                </div>
                <CardDescription className="mt-2">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {tool.type}
                  </Badge>
                  {tool.lastUsed && (
                    <span className="text-xs text-muted-foreground">
                      Last used: {tool.lastUsed}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 py-2 px-6">
                <div className="flex justify-between w-full">
                  <Button variant="ghost" size="sm">Configure</Button>
                  <Button variant="ghost" size="sm">Use</Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// Default tools for demonstration
const defaultTools: AITool[] = [
  {
    id: '1',
    name: 'GPT-4o',
    description: 'Advanced language model for text generation and conversation',
    icon: 'Brain',
    type: 'model',
    status: 'active',
    lastUsed: '2 hours ago'
  },
  {
    id: '2',
    name: 'Content Extractor',
    description: 'Extracts structured data from unstructured text',
    icon: 'MessageSquareCode',
    type: 'function',
    status: 'active',
    lastUsed: 'Yesterday'
  },
  {
    id: '3',
    name: 'Prompt Builder',
    description: 'Tool for creating and testing prompt templates',
    icon: 'Bot',
    type: 'prompt',
    status: 'inactive'
  },
  {
    id: '4',
    name: 'Claude 3 Opus',
    description: 'High-capability AI assistant with excellent reasoning',
    icon: 'Brain',
    type: 'model',
    status: 'active',
    lastUsed: '3 days ago'
  },
  {
    id: '5',
    name: 'API Connector',
    description: 'Connect to external AI services and APIs',
    icon: 'Cpu',
    type: 'integration',
    status: 'pending'
  },
  {
    id: '6',
    name: 'Conversation Analyzer',
    description: 'Extract insights and patterns from conversation history',
    icon: 'MessageSquareCode',
    type: 'function',
    status: 'active',
    lastUsed: '1 week ago'
  }
];

export default AITools;
