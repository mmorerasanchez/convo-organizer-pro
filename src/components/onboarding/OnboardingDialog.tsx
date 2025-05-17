
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import { useOnboarding } from './OnboardingContext';

export const OnboardingDialog: React.FC = () => {
  const { 
    isOnboarding, 
    currentStep, 
    steps, 
    nextStep, 
    prevStep, 
    endOnboarding 
  } = useOnboarding();
  
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    setIsOpen(isOnboarding && !steps[currentStep]?.element);
  }, [isOnboarding, currentStep, steps]);

  if (!steps.length) return null;

  const currentStepData = steps[currentStep];
  const progress = (currentStep / (steps.length - 1)) * 100;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      endOnboarding();
    }, 300); // Allow dialog close animation to complete
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        <div className="bg-primary text-primary-foreground p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{currentStepData?.title}</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-primary/90"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Progress className="mt-2" value={progress} />
          <div className="text-xs mt-1 text-primary-foreground/80">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
        
        <div className="p-6">
          <p className="mb-6">{currentStepData?.description}</p>
          
          {/* Removed action field since users shouldn't need to take action */}
          
          <div className="flex justify-between mt-4">
            <div>
              {!isFirstStep && (
                <Button variant="outline" onClick={prevStep} size="sm">
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} size="sm">
                Skip Tour
              </Button>
              <Button onClick={nextStep} size="sm">
                {isLastStep ? 'Finish' : 'Continue'}
                {!isLastStep && <ChevronRight className="ml-1 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
