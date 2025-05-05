
import { PromptState } from './types';

export const DEFAULT_PROMPT_STATE: PromptState = {
  title: 'Untitled Prompt',
  frameworkId: null,
  fieldValues: {},
  temperature: 0.7,
  maxTokens: 1000,
  modelId: null
};

// Creates a new empty prompt state
export const createEmptyPrompt = (): PromptState => {
  return { ...DEFAULT_PROMPT_STATE };
};
