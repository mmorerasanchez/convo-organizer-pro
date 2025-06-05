
import React, { useState } from 'react';
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
  const [showAdvancedParams, setShowAdvancedParams] = useState(false);

  return (
    <PromptSettings
      activePrompt={activePrompt}
      setActivePrompt={setActivePrompt}
      frameworks={frameworks}
      showAdvancedParams={showAdvancedParams}
      onToggleAdvancedParams={() => setShowAdvancedParams(!showAdvancedParams)}
    />
  );
};
