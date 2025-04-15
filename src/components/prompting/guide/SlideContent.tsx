
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface SlideContentProps {
  chapterIndex: number;
  totalChapters: number;
  slideIndex: number;
  totalSlides: number;
  title: string;
  content: React.ReactNode;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
}

const SlideContent = ({
  chapterIndex,
  totalChapters,
  slideIndex,
  totalSlides,
  title,
  content,
  onPrevSlide,
  onNextSlide,
  onPrevChapter,
  onNextChapter,
}: SlideContentProps) => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">
              Chapter {chapterIndex + 1} · Slide {slideIndex + 1} of {totalSlides}
            </div>
            <CardTitle className="mt-1">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>{content}</CardContent>
      <CardFooter className="flex justify-between border-t p-4">
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
            disabled={chapterIndex === totalChapters - 1 && slideIndex === totalSlides - 1}
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
  );
};

export default SlideContent;

