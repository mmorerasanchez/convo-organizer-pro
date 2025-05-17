
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useOnboarding } from './OnboardingContext';

export const OnboardingSpotlight: React.FC = () => {
  const { isOnboarding, currentStep, steps } = useOnboarding();
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

  // Create a spotlight effect with pulsing animation
  return createPortal(
    <div 
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div 
        className="absolute rounded-md animate-pulse"
        style={{
          top: position.top - 4,
          left: position.left - 4,
          width: position.width + 8,
          height: position.height + 8,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          border: '2px solid white',
        }}
      />
    </div>,
    document.body
  );
};
