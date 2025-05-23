
import React from 'react';
import { Plus, CodeSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewToolDialog from '@/components/tools/NewToolDialog';

interface ToolsEmptyStateProps {
  searchTerm: string;
  resetFilters: () => void;
}

const ToolsEmptyState: React.FC<ToolsEmptyStateProps> = ({ searchTerm, resetFilters }) => {
  if (searchTerm) {
    return (
      <div className="text-center py-12 empty-state rounded-lg border bg-muted/20">
        <CodeSquare className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium mb-2">No tools found</h3>
        <p className="text-muted-foreground mb-4">
          No tools match your search criteria
        </p>
        <Button onClick={resetFilters}>
          Clear Search
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-12 empty-state rounded-lg border bg-muted/20">
      <CodeSquare className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
      <h3 className="text-lg font-medium mb-2">No tools yet</h3>
      <p className="text-muted-foreground mb-4">
        Start adding tools to your collection
      </p>
      <NewToolDialog trigger={
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Tool
        </Button>
      } />
    </div>
  );
};

export default ToolsEmptyState;
