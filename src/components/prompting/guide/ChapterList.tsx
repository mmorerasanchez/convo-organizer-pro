
import React from 'react';
import Chapter from './Chapter';
import { type Chapter as ChapterType } from './types';

interface ChapterListProps {
  chapters: ChapterType[];
  currentChapter: number;
  onChapterSelect: (index: number) => void;
}

const ChapterList = ({ chapters, currentChapter, onChapterSelect }: ChapterListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {chapters.map((chapter, index) => (
        <Chapter
          key={index}
          title={chapter.title}
          description={chapter.description}
          isActive={currentChapter === index}
          onClick={() => onChapterSelect(index)}
        />
      ))}
    </div>
  );
};

export default ChapterList;

