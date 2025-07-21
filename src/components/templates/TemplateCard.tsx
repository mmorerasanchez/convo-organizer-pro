import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Template } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { FileCode, Users, TrendingUp } from 'lucide-react';

interface TemplateCardProps {
  template: Template;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const getTagColor = (tag: string) => {
    const colors = {
      'Research': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Content Creation': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Analysis': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Customer Support': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Development': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Custom': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };
    return colors[tag as keyof typeof colors] || colors.Custom;
  };

  return (
    <Card className="h-full hover:shadow-md transition-all duration-200 border-muted/60 cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="bg-primary/10 rounded-md p-2 flex-shrink-0">
            <FileCode className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium truncate text-sm">{template.name}</h3>
              {template.visibility !== 'private' && (
                <Users size={16} className="text-primary flex-shrink-0 ml-2" aria-label="Shared Template" />
              )}
            </div>
            <Badge variant="secondary" className={`text-xs ${getTagColor(template.tag)}`}>
              {template.tag}
            </Badge>
            {template.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                {template.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/10 border-t px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <TrendingUp size={12} />
            <span>Used {template.usage_count}</span>
          </div>
          {template.effectiveness_score && (
            <span className="text-green-600 dark:text-green-400">
              {Math.round(template.effectiveness_score * 100)}% effective
            </span>
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