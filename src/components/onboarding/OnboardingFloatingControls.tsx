
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
  const isNearBottom = position.top + position.height + 80 > viewportHeight;
  
  // Calculate optimal control position
  const controlPosition = {
    top: isNearBottom 
      ? position.top - 80 // Place above if near bottom
      : position.top + position.height + 16, // Place below by default
    left: position.left + position.width / 2, // Centered horizontally
  };

  return (
    <div 
      className="fixed z-[60] bg-white shadow-lg rounded-lg p-3 transform -translate-x-1/2 flex gap-2"
      style={{
        top: `${controlPosition.top}px`,
        left: `${controlPosition.left}px`,
      }}
    >
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onAction('end')} 
        className="text-red-500 hover:text-red-600 hover:bg-red-50"
      >
        <X className="h-4 w-4 mr-1" />
        End Tour
      </Button>
      
      {!isLastStep && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onAction('skip')}
        >
          <SkipForward className="h-4 w-4 mr-1" />
          Skip Step
        </Button>
      )}
      
      <Button 
        variant="default" 
        size="sm" 
        onClick={() => onAction('next')}
      >
        {isLastStep ? 'Finish' : 'Next'} 
        {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
      </Button>
    </div>
  );
};
