
import React, { useState } from 'react';
import ChapterList from './guide/ChapterList';
import SlideContent from './guide/SlideContent';
import { chapters } from './guide/chapterData';

const PromptingGuide = () => {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = chapters[currentChapter].slides.length;

  const goToPreviousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToNextSlide = () => {
    if (currentSlide < totalSlides - 1) {
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

  return (
    <div className="space-y-4">
      <div data-onboarding="guide-chapters">
        <ChapterList
          chapters={chapters}
          currentChapter={currentChapter}
          onChapterSelect={handleChapterSelect}
        />
      </div>
      
      <div data-onboarding="guide-content">
        <SlideContent
          chapterIndex={currentChapter}
          totalChapters={chapters.length}
          slideIndex={currentSlide}
          totalSlides={totalSlides}
          title={currentSlideData.title}
          content={currentSlideData.content}
          onPrevSlide={goToPreviousSlide}
          onNextSlide={goToNextSlide}
          onPrevChapter={goToPreviousChapter}
          onNextChapter={goToNextChapter}
        />
      </div>
    </div>
  );
};

export default PromptingGuide;
