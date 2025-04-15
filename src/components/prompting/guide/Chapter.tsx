
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChapterProps {
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}

const Chapter = ({ title, description, isActive, onClick }: ChapterProps) => {
  return (
    <Card 
      className={`cursor-pointer hover:bg-muted/50 transition-colors ${
        isActive ? 'border-primary' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="py-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Chapter;

