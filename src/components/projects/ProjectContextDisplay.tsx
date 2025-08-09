
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Clock, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { ProjectContext, LearningJob } from '@/lib/api/projectContext';
import { formatDistanceToNow } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ProjectContextDisplayProps {
  projectId: string;
  context: ProjectContext | null;
  lastLearningJob?: LearningJob;
  isLearning?: boolean;
  onUpdateContext?: () => void; // Made optional since we're removing the button
}

export function ProjectContextDisplay({
  projectId,
  context,
  lastLearningJob,
  isLearning = false,
  onUpdateContext
}: ProjectContextDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!context && !isLearning) {
    return (
      <Card className="border-dashed">
        <CardHeader className="py-6">
          <CardTitle className="text-sm font-medium">AI Context Learning</CardTitle>
          <CardDescription className="text-xs">
            No project context available. Use "Generate Context" to analyze conversations and documents.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getContextQualityColor = (score?: number) => {
    if (!score) return 'secondary';
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const getContextQualityLabel = (score?: number) => {
    if (!score) return 'No Score';
    if (score >= 80) return 'Rich Context';
    if (score >= 60) return 'Good Context';
    return 'Basic Context';
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="h-4 w-4 text-primary" />
                <div>
                  <CardTitle className="text-sm font-medium">AI Context Learning</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    {context?.updated_at && (
                      <>
                        <Clock className="h-3 w-3" />
                        Updated {formatDistanceToNow(new Date(context.updated_at), { addSuffix: true })}
                      </>
                    )}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {context?.learning_metadata?.content_analyzed && (
                  <Badge variant={getContextQualityColor(context.project_id ? 75 : undefined)} className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {getContextQualityLabel(75)}
                  </Badge>
                )}
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            {context?.context_summary && (
              <div>
                <h4 className="font-medium mb-2 text-sm">Project Summary</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {context.context_summary}
                </p>
              </div>
            )}

            {context?.key_themes && context.key_themes.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 text-sm">Key Themes</h4>
                <div className="flex flex-wrap gap-2">
                  {context.key_themes.map((theme, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {context?.learning_metadata?.content_analyzed && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                <span>
                  {context.learning_metadata.content_analyzed.conversations} conversations
                </span>
                <span>•</span>
                <span>
                  {context.learning_metadata.content_analyzed.knowledge} documents
                </span>
                <span>•</span>
                <span>
                  {context.learning_metadata.content_analyzed.prompts} prompts
                </span>
              </div>
            )}

            {lastLearningJob?.status === 'failed' && (
              <div className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                Last context update failed. Try updating again using the "Generate Context" button.
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
