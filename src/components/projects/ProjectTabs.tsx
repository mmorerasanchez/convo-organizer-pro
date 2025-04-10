
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MessageCircle, Book } from 'lucide-react';
import ProjectConversationsTab from './ProjectConversationsTab';
import ProjectKnowledgeTab from './ProjectKnowledgeTab';
import { Conversation, Knowledge } from '@/lib/types';

interface ProjectTabsProps {
  projectId: string;
  conversations: Conversation[];
  knowledgeItems: Knowledge[];
  isLoadingConversations: boolean;
  isLoadingKnowledge: boolean;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({
  projectId,
  conversations,
  knowledgeItems,
  isLoadingConversations,
  isLoadingKnowledge,
  activeTab,
  setActiveTab
}) => {
  return (
    <Tabs 
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="mb-4">
        <TabsTrigger value="conversations" className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          <span>Conversations</span>
        </TabsTrigger>
        <TabsTrigger value="knowledge" className="flex items-center gap-1">
          <Book className="h-4 w-4" />
          <span>Knowledge</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="conversations">
        <ProjectConversationsTab 
          projectId={projectId}
          conversations={conversations}
          isLoading={isLoadingConversations}
        />
      </TabsContent>
      
      <TabsContent value="knowledge">
        <ProjectKnowledgeTab 
          projectId={projectId}
          knowledgeItems={knowledgeItems}
          isLoading={isLoadingKnowledge}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProjectTabs;
