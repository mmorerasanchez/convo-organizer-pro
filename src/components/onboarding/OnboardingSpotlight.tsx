
import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useOnboarding } from './OnboardingContext';
import { OnboardingFloatingControls } from './OnboardingFloatingControls';
import { useNavigate } from 'react-router-dom';

export const OnboardingSpotlight: React.FC = () => {
  const { isOnboarding, currentStep, steps, nextStep, skipToStep, endOnboarding } = useOnboarding();
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const elementCheckRef = useRef<number | null>(null);
  const maxRetries = 5;
  const retryInterval = 500; // ms
  
  useEffect(() => {
    if (!isOnboarding || !steps[currentStep]) {
      setVisible(false);
      return;
    }

    // Clear any existing retry interval
    if (elementCheckRef.current !== null) {
      clearInterval(elementCheckRef.current);
      elementCheckRef.current = null;
    }

    const positionSpotlight = (retryCount = 0) => {
      // If there's no element to highlight, just show the dialog
      if (!steps[currentStep].element) {
        setVisible(false);
        return true; // Success, no element needed
      }
      
      const targetElement = document.querySelector(steps[currentStep].element || '');
      if (!targetElement) {
        console.warn(`Element not found: ${steps[currentStep].element}, retry: ${retryCount}`);
        
        // If we've reached max retries, continue to next step that doesn't require an element
        if (retryCount >= maxRetries) {
          console.warn('Max retries reached, skipping to next viable step');
          
          // Find the next step that doesn't require an element
          for (let i = currentStep + 1; i < steps.length; i++) {
            if (!steps[i].element) {
              skipToStep(i);
              return true;
            }
          }
          
          // If no viable step found, end the onboarding
          endOnboarding();
          return false;
        }
        
        return false; // Not found yet
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
      
      // Add a class to the target element for visual emphasis
      targetElement.classList.add('onboarding-target');
      
      setVisible(true);
      
      // For interactive elements like buttons, make sure they remain clickable
      if (steps[currentStep].waitForAction) {
        const handleTargetClick = () => {
          // Wait a bit to allow the action to complete before moving to next step
          setTimeout(() => nextStep(), 800);
        };
        
        targetElement.addEventListener('click', handleTargetClick, { once: true });
        
        return () => {
          targetElement.removeEventListener('click', handleTargetClick);
        };
      }
      
      return true; // Success
    };

    // Check if we need to navigate first
    if (steps[currentStep].route && window.location.pathname !== steps[currentStep].route) {
      // Navigate and then retry positioning
      navigate(steps[currentStep].route);
      
      // Start retry mechanism after navigation
      elementCheckRef.current = window.setInterval(() => {
        const success = positionSpotlight();
        if (success && elementCheckRef.current !== null) {
          clearInterval(elementCheckRef.current);
          elementCheckRef.current = null;
        }
      }, retryInterval) as unknown as number;
    } else {
      // No navigation needed, try positioning immediately
      const success = positionSpotlight();
      
      // If not successful, start retry mechanism
      if (!success) {
        elementCheckRef.current = window.setInterval(() => {
          const retrySuccess = positionSpotlight();
          if (retrySuccess && elementCheckRef.current !== null) {
            clearInterval(elementCheckRef.current);
            elementCheckRef.current = null;
          }
        }, retryInterval) as unknown as number;
      }
    }

    // Clean up when the component unmounts or step changes
    return () => {
      if (elementCheckRef.current !== null) {
        clearInterval(elementCheckRef.current);
        elementCheckRef.current = null;
      }
      
      document.querySelectorAll('.onboarding-target').forEach(el => {
        el.classList.remove('onboarding-target');
      });
    };
  }, [isOnboarding, currentStep, steps, nextStep, skipToStep, navigate, endOnboarding]);

  // Handle clicks on the overlay (outside the spotlight)
  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only process if clicking directly on the overlay (not its children)
    if (e.target === overlayRef.current) {
      // For waitForAction steps, don't proceed on overlay click
      if (!steps[currentStep]?.waitForAction) {
        nextStep();
      }
    }
  };

  const handleFloatingControlAction = (action: 'next' | 'skip' | 'end') => {
    if (action === 'next') {
      nextStep();
    } else if (action === 'skip') {
      // Skip to the next step in the current flow
      skipToStep(currentStep + 1);
    } else if (action === 'end') {
      // End the onboarding and ensure cleanup
      endOnboarding();
    }
  };

  useEffect(() => {
    // Add a small delay to allow animations to complete
    if (!isOnboarding) {
      const cleanup = setTimeout(() => {
        // Remove any lingering onboarding-related classes or elements
        document.querySelectorAll('.onboarding-target').forEach(el => {
          el.classList.remove('onboarding-target');
        });
      }, 300);
      
      return () => clearTimeout(cleanup);
    }
  }, [isOnboarding]);

  if (!visible || !isOnboarding) return null;

  // Create a spotlight effect that allows interaction with the highlighted element
  return createPortal(
    <>
      {/* Semi-transparent overlay with a ref for click handling */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 z-50 transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={handleOverlayClick}
      >
        {/* Spotlight hole - this is the cutout where the highlighted element is visible */}
        <div 
          className="absolute rounded-md spotlight-pulse"
          style={{
            top: position.top - 4,
            left: position.left - 4,
            width: position.width + 8,
            height: position.height + 8,
            // Remove pointer events from the spotlight border/glow
            pointerEvents: 'none',
          }}
        />

        {/* This is an invisible div that allows clicks to pass through to the element underneath */}
        <div 
          className="absolute"
          style={{
            top: position.top,
            left: position.left,
            width: position.width,
            height: position.height,
            // Important: Make this area clickable by not blocking events
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
