import { Project, Conversation, Tag } from './types';

// Empty arrays for all mock data to let users create their own content
export const mockTags: Tag[] = [];

export const mockProjects: Project[] = [];

export const mockConversations: Conversation[] = [];

// Keep the utility functions but adjust them to handle empty arrays
export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find(project => project.id === id);
};

export const getConversationsByProjectId = (projectId: string): Conversation[] => {
  return mockConversations.filter(conversation => conversation.projectId === projectId);
};

export const getConversationById = (id: string): Conversation | undefined => {
  return mockConversations.find(conversation => conversation.id === id);
};
