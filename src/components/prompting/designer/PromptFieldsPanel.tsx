
import React from 'react';
import { FrameworkFields } from './FrameworkFields';
import { PromptState } from '@/hooks/prompting';

interface PromptFieldsPanelProps {
  activePrompt: PromptState;
  frameworkFields: any[];
  frameworks?: any[];
  handleFieldChange: (fieldName: string, value: string) => void;
  handleSavePrompt: () => void;
  handleTestPrompt: () => Promise<void>;
  isTestingPrompt: boolean;
  handleNewPrompt: () => void;
}

export const PromptFieldsPanel = ({
  activePrompt,
  frameworkFields,
  frameworks,
  handleFieldChange,
  handleSavePrompt,
  handleTestPrompt,
  isTestingPrompt,
  handleNewPrompt,
}: PromptFieldsPanelProps) => {
  return (
    <FrameworkFields
      activePrompt={activePrompt}
      frameworkFields={frameworkFields}
      frameworks={frameworks}
      handleFieldChange={handleFieldChange}
      handleSavePrompt={handleSavePrompt}
      handleTestPrompt={handleTestPrompt}
      isTestingPrompt={isTestingPrompt}
      handleNewPrompt={handleNewPrompt}
    />
  );
};
