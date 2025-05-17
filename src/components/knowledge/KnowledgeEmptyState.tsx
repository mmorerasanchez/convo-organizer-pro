
import React from 'react';
import { Book, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewKnowledgeDialog from './NewKnowledgeDialog';

interface KnowledgeEmptyStateProps {
  projectId: string;
}

const KnowledgeEmptyState: React.FC<KnowledgeEmptyStateProps> = ({ projectId }) => {
  return (
    <div className="text-center py-16 empty-state rounded-lg border">
      <Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No documentation yet</h3>
      <p className="text-muted-foreground mb-4">
        Start adding documentation and files to this project
      </p>
      <NewKnowledgeDialog projectId={projectId} trigger={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Knowledge
        </Button>
      } />
    </div>
  );
};

export default KnowledgeEmptyState;
