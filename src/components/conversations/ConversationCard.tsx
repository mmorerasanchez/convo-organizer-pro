
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Conversation } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, ArrowRight, ArrowLeft, Monitor } from 'lucide-react';
import StatusIndicator from '@/components/common/StatusIndicator';

interface ConversationCardProps {
  conversation: Conversation;
  linkState?: { fromShared: boolean };
}

const ConversationCard: React.FC<ConversationCardProps> = ({ conversation, linkState }) => {
  const getTypeIcon = (type: 'input' | 'output') => {
    return type === 'output' ? <ArrowLeft size={12} /> : <ArrowRight size={12} />;
  };

  const getTypeLabel = (type: 'input' | 'output') => {
    return type === 'output' ? 'Output' : 'Input';
  };

  return (
    <Link to={`/conversations/${conversation.id}`} state={linkState}>
      <Card className="h-full conversations-card hover:shadow-md transition-all duration-200 border-muted/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-xl font-semibold truncate leading-tight flex-1 min-w-0">
              {conversation.title}
            </CardTitle>
            <div className="flex items-center gap-2 flex-shrink-0">
              <StatusIndicator status={conversation.status || 'active'} />
            </div>
          </div>
          {conversation.content && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {conversation.content}
            </p>
          )}
        </CardHeader>
        <CardFooter className="bg-muted/10 border-t px-5 py-3 flex flex-col items-start gap-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {getTypeIcon(conversation.type)}
              <span>{getTypeLabel(conversation.type)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Monitor size={12} />
              <span>{conversation.platform}</span>
            </div>
          </div>
          <div>
            Updated {formatDistanceToNow(new Date(conversation.capturedAt), { addSuffix: true })}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ConversationCard;
