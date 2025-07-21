
import React, { useState } from 'react';
import EnhancedChapterList from './guide/EnhancedChapterList';
import EnhancedSlideContent from './guide/EnhancedSlideContent';
import { chapters } from './guide/chapterData';
import { useAuth } from '@/hooks/useAuth';

const PromptingGuide = () => {
  const { user } = useAuth();
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlidesInChapter = chapters[currentChapter].slides.length;
  const totalSlidesAcrossAll = chapters.reduce((acc, chapter) => acc + chapter.slides.length, 0);

  const goToPreviousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToNextSlide = () => {
    if (currentSlide < totalSlidesInChapter - 1) {
      setCurrentSlide(currentSlide + 1);
    } else if (currentChapter < chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
      setCurrentSlide(0);
    }
  };

  const goToPreviousChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
      setCurrentSlide(0);
    }
  };

  const goToNextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
      setCurrentSlide(0);
    }
  };

  const handleChapterSelect = (index: number) => {
    setCurrentChapter(index);
    setCurrentSlide(0);
  };

  const currentChapterData = chapters[currentChapter];
  const currentSlideData = currentChapterData.slides[currentSlide];

  // Show authentication required message if user is not logged in
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <h2 className="text-xl font-semibold">Authentication Required</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Please sign in to access the prompting guide and track your progress.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EnhancedChapterList
        chapters={chapters}
        currentChapter={currentChapter}
        onChapterSelect={handleChapterSelect}
      />
      
      <EnhancedSlideContent
        chapterIndex={currentChapter}
        totalChapters={chapters.length}
        slideIndex={currentSlide}
        totalSlides={totalSlidesAcrossAll}
        chapterSlidesCount={totalSlidesInChapter}
        chapterId={currentChapterData.id}
        slideId={currentSlideData.id}
        title={currentSlideData.title}
        content={currentSlideData.content}
        onPrevSlide={goToPreviousSlide}
        onNextSlide={goToNextSlide}
        onPrevChapter={goToPreviousChapter}
        onNextChapter={goToNextChapter}
      />
    </div>
  );
};

export default PromptingGuide;
