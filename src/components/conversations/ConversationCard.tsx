
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Conversation } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import TagList from './TagList';

interface ConversationCardProps {
  conversation: Conversation;
  linkState?: { fromShared: boolean };
}

const getSourceColorClass = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'gemini':
      return 'text-primary';
    case 'chatgpt':
      return 'text-primary';
    case 'claude':
      return 'text-chart-2';
    default:
      return 'text-chart-3';
  }
};

const ConversationCard: React.FC<ConversationCardProps> = ({ conversation, linkState }) => {
  return (
    <Link to={`/conversations/${conversation.id}`} state={linkState}>
      <Card className="h-full conversations-card hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-2">
          <div className={`text-sm font-medium ${getSourceColorClass(conversation.platform)}`}>
            {conversation.platform}
          </div>
          <CardTitle className="text-xl font-semibold leading-tight line-clamp-1">
            {conversation.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {conversation.content}
          </p>
        </CardHeader>
        <CardFooter className="flex flex-col items-start gap-2 pt-3">
          <TagList tags={conversation.tags} />
          <div className="text-xs text-muted-foreground w-full text-right">
            Captured {formatDistanceToNow(new Date(conversation.capturedAt), { addSuffix: true })}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ConversationCard;
