
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useOnboarding } from './OnboardingContext';
import { OnboardingFloatingControls } from './OnboardingFloatingControls';

export const OnboardingSpotlight: React.FC = () => {
  const { isOnboarding, currentStep, steps, nextStep, skipToStep, endOnboarding } = useOnboarding();
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (!isOnboarding || !steps[currentStep]?.element) {
      setVisible(false);
      return;
    }

    const positionSpotlight = () => {
      const elementSelector = steps[currentStep].element;
      if (!elementSelector) return;
      
      const targetElement = document.querySelector(elementSelector);
      if (!targetElement) {
        setVisible(false);
        return;
      }
      
      const rect = targetElement.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height
      });
      
      // Ensure element is in view
      targetElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      setVisible(true);
    };

    // Position spotlight initially and when window resizes
    positionSpotlight();
    window.addEventListener('resize', positionSpotlight);
    
    // Small delay to allow for any animations/transitions
    const timer = setTimeout(positionSpotlight, 300);
    
    return () => {
      window.removeEventListener('resize', positionSpotlight);
      clearTimeout(timer);
    };
  }, [isOnboarding, currentStep, steps]);

  if (!visible) return null;

  const handleFloatingControlAction = (action: 'next' | 'skip' | 'end') => {
    if (action === 'next') {
      nextStep();
    } else if (action === 'skip') {
      // Skip to the next step in the current flow
      skipToStep(currentStep + 1);
    } else if (action === 'end') {
      endOnboarding();
    }
  };

  // Create a spotlight effect with pulsing animation
  // The key difference is we're using pointer-events differently:
  // - The overlay has pointer-events-none to let clicks through
  // - The spotlight hole also has pointer-events-none to allow interaction with the element underneath
  return createPortal(
    <>
      {/* Semi-transparent overlay */}
      <div 
        className="fixed inset-0 z-50 pointer-events-auto"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        {/* Spotlight hole - this has pointer-events-none to allow clicking through it */}
        <div 
          className="absolute rounded-md animate-pulse pointer-events-none"
          style={{
            top: position.top - 4,
            left: position.left - 4,
            width: position.width + 8,
            height: position.height + 8,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
            border: '2px solid white',
          }}
        />

        {/* This invisible div overlays the spotlight area but has pointer-events-none
         to allow clicks to pass through to the element underneath */}
        <div 
          style={{
            position: 'absolute',
            top: position.top,
            left: position.left,
            width: position.width,
            height: position.height,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Floating controls near the spotlight */}
      <OnboardingFloatingControls 
        position={position} 
        onAction={handleFloatingControlAction} 
        isFirstStep={currentStep === 0}
        isLastStep={currentStep === steps.length - 1}
      />
    </>,
    document.body
  );
};
