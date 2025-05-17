
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { OnboardingStep, OnboardingFlow, OnboardingContextType } from './types';
import { onboardingFlows } from './steps';
import { useOnboardingUtils } from './useOnboardingUtils';

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getRouteWithTabParameter } = useOnboardingUtils();
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<OnboardingFlow | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [previousRoute, setPreviousRoute] = useState<string | null>(null);

  // Check if user has completed onboarding
  useEffect(() => {
    const completedOnboarding = localStorage.getItem('onboardingCompleted');
    if (completedOnboarding) {
      setHasCompletedOnboarding(true);
    }
  }, []);

  // Store current path before starting onboarding
  useEffect(() => {
    if (!isOnboarding) {
      setPreviousRoute(location.pathname + location.search);
    }
  }, [isOnboarding, location]);

  // Get current steps based on flow
  const steps = currentFlow ? onboardingFlows[currentFlow] : [];

  // Navigate to the route if defined for the current step
  useEffect(() => {
    if (isOnboarding && steps[currentStep]?.route) {
      const targetRoute = getRouteWithTabParameter(steps[currentStep].route);
      
      // Only navigate if we're not already on the correct route
      if (location.pathname + location.search !== targetRoute) {
        navigate(targetRoute);
      }
    }
  }, [isOnboarding, currentStep, navigate, steps, location.pathname, location.search, getRouteWithTabParameter]);

  // Start the onboarding process
  const startOnboarding = (flow: OnboardingFlow = 'projects') => {
    // Store current route before beginning
    setPreviousRoute(location.pathname + location.search);
    setCurrentFlow(flow);
    setCurrentStep(0);
    setIsOnboarding(true);
    
    // If starting a specific flow, navigate to its route immediately
    if (flow && onboardingFlows[flow] && onboardingFlows[flow][0]?.route) {
      const targetRoute = onboardingFlows[flow][0].route;
      navigate(targetRoute);
    }
  };

  // End the onboarding process with improved cleanup
  const endOnboarding = () => {
    setIsOnboarding(false);
    setCurrentFlow(null);
    
    // Clear all onboarding-related classes
    document.querySelectorAll('.onboarding-target').forEach(el => {
      el.classList.remove('onboarding-target');
    });
    
    // Mark onboarding as completed
    localStorage.setItem('onboardingCompleted', 'true');
    setHasCompletedOnboarding(true);
    
    // Show a toast to confirm completion
    toast.success('Onboarding tour completed!');
    
    // Return to previous route if it exists and is not the current route
    if (previousRoute && previousRoute !== (location.pathname + location.search)) {
      // Small delay to ensure cleanup before navigation
      setTimeout(() => {
        navigate(previousRoute);
      }, 300);
    }
  };

  // Move to the next step with improved flow navigation
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // If we've reached the end of one flow, move to the next flow
      if (currentFlow === 'projects') {
        setCurrentFlow('prompting');
        setCurrentStep(0);
      } else {
        // End onboarding if we've reached the end of all flows
        endOnboarding();
      }
    }
  };

  // Move to the previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      // If we're at the first step of prompting, go back to projects
      if (currentFlow === 'prompting') {
        setCurrentFlow('projects');
        setCurrentStep(onboardingFlows.projects.length - 1);
      }
    }
  };

  // Skip to a specific step
  const skipToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStep(index);
    } else {
      // If we try to skip past the end, move to next flow or end
      if (currentFlow === 'projects') {
        setCurrentFlow('prompting');
        setCurrentStep(0);
      } else {
        endOnboarding();
      }
    }
  };

  const value = {
    isOnboarding,
    currentFlow,
    currentStep,
    steps,
    startOnboarding,
    endOnboarding,
    nextStep,
    prevStep,
    skipToStep,
    hasCompletedOnboarding,
    previousRoute,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
