
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
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden bg-white border-0 shadow-lg rounded-lg" 
        closeButton={false}>
        {/* Dialog header with close button */}
        <div className="relative p-6 pb-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          <h2 className="text-xl font-semibold text-gray-800 pr-8">{currentStepData?.title}</h2>
        </div>
        
        {/* Dialog content */}
        <div className="p-6 pt-3">
          <p className="text-gray-600 mb-8">{currentStepData?.description}</p>
          
          {/* Centered progress indicator */}
          <div className="flex flex-col items-center mb-6">
            <Progress className="w-full h-2 mb-2" value={progress} />
            <div className="text-xs text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          
          {/* Action buttons */}
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
              <Button 
                variant="outline" 
                onClick={handleClose} 
                size="sm"
                className="text-gray-600"
              >
                Skip Tour
              </Button>
              <Button 
                onClick={nextStep} 
                size="sm" 
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
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
