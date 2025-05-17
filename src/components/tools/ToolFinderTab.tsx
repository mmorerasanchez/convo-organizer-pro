
import React from 'react';
import { Search } from 'lucide-react';

const ToolFinderTab: React.FC = () => {
  return (
    <div className="text-center py-12 rounded-lg border bg-muted/20">
      <Search className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
      <h3 className="text-lg font-medium mb-2">Tool Finder</h3>
      <p className="text-muted-foreground mb-4">
        Coming soon in a future update
      </p>
    </div>
  );
};

export default ToolFinderTab;
