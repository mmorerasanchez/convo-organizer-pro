
import React from 'react';
import { PromptSettings } from './PromptSettings';
import { PromptState } from '@/hooks/prompting';

interface PromptSettingsPanelProps {
  activePrompt: PromptState;
  setActivePrompt: (prompt: PromptState) => void;
  frameworks?: any[];
  models?: any[];
}

export const PromptSettingsPanel = ({
  activePrompt,
  setActivePrompt,
  frameworks,
  models,
}: PromptSettingsPanelProps) => {
  return (
    <PromptSettings
      activePrompt={activePrompt}
      setActivePrompt={setActivePrompt}
      frameworks={frameworks}
      models={models}
    />
  );
};
