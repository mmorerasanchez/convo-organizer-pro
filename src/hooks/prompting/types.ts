
import { User } from '@supabase/supabase-js';

export interface PromptState {
  id?: string;
  title: string;
  frameworkId: string | null;
  fieldValues: Record<string, string>;
  temperature: number;
  maxTokens: number;
  modelId: string | null;
  versionNumber?: number;
}

export interface TestPromptParams {
  versionId?: string;
  prompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface TestPromptResult {
  completion: string;
  tokens_in: number;
  tokens_out: number;
  response_ms: number;
  cost_usd: number;
}

export interface PromptVersion {
  id: string;
  version_number: number;
  field_values: Record<string, string>;
  temperature: number;
  max_tokens: number;
  model_id: string | null;
  created_at: string;
}

export interface Prompt {
  id: string;
  title: string;
  framework_id: string | null;
  created_at: string;
  prompt_versions: PromptVersion[];
}
