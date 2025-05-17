
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

export type OnboardingFlow = 'projects' | 'prompting';

export type OnboardingFlowSteps = {
  [key in OnboardingFlow]: OnboardingStep[];
};

export interface OnboardingContextType {
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
}
