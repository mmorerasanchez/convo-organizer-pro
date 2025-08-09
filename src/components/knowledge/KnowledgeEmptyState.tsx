import React from 'react';
import { Book, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewKnowledgeDialog from './NewKnowledgeDialog';
interface KnowledgeEmptyStateProps {
  projectId: string;
}
const KnowledgeEmptyState: React.FC<KnowledgeEmptyStateProps> = ({
  projectId
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg bg-muted/20">
      <p className="text-muted-foreground text-center">
        No knowledge base items yet. Add documents, notes, or other content to help improve AI responses for this project.
      </p>
    </div>
  );
};
export default KnowledgeEmptyState;