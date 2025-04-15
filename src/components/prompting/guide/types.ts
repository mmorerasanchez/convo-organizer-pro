
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
