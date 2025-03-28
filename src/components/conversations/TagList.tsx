
import React from 'react';
import { Tag } from '@/lib/types';

interface TagListProps {
  tags: Tag[];
}

const TagList: React.FC<TagListProps> = ({ tags }) => {
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <span 
          key={tag.id} 
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium tag ${tag.color}`}
        >
          {tag.name}
        </span>
      ))}
    </div>
  );
};

export default TagList;
