
import React from 'react';

export interface Slide {
  id: string;
  title: string;
  content: string;
}

export interface Chapter {
  id: string;
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
