
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
}
