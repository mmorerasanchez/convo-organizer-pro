
import React from 'react';
import JoinProjectDialog from '@/components/projects/JoinProjectDialog';

interface SharedProjectsEmptyStateProps {
  searchTerm: string;
}

const SharedProjectsEmptyState: React.FC<SharedProjectsEmptyStateProps> = ({ searchTerm }) => {
  return (
    <div className="text-center py-10 border rounded-lg bg-muted/20 flex flex-col items-center space-y-4">
      {searchTerm ? (
        <p className="text-muted-foreground">
          No shared projects match your search
        </p>
      ) : (
        <>
          <p className="text-muted-foreground mb-2">
            No projects have been shared with you yet.
          </p>
          <div className="max-w-xs w-full">
            <JoinProjectDialog variant="card" />
          </div>
        </>
      )}
    </div>
  );
};

export default SharedProjectsEmptyState;
