
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
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  conversationCount: number;
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
