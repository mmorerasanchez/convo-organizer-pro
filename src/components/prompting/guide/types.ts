
import React from 'react';

export interface Slide {
  title: string;
  content: string;
}

export interface Chapter {
  title: string;
  description: string;
  slides: Slide[];
}

export interface PromptImprovement {
  originalPrompt: string;
  improvedPrompt: string;
  feedbackHistory?: Array<{
    feedback: string;
    improvedPrompt: string;
  }>;
}
