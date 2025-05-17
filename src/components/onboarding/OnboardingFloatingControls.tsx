
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, X, SkipForward } from 'lucide-react';

interface OnboardingFloatingControlsProps {
  position: { top: number; left: number; width: number; height: number };
  onAction: (action: 'next' | 'skip' | 'end') => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export const OnboardingFloatingControls: React.FC<OnboardingFloatingControlsProps> = ({
  position,
  onAction,
  isFirstStep,
  isLastStep
}) => {
  // Position the controls below the spotlight, but adjust if near bottom of viewport
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  
  // Calculate if the element is near edges
  const isNearBottom = position.top + position.height + 80 > viewportHeight;
  const isNearRight = position.left + position.width / 2 + 150 > viewportWidth;
  const isNearLeft = position.left + position.width / 2 - 150 < 0;
  
  // Calculate optimal control position - centered horizontally for better accessibility
  let controlPosition = {
    top: isNearBottom 
      ? position.top - 80 // Place above if near bottom
      : position.top + position.height + 16, // Place below by default
    left: position.left + position.width / 2, // Centered horizontally
  };
  
  // Adjust horizontal position if near edges
  if (isNearRight) {
    controlPosition.left = viewportWidth - 160;
  } else if (isNearLeft) {
    controlPosition.left = 160;
  }

  return (
    <div 
      className="fixed z-[70] bg-white shadow-lg rounded-lg p-3 transform -translate-x-1/2 flex gap-2"
      style={{
        top: `${controlPosition.top}px`,
        left: `${controlPosition.left}px`,
      }}
    >
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onAction('end')} 
        className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
      >
        <X className="h-4 w-4 mr-1" />
        End Tour
      </Button>
      
      {!isLastStep && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onAction('skip')}
          className="text-gray-600"
        >
          <SkipForward className="h-4 w-4 mr-1" />
          Skip Step
        </Button>
      )}
      
      <Button 
        variant="default" 
        size="sm" 
        onClick={() => onAction('next')}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        {isLastStep ? 'Finish' : 'Next'} 
        {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
      </Button>
    </div>
  );
};
