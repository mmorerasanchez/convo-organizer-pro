
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Conversation, Project } from '@/lib/types';
import { format } from 'date-fns';
import TagList from './TagList';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import EditConversationDialog from './EditConversationDialog';
import DeleteDialog from '../common/DeleteDialog';

interface ConversationDetailProps {
  conversation: Conversation;
  project?: Project;
}

const ConversationDetail: React.FC<ConversationDetailProps> = ({ conversation, project }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/conversations">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{conversation.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <EditConversationDialog conversation={conversation} />
          <DeleteDialog 
            itemType="conversation" 
            itemName={conversation.title}
            redirectPath="/conversations"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 items-center">
        <span className="inline-block px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
          {conversation.platform}
        </span>
        
        {project && (
          <Link to={`/projects/${project.id}`}>
            <span className="inline-block px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
              {project.name}
            </span>
          </Link>
        )}
        
        <span className="text-sm text-muted-foreground">
          Captured on {format(new Date(conversation.capturedAt), 'PPP')}
        </span>
      </div>
      
      <TagList tags={conversation.tags} />
      
      <Card>
        <CardHeader>
          <CardTitle>Conversation Content</CardTitle>
          <CardDescription>
            AI conversation captured from {conversation.platform}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap text-sm">
            {conversation.content}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversationDetail;
