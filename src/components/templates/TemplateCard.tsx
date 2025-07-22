
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Template } from '@/lib/types';
import { Eye, Users, Lock, FileText, Thermometer, Hash } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import StatusIndicator from '@/components/common/StatusIndicator';
import { useFrameworks } from '@/hooks/use-frameworks';

interface TemplateCardProps {
  template: Template;
  onEdit?: (template: Template) => void;
  onUse?: (template: Template) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onEdit,
  onUse
}) => {
  const { data: frameworks = [] } = useFrameworks();

  const getVisibilityIcon = () => {
    switch (template.visibility) {
      case 'public':
        return <Eye size={12} />;
      case 'shared':
        return <Users size={12} />;
      default:
        return <Lock size={12} />;
    }
  };

  const getVisibilityLabel = () => {
    return template.visibility.charAt(0).toUpperCase() + template.visibility.slice(1);
  };

  const framework = frameworks.find(f => f.id === template.framework_id);

  return (
    <Card className="h-full hover:shadow-md transition-all duration-200 border-muted/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-xl font-semibold truncate leading-tight flex-1 min-w-0">
            {template.name}
          </CardTitle>
          <div className="flex items-center gap-2 flex-shrink-0">
            <StatusIndicator status={template.tag} />
          </div>
        </div>
        {template.description && (
          <CardDescription className="line-clamp-2 mt-1">
            {template.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardFooter className="bg-muted/10 border-t px-5 py-3 flex flex-col items-start gap-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <FileText size={12} />
            <span>{template.usage_count} uses</span>
          </div>
          <div className="flex items-center gap-1">
            {getVisibilityIcon()}
            <span>{getVisibilityLabel()}</span>
          </div>
          {framework && (
            <div className="flex items-center gap-1">
              <Hash size={12} />
              <span>{framework.name}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Thermometer size={12} />
            <span>Temp: {template.temperature}</span>
          </div>
          <span>Tokens: {template.max_tokens}</span>
          {template.effectiveness_score && (
            <span>Score: {template.effectiveness_score}/5</span>
          )}
        </div>
        <div>
          Updated {formatDistanceToNow(new Date(template.updated_at), { addSuffix: true })}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
