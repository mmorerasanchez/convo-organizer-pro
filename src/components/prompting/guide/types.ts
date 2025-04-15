
export interface Slide {
  title: string;
  content: React.ReactNode;
}

export interface Chapter {
  title: string;
  description: string;
  slides: Slide[];
}

