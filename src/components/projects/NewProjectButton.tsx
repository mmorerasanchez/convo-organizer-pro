
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import NewProjectDialog from './NewProjectDialog';

const NewProjectButton: React.FC = () => {
  return (
    <NewProjectDialog 
      variant="card"
      trigger={
        <Card className="h-full cursor-pointer hover:bg-secondary/50 transition-colors border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-full py-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Plus size={24} />
            </div>
            <div className="font-medium">Create New Project</div>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Start organizing your AI conversations
            </p>
          </CardContent>
        </Card>
      }
    />
  );
};

export default NewProjectButton;
