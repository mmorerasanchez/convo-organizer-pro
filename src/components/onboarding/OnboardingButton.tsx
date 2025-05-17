
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { useOnboarding } from './OnboardingContext';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

export const OnboardingButton: React.FC = () => {
  const { 
    startOnboarding,
    hasCompletedOnboarding 
  } = useOnboarding();
  
  const handleStartProjectsTour = () => {
    startOnboarding('projects');
  };
  
  const handleStartPromptingTour = () => {
    startOnboarding('prompting');
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={hasCompletedOnboarding ? "outline" : "default"}
          size="sm" 
          className={`flex gap-1 items-center ${hasCompletedOnboarding ? "onboarding-button-completed" : "onboarding-button-new"}`}
        >
          <HelpCircle className="h-4 w-4" />
          Take a Tour
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white">
        <DropdownMenuLabel>App Tour</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleStartProjectsTour}>
            Project Management
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleStartPromptingTour}>
            Prompting Tools
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
