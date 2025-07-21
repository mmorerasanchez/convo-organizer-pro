import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Bookmark,
  BookmarkCheck,
  Clock
} from 'lucide-react';
import { useGuideProgress } from '@/hooks/useGuideProgress';

interface EnhancedSlideContentProps {
  chapterIndex: number;
  totalChapters: number;
  slideIndex: number;
  totalSlides: number;
  chapterSlidesCount: number;
  chapterId: string;
  slideId: string;
  title: string;
  content: string;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
}

const EnhancedSlideContent = ({
  chapterIndex,
  totalChapters,
  slideIndex,
  totalSlides,
  chapterSlidesCount,
  chapterId,
  slideId,
  title,
  content,
  onPrevSlide,
  onNextSlide,
  onPrevChapter,
  onNextChapter,
}: EnhancedSlideContentProps) => {
  const {
    updateSlideProgress,
    toggleBookmark,
    isSlideCompleted,
    isSlideBookmarked,
    getChapterProgress,
    getTotalProgress
  } = useGuideProgress();

  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isCompleted, setIsCompleted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    setStartTime(Date.now());
    setIsCompleted(isSlideCompleted(chapterId, slideId));
    setIsBookmarked(isSlideBookmarked(chapterId, slideId));
  }, [chapterId, slideId, isSlideCompleted, isSlideBookmarked]);

  const handleCompletionChange = async (completed: boolean) => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    await updateSlideProgress(chapterId, slideId, completed, timeSpent);
    setIsCompleted(completed);
  };

  const handleBookmarkToggle = async () => {
    await toggleBookmark(chapterId, slideId);
    setIsBookmarked(!isBookmarked);
  };

  const chapterProgress = getChapterProgress(chapterId, chapterSlidesCount);
  const totalProgress = getTotalProgress(totalSlides);
  const chapterProgressPercentage = (chapterProgress.completed / chapterProgress.total) * 100;
  const totalProgressPercentage = (totalProgress.completed / totalProgress.total) * 100;

  // Function to render markdown-like content
  const renderContent = (text: string) => {
    const lines = text.trim().split('\n');
    
    return (
      <div className="space-y-4">
        {lines.map((line, index) => {
          const trimmedLine = line.trim();
          
          if (trimmedLine.startsWith('## ')) {
            return (
              <h3 key={index} className="text-lg font-semibold mt-6 first:mt-0 text-foreground">
                {trimmedLine.substring(3)}
              </h3>
            );
          }
          
          if (trimmedLine.startsWith('- ')) {
            return (
              <div key={index} className="flex space-x-2 ml-4">
                <span className="text-muted-foreground mt-1">•</span>
                <span className="text-muted-foreground">{trimmedLine.substring(2)}</span>
              </div>
            );
          }
          
          if (trimmedLine.includes('**')) {
            const parts = trimmedLine.split(/\*\*(.*?)\*\*/g);
            return (
              <p key={index} className={`text-muted-foreground ${trimmedLine === '' ? 'my-2' : ''}`}>
                {parts.map((part, i) => (
                  i % 2 === 0 ? part : <strong key={i} className="text-foreground font-medium">{part}</strong>
                ))}
              </p>
            );
          }
          
          if (trimmedLine !== '') {
            return <p key={index} className="text-muted-foreground leading-relaxed">{trimmedLine}</p>;
          }
          
          return <div key={index} className="h-2"></div>;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Progress Bars */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
            <span>Overall Progress</span>
            <span>{totalProgress.completed} of {totalProgress.total} slides</span>
          </div>
          <Progress value={totalProgressPercentage} className="h-2" />
        </div>
        
        <div>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
            <span>Chapter {chapterIndex + 1} Progress</span>
            <span>{chapterProgress.completed} of {chapterProgress.total} slides</span>
          </div>
          <Progress value={chapterProgressPercentage} className="h-2" />
        </div>
      </div>

      {/* Main Slide Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-sm text-muted-foreground mb-1">
                Chapter {chapterIndex + 1} · Slide {slideIndex + 1} of {chapterSlidesCount}
              </div>
              <CardTitle className="text-xl">{title}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmarkToggle}
                className="shrink-0"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-4 w-4 text-primary" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="prose max-w-none">
            {renderContent(content)}
          </div>

          {/* Completion Checkbox */}
          <div className="flex items-center space-x-2 pt-4 border-t">
            <Checkbox
              id={`slide-${slideId}`}
              checked={isCompleted}
              onCheckedChange={handleCompletionChange}
            />
            <label
              htmlFor={`slide-${slideId}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Mark as completed
            </label>
            {isCompleted && (
              <div className="flex items-center text-xs text-muted-foreground ml-2">
                <Clock className="h-3 w-3 mr-1" />
                Completed
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onPrevChapter}
              disabled={chapterIndex === 0}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onPrevSlide}
              disabled={chapterIndex === 0 && slideIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onNextSlide}
              disabled={chapterIndex === totalChapters - 1 && slideIndex === chapterSlidesCount - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={onNextChapter}
              disabled={chapterIndex === totalChapters - 1}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EnhancedSlideContent;