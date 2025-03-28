
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Conversation } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityProps {
  conversations: Conversation[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ conversations }) => {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {conversations.length > 0 ? (
            conversations.slice(0, 5).map((conversation) => (
              <div key={conversation.id} className="flex items-start gap-4">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {conversation.platform.charAt(0)}
                </div>
                <div className="space-y-1">
                  <div className="font-medium">{conversation.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-1">
                    {conversation.content}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(conversation.capturedAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No recent activity found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
