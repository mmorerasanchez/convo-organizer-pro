
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ConversationDetail from '@/components/conversations/ConversationDetail';
import { getConversationById, getProjectById } from '@/lib/mockData';
import { Button } from '@/components/ui/button';

const ConversationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  
  const conversation = getConversationById(id || '');
  const project = conversation ? getProjectById(conversation.projectId) : undefined;
  
  if (!conversation) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Conversation not found</h1>
          <Link to="/conversations">
            <Button>Back to Conversations</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ConversationDetail conversation={conversation} project={project} />
    </MainLayout>
  );
};

export default ConversationDetailPage;
