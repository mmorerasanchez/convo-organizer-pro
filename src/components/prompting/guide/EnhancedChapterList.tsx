import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, BookmarkCheck } from 'lucide-react';
import { useGuideProgress } from '@/hooks/useGuideProgress';
import { type Chapter } from './types';
interface EnhancedChapterListProps {
  chapters: Chapter[];
  currentChapter: number;
  onChapterSelect: (index: number) => void;
}
const EnhancedChapterList = ({
  chapters,
  currentChapter,
  onChapterSelect
}: EnhancedChapterListProps) => {
  const {
    getChapterProgress,
    bookmarks
  } = useGuideProgress();
  const getChapterBookmarkCount = (chapterId: string) => {
    return bookmarks.filter(b => b.chapter_id === chapterId).length;
  };
  const slidesLabel = (count: number) => `${count} ${count === 1 ? 'slide' : 'slides'}`;
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {chapters.map((chapter, index) => {
       const chapterId = chapter.id;
       const chapterProgress = getChapterProgress(chapterId, chapter.slides.length);
       const progressPercentage = chapterProgress.total > 0 ? (chapterProgress.completed / chapterProgress.total) * 100 : 0;
       const isActive = currentChapter === index;
       const isCompleted = chapterProgress.total > 0 && chapterProgress.completed === chapterProgress.total;
       const bookmarkCount = getChapterBookmarkCount(chapterId);
      return <Card key={index} className={`cursor-pointer learning-card transition-all duration-200 hover:shadow-md ${isActive ? 'ring-2 ring-primary shadow-md' : 'hover:ring-1 hover:ring-primary/50'}`} onClick={() => onChapterSelect(index)}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      Chapter {index + 1}
                    </Badge>
                    {isCompleted && <CheckCircle className="h-4 w-4 text-success" />}
                    {!isCompleted && chapterProgress.completed > 0 && <Circle className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <CardTitle className="text-xl font-semibold leading-tight">
                    {chapter.title}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {chapter.description}
              </p>
              <div className="space-y-2">
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{chapterProgress.completed}/{chapterProgress.total} {slidesLabel(chapter.slides.length)}</span>
                  {bookmarkCount > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <BookmarkCheck className="h-3 w-3 text-primary" />
                      {bookmarkCount}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>;
    })}
    </div>;
};
export default EnhancedChapterList;