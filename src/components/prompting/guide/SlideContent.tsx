
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
  content: string;
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
  // Function to render markdown-like content
  const renderContent = (text: string) => {
    // Split the content by lines
    const lines = text.trim().split('\n');
    
    return (
      <div className="space-y-4">
        {lines.map((line, index) => {
          const trimmedLine = line.trim();
          
          // Handle headers (##)
          if (trimmedLine.startsWith('## ')) {
            return (
              <h3 key={index} className="text-lg font-semibold mt-4">
                {trimmedLine.substring(3)}
              </h3>
            );
          }
          
          // Handle list items (-)
          if (trimmedLine.startsWith('- ')) {
            return (
              <div key={index} className="flex space-x-2 ml-4">
                <span className="text-muted-foreground">•</span>
                <span>{trimmedLine.substring(2)}</span>
              </div>
            );
          }
          
          // Handle bold text (**)
          if (trimmedLine.includes('**')) {
            const parts = trimmedLine.split(/\*\*(.*?)\*\*/g);
            return (
              <p key={index} className={trimmedLine === '' ? 'my-2' : ''}>
                {parts.map((part, i) => (
                  i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                ))}
              </p>
            );
          }
          
          // Normal paragraph
          if (trimmedLine !== '') {
            return <p key={index}>{trimmedLine}</p>;
          }
          
          // Empty line
          return <div key={index} className="h-2"></div>;
        })}
      </div>
    );
  };

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
      <CardContent>
        <div className="prose max-w-none dark:prose-invert">
          {renderContent(content)}
        </div>
      </CardContent>
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
