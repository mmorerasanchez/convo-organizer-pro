
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { PromptingProjectSelector } from './PromptingProjectSelector';

interface PromptingHeaderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  currentUsage?: number;
  limit?: number;
  onProjectSelect?: (projectId: string) => void;
  selectedProjectId?: string;
}

export function PromptingHeader({
  title,
  description,
  icon,
  currentUsage = 0,
  limit = 10,
  onProjectSelect,
  selectedProjectId
}: PromptingHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle>{title}</CardTitle>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {currentUsage}/{limit} requests
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{description}</p>
        <PromptingProjectSelector 
          onProjectSelect={onProjectSelect}
          selectedProjectId={selectedProjectId}
        />
      </CardContent>
    </Card>
  );
}
