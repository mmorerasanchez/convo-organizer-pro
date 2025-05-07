
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
      <TabsList className="mb-5 h-9 p-1 bg-muted/50">
        <TabsTrigger value="conversations" className="h-7 px-3 text-sm flex items-center gap-1.5">
          <MessageCircle className="h-4 w-4" />
          <span>Conversations</span>
          <span className="ml-1 text-xs bg-muted/80 px-1.5 py-0.5 rounded-full">
            {conversations.length}
          </span>
        </TabsTrigger>
        <TabsTrigger value="knowledge" className="h-7 px-3 text-sm flex items-center gap-1.5">
          <Book className="h-4 w-4" />
          <span>Knowledge</span>
          <span className="ml-1 text-xs bg-muted/80 px-1.5 py-0.5 rounded-full">
            {knowledgeItems.length}
          </span>
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
