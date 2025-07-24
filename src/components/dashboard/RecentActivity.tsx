
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Conversation } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityProps {
  conversations: Conversation[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ conversations }) => {
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
          <Link to="/prompting">
            <Button variant="ghost" size="sm" className="text-primary h-8 text-sm">
              Create a Prompt
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {conversations.length > 0 ? (
            conversations.slice(0, 5).map((conversation) => (
              <div key={conversation.id} className="flex items-start gap-3 p-3">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {conversation.platform.charAt(0)}
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="font-medium text-sm truncate">{conversation.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {conversation.content}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(conversation.capturedAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground text-sm">
              No recent activity found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
