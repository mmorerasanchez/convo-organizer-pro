
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  route?: string;
  element?: string; // CSS selector for the element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right';
};

type OnboardingFlow = 'projects' | 'prompt-designer' | 'prompt-scanner' | 'prompting-guide';

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
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Define the steps for each flow - updated to be observational (not requiring actions)
const onboardingFlows: OnboardingFlowSteps = {
  projects: [
    {
      id: 'welcome',
      title: 'Welcome to Project Management',
      description: 'Projects help you organize related prompts, conversations, and knowledge files in one place. Let\'s explore how to use them effectively.',
      route: '/projects',
    },
    {
      id: 'new-project',
      title: 'Creating New Projects',
      description: 'This button allows you to create new projects to organize your work. You can add details, invite team members, and more.',
      element: '[data-onboarding="new-project"]',
      position: 'bottom',
    },
    {
      id: 'project-list',
      title: 'Your Project List',
      description: 'Here you can see all your projects. You can filter them by status and search for specific projects.',
      route: '/projects',
      element: '.project-grid',
      position: 'top',
    },
    {
      id: 'conversations',
      title: 'Conversations',
      description: 'Conversations allow you to manage interactions with AI models and track important dialogues.',
      route: '/conversations',
    }
  ],
  'prompt-designer': [
    {
      id: 'designer-intro',
      title: 'Prompt Designer',
      description: 'Create sophisticated prompts using proven frameworks. This tool helps you craft effective prompts for different AI models.',
      route: '/prompting',
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
      id: 'test-prompt',
      title: 'Testing Your Prompts',
      description: 'You can test how your prompt performs in real-time with this feature, allowing you to refine and improve it.',
      element: '[data-onboarding="test-prompt"]',
      position: 'left',
    }
  ],
  'prompt-scanner': [
    {
      id: 'scanner-intro',
      title: 'Prompt Scanner',
      description: 'Analyze and improve your existing prompts. This tool helps identify issues and suggests enhancements.',
      route: '/prompting',
    },
    {
      id: 'enter-prompt',
      title: 'Entering Your Prompt',
      description: 'Paste an existing prompt here to get improvement suggestions from our AI.',
      element: '[data-onboarding="scanner-input"]',
      position: 'top',
    },
    {
      id: 'suggestions',
      title: 'AI Suggestions',
      description: 'The scanner analyzes your prompt and provides detailed recommendations to improve effectiveness.',
      element: '[data-onboarding="scanner-suggestions"]',
      position: 'bottom',
    }
  ],
  'prompting-guide': [
    {
      id: 'guide-intro',
      title: 'Prompting Guide',
      description: 'Learn prompt engineering through structured lessons and examples. Perfect for beginners and advanced users alike.',
      route: '/prompting',
    },
    {
      id: 'chapters',
      title: 'Guide Chapters',
      description: 'Explore different topics and techniques in prompt engineering, from basic concepts to advanced strategies.',
      element: '[data-onboarding="guide-chapters"]',
      position: 'left',
    },
    {
      id: 'lessons',
      title: 'Interactive Lessons',
      description: 'Each lesson includes practical examples and exercises to help you master prompt engineering techniques.',
      element: '[data-onboarding="guide-content"]',
      position: 'right',
    }
  ]
};

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<OnboardingFlow | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Check if user has completed onboarding
  useEffect(() => {
    const completedOnboarding = localStorage.getItem('onboardingCompleted');
    if (completedOnboarding) {
      setHasCompletedOnboarding(true);
    }
  }, []);

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
    setCurrentFlow(flow);
    setCurrentStep(0);
    setIsOnboarding(true);
  };

  // End the onboarding process
  const endOnboarding = () => {
    setIsOnboarding(false);
    setCurrentFlow(null);
    localStorage.setItem('onboardingCompleted', 'true');
    setHasCompletedOnboarding(true);
  };

  // Move to the next step
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (currentFlow === 'projects') {
      setCurrentFlow('prompt-designer');
      setCurrentStep(0);
    } else if (currentFlow === 'prompt-designer') {
      setCurrentFlow('prompt-scanner');
      setCurrentStep(0);
    } else if (currentFlow === 'prompt-scanner') {
      setCurrentFlow('prompting-guide');
      setCurrentStep(0);
    } else {
      // End onboarding if we've reached the end of all flows
      endOnboarding();
    }
  };

  // Move to the previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (currentFlow === 'prompt-designer') {
      setCurrentFlow('projects');
      setCurrentStep(onboardingFlows.projects.length - 1);
    } else if (currentFlow === 'prompt-scanner') {
      setCurrentFlow('prompt-designer');
      setCurrentStep(onboardingFlows['prompt-designer'].length - 1);
    } else if (currentFlow === 'prompting-guide') {
      setCurrentFlow('prompt-scanner');
      setCurrentStep(onboardingFlows['prompt-scanner'].length - 1);
    }
  };

  // Skip to a specific step
  const skipToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStep(index);
    } else {
      // If we try to skip past the end, move to next flow or end
      if (currentFlow === 'projects') {
        setCurrentFlow('prompt-designer');
        setCurrentStep(0);
      } else if (currentFlow === 'prompt-designer') {
        setCurrentFlow('prompt-scanner');
        setCurrentStep(0);
      } else if (currentFlow === 'prompt-scanner') {
        setCurrentFlow('prompting-guide');
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
