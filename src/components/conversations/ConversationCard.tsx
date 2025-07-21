
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Conversation } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import TagList from './TagList';

interface ConversationCardProps {
  conversation: Conversation;
  linkState?: { fromShared: boolean };
}

const ConversationCard: React.FC<ConversationCardProps> = ({ conversation, linkState }) => {
  return (
    <Link to={`/conversations/${conversation.id}`} state={linkState}>
      <Card className="h-full">
        <CardContent>
          <div className="mb-2">
            <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
              {conversation.platform}
            </span>
          </div>
          <h3 className="mb-2 font-semibold leading-tight line-clamp-1">{conversation.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {conversation.content}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2">
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
