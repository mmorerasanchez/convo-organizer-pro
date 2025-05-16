
import React from 'react';
import { PromptSettingsPanel } from './PromptSettingsPanel';
import { PromptFieldsPanel } from './PromptFieldsPanel';
import { CompiledPromptPreview } from './CompiledPromptPreview';
import { ModelResponse } from './ModelResponse';
import { PromptState } from '@/hooks/prompting';

interface PromptDesignerContainerProps {
  activePrompt: PromptState;
  setActivePrompt: (prompt: PromptState) => void;
  promptResponse: string;
  compiledPrompt: string;
  frameworks: any[];
  models: any[];
  frameworkFields: any[];
  isTestingPrompt: boolean;
  handleFieldChange: (fieldName: string, value: string) => void;
  handleSavePrompt: () => void;
  handleTestPrompt: () => Promise<void>;
  handleClear: () => void;
  onSaveToProject?: () => void;
}

export const PromptDesignerContainer = ({
  activePrompt,
  setActivePrompt,
  promptResponse,
  compiledPrompt,
  frameworks,
  models,
  frameworkFields,
  isTestingPrompt,
  handleFieldChange,
  handleSavePrompt,
  handleTestPrompt,
  handleClear,
  onSaveToProject
}: PromptDesignerContainerProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left column - Prompt Designer */}
      <div className="space-y-6">
        {/* Prompt Settings */}
        <PromptSettingsPanel 
          activePrompt={activePrompt}
          setActivePrompt={setActivePrompt}
          frameworks={frameworks}
          models={models}
        />
        
        {/* Framework Fields - show only if a framework is selected */}
        {activePrompt.frameworkId && (
          <PromptFieldsPanel 
            activePrompt={activePrompt}
            frameworkFields={frameworkFields}
            frameworks={frameworks}
            handleFieldChange={handleFieldChange}
            handleSavePrompt={handleSavePrompt}
            handleTestPrompt={handleTestPrompt}
            isTestingPrompt={isTestingPrompt}
            handleNewPrompt={handleClear}
          />
        )}
      </div>
      
      {/* Right column - Compiled Prompt and Model Response */}
      <div className="space-y-6">
        {/* Compiled Prompt Preview - moved to the top of right column */}
        <CompiledPromptPreview compiledPrompt={compiledPrompt} />
        
        {/* Model Response */}
        <ModelResponse 
          promptResponse={promptResponse}
          compiledPrompt={compiledPrompt}
          onSaveToProject={onSaveToProject}
        />
      </div>
    </div>
  );
};
