export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Conversation {
  id: string;
  title: string;
  content: string;
  platform: string;
  capturedAt: string;
  tags: Tag[];
  projectId: string;
  externalId?: string;
  status?: string;
  type: 'input' | 'output';
  modelId?: string;
  model?: string; // For displaying model name when fetched
  source?: string; // Added source field to track where conversation originated
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  conversationCount: number;
  shareLink?: string;
  status: string;
  last_learning_run?: string;
}

export interface Knowledge {
  id: string;
  title: string;
  description: string | null;
  filePath: string;
  fileType: string;
  fileSize: number;
  fileName: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'model' | 'prompt' | 'function' | 'integration';
  status: 'active' | 'inactive' | 'pending';
  lastUsed?: string;
}

export interface Tool {
  id: string;
  name: string;
  model: string;
  score: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIModel {
  id: string;
  displayName: string;
  provider: string;
  contextWindow?: number;
  icon?: string;
  capabilities?: string[];
  pricing?: 'free' | 'low' | 'medium' | 'high';
  description?: string;
  strengths?: string[];
  bestFor?: string[];
}

export interface ModelProvider {
  id: string;
  name: string;
  icon: string;
  models: AIModel[];
}

export interface LLMModel {
  id: string;
  name: string;
  provider: 'openai' | 'google' | 'anthropic' | 'other';
  description: string;
  contextWindow: number;
  status: 'available' | 'coming-soon';
  capabilities: string[];
  lastUsed?: string;
  icon?: string;
  pricing?: 'free' | 'low' | 'medium' | 'high';
  strengths?: string[];
  bestFor?: string[];
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  tag: 'Research' | 'Content Creation' | 'Analysis' | 'Customer Support' | 'Development' | 'Custom';
  framework_id?: string | null;
  framework_config: Record<string, any>;
  field_values: Record<string, any>;
  temperature: number;
  max_tokens: number;
  model_id?: string;
  variables: Record<string, any>;
  visibility: 'private' | 'shared' | 'public';
  created_by: string;
  usage_count: number;
  effectiveness_score?: number;
  created_at: string;
  updated_at: string;
}
