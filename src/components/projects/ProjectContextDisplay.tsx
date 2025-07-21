
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
        <CardHeader className="text-center py-8">
          <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <CardTitle className="text-lg">AI Context Learning</CardTitle>
          <CardDescription>
            This project hasn't been analyzed yet. Use the "Generate Context" button above to start learning from your conversations and documents.
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg">Project Intelligence</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                {context?.updated_at && (
                  <>
                    <Clock className="h-3 w-3" />
                    Last updated {formatDistanceToNow(new Date(context.updated_at), { addSuffix: true })}
                  </>
                )}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {context?.learning_metadata?.content_analyzed && (
              <Badge variant={getContextQualityColor(context.project_id ? 75 : undefined)}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {getContextQualityLabel(75)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {context?.context_summary && (
          <div>
            <h4 className="font-medium mb-2">Project Summary</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {context.context_summary}
            </p>
          </div>
        )}

        {context?.key_themes && context.key_themes.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Key Themes</h4>
            <div className="flex flex-wrap gap-2">
              {context.key_themes.slice(0, isExpanded ? undefined : 6).map((theme, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {theme}
                </Badge>
              ))}
              {context.key_themes.length > 6 && (
                <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                  <CollapsibleTrigger asChild>
                    <Badge variant="outline" className="text-xs cursor-pointer">
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-3 w-3 mr-1" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3 mr-1" />
                          +{context.key_themes.length - 6} more
                        </>
                      )}
                    </Badge>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="flex flex-wrap gap-2 mt-2">
                    {context.key_themes.slice(6).map((theme, index) => (
                      <Badge key={index + 6} variant="secondary" className="text-xs">
                        {theme}
                      </Badge>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}
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
    </Card>
  );
}
