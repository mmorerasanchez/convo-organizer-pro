
import React from 'react';
import KnowledgeList from '@/components/knowledge/KnowledgeList';
import KnowledgeEmptyState from '@/components/knowledge/KnowledgeEmptyState';
import NewKnowledgeDialog from '@/components/knowledge/NewKnowledgeDialog';
import { Knowledge } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectKnowledgeTabProps {
  projectId: string;
  knowledgeItems: Knowledge[];
  isLoading: boolean;
}

const ProjectKnowledgeTab: React.FC<ProjectKnowledgeTabProps> = ({
  projectId,
  knowledgeItems,
  isLoading
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Knowledge & Documentation</h2>
        <NewKnowledgeDialog projectId={projectId} />
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : knowledgeItems.length > 0 ? (
        <KnowledgeList knowledgeItems={knowledgeItems} />
      ) : (
        <KnowledgeEmptyState projectId={projectId} />
      )}
    </div>
  );
};

export default ProjectKnowledgeTab;
