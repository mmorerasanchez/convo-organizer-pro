
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  route?: string;
  element?: string; // CSS selector for the element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: string; // Description of the action to take
  waitForAction?: boolean; // If true, wait for user action before proceeding
};

type OnboardingFlow = 'projects' | 'prompting';

export type OnboardingFlowSteps = {
  [key in OnboardingFlow]: OnboardingStep[];
};

type OnboardingContextType = {
  isOnboarding: boolean;
  currentFlow: OnboardingFlow | null;
  currentStep: number;
  steps: OnboardingStep[];
  startOnboarding: (flow?: OnboardingFlow) => void;
  endOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipToStep: (index: number) => void;
  hasCompletedOnboarding: boolean;
  previousRoute: string | null;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Updated onboarding flow with only projects and prompting
const onboardingFlows: OnboardingFlowSteps = {
  projects: [
    {
      id: 'welcome',
      title: 'Welcome to Project Management',
      description: 'Projects help you organize related prompts, conversations, and knowledge files in one place. Let\'s start by creating your first project.',
      route: '/projects',
    },
    {
      id: 'new-project',
      title: 'Creating Your First Project',
      description: 'Click this button to create a new project. A project helps you organize your work effectively.',
      element: '[data-onboarding="new-project"]',
      position: 'bottom',
      action: 'Click the "New Project" button',
      waitForAction: true,
    },
    {
      id: 'project-form',
      title: 'Project Details',
      description: 'Enter a name for your new project and click "Create Project" when you\'re ready.',
      element: '.new-project-form',
      position: 'top',
      action: 'Fill in project details and create',
      waitForAction: true,
    },
    {
      id: 'project-created',
      title: 'Project Created Successfully!',
      description: 'Great! Your project is now created. Let\'s continue the tour by exploring the prompting tools.',
      route: '/prompting',
    }
  ],
  'prompting': [
    {
      id: 'prompt-intro',
      title: 'Prompting Tools',
      description: 'These tools help you create effective prompts for AI models. Let\'s explore the different features available.',
      route: '/prompting',
    },
    {
      id: 'prompt-designer',
      title: 'Prompt Designer',
      description: 'Create sophisticated prompts using proven frameworks. This tool helps you craft effective prompts for different AI models.',
      element: '[data-onboarding="prompt-designer"]',
      position: 'top',
    },
    {
      id: 'frameworks',
      title: 'Prompt Frameworks',
      description: 'Choose from various frameworks to structure your prompts effectively. Each framework is designed for specific use cases.',
      element: '[data-onboarding="prompt-framework"]',
      position: 'right',
    },
    {
      id: 'model-selection',
      title: 'Model Selection',
      description: 'Different AI models have different capabilities. Here you can select models and adjust parameters like temperature.',
      element: '[data-onboarding="model-selection"]',
      position: 'bottom',
    },
    {
      id: 'scanner-intro',
      title: 'Prompt Scanner',
      description: 'Analyze and improve your existing prompts with the scanner tool. It provides suggestions for better results.',
      element: '[data-onboarding="scanner-input"]',
      position: 'top',
    },
    {
      id: 'guide-intro',
      title: 'Prompting Guide',
      description: 'Learn prompt engineering through structured lessons and examples. Perfect for beginners and advanced users alike.',
      element: '[data-onboarding="guide-chapters"]',
      position: 'left',
    },
    {
      id: 'tour-complete',
      title: 'Tour Complete!',
      description: 'Congratulations! You\'ve completed the tour of our main features. Feel free to explore more on your own or refer back to the tour anytime.',
    }
  ]
};

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
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
      navigate(steps[currentStep].route);
    }
  }, [isOnboarding, currentStep, navigate, steps]);

  // Start the onboarding process
  const startOnboarding = (flow: OnboardingFlow = 'projects') => {
    // Store current route before beginning
    setPreviousRoute(location.pathname + location.search);
    setCurrentFlow(flow);
    setCurrentStep(0);
    setIsOnboarding(true);
    
    // If starting a specific flow, navigate to its route immediately
    if (flow && onboardingFlows[flow] && onboardingFlows[flow][0]?.route) {
      navigate(onboardingFlows[flow][0].route);
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
