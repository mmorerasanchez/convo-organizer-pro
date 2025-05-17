
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
  
  const handleStartFullTour = () => {
    startOnboarding('projects');
  };
  
  const handleStartProjectsTour = () => {
    startOnboarding('projects');
  };
  
  const handleStartDesignerTour = () => {
    startOnboarding('prompt-designer');
  };
  
  const handleStartScannerTour = () => {
    startOnboarding('prompt-scanner');
  };
  
  const handleStartGuideTour = () => {
    startOnboarding('prompting-guide');
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex gap-1 items-center"
        >
          <HelpCircle className="h-4 w-4" />
          {hasCompletedOnboarding ? "Help" : "Take a Tour"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>App Tour</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleStartFullTour}>
            Complete Tour
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleStartProjectsTour}>
            Project Management
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleStartDesignerTour}>
            Prompt Designer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleStartScannerTour}>
            Prompt Scanner
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleStartGuideTour}>
            Prompting Guide
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
