
import { OnboardingFlowSteps } from './types';

// Onboarding flows for projects and prompting
export const onboardingFlows: OnboardingFlowSteps = {
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
      route: '/prompting',
      element: '[data-onboarding="prompt-designer"]',
      position: 'top',
    },
    {
      id: 'frameworks',
      title: 'Prompt Frameworks',
      description: 'Choose from various frameworks to structure your prompts effectively. Each framework is designed for specific use cases.',
      route: '/prompting',
      element: '[data-onboarding="prompt-framework"]',
      position: 'right',
    },
    {
      id: 'model-selection',
      title: 'Model Selection',
      description: 'Different AI models have different capabilities. Here you can select models and adjust parameters like temperature.',
      route: '/prompting',
      element: '[data-onboarding="model-selection"]',
      position: 'bottom',
    },
    {
      id: 'scanner-intro',
      title: 'Prompt Scanner',
      description: 'Analyze and improve your existing prompts with the scanner tool.',
      route: '/prompting?tab=scanner',
      element: '[data-onboarding="scanner-input"]',
      position: 'top',
    },
    {
      id: 'scanner-suggestions',
      title: 'Improvement Suggestions',
      description: 'The scanner provides suggestions to make your prompts more effective.',
      route: '/prompting?tab=scanner',
      element: '[data-onboarding="scanner-suggestions"]',
      position: 'right',
    },
    {
      id: 'guide-intro',
      title: 'Prompting Guide',
      description: 'Learn prompt engineering through structured lessons and examples.',
      route: '/prompting?tab=guide',
      element: '[data-onboarding="guide-chapters"]',
      position: 'left',
    },
    {
      id: 'guide-content',
      title: 'Guide Content',
      description: 'Read through the chapters to learn best practices for prompt engineering.',
      route: '/prompting?tab=guide',
      element: '[data-onboarding="guide-content"]',
      position: 'right',
    },
    {
      id: 'tour-complete',
      title: 'Tour Complete!',
      description: 'Congratulations! You\'ve completed the tour of our main features. Feel free to explore more on your own or refer back to the tour anytime.',
    }
  ]
};
