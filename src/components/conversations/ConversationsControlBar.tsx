
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tag } from '@/lib/types';
import NewConversationDialog from './NewConversationDialog';

interface ConversationsControlBarProps {
  tags: Tag[];
  selectedTags: Tag[];
  onTagSelect: (tag: Tag) => void;
  clearFilters: () => void;
  searchTerm: string;
}

const ConversationsControlBar: React.FC<ConversationsControlBarProps> = ({
  tags,
  selectedTags,
  onTagSelect,
  clearFilters,
  searchTerm
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        {/* Tag filters */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => onTagSelect(tag)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedTags.some(t => t.id === tag.id)
                  ? tag.color + ' ring-2 ring-primary/30'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {tag.name}
            </button>
          ))}
          
          {(searchTerm || selectedTags.length > 0) && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary hover:bg-secondary/80"
            >
              <X size={12} className="mr-1" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* New Conversation Button */}
        <NewConversationDialog />
        {(searchTerm || selectedTags.length > 0) && (
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default ConversationsControlBar;
