
import React from 'react';
import JoinProjectDialog from '@/components/projects/JoinProjectDialog';

interface SharedProjectsEmptyStateProps {
  searchTerm: string;
}

const SharedProjectsEmptyState: React.FC<SharedProjectsEmptyStateProps> = ({ searchTerm }) => {
  return (
    <div className="text-center py-10 border rounded-lg bg-muted/20">
      {searchTerm ? (
        <p className="text-muted-foreground">
          No shared projects match your search
        </p>
      ) : (
        <p className="text-muted-foreground">
          No projects have been shared with you yet. Use the "Join a Project" button to access a shared project.
        </p>
      )}
    </div>
  );
};

export default SharedProjectsEmptyState;
