
import React from 'react';
import { OnboardingDialog } from './OnboardingDialog';
import { OnboardingSpotlight } from './OnboardingSpotlight';

export const OnboardingWrapper: React.FC = () => {
  return (
    <>
      <OnboardingDialog />
      <OnboardingSpotlight />
    </>
  );
};
