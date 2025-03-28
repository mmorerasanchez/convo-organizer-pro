
import { Project, Conversation, Tag } from './types';

export const mockTags: Tag[] = [
  { id: '1', name: 'GPT-4', color: 'bg-blue-100 text-blue-800' },
  { id: '2', name: 'Important', color: 'bg-red-100 text-red-800' },
  { id: '3', name: 'Prompt Engineering', color: 'bg-purple-100 text-purple-800' },
  { id: '4', name: 'Research', color: 'bg-green-100 text-green-800' },
  { id: '5', name: 'Tutorial', color: 'bg-yellow-100 text-yellow-800' },
  { id: '6', name: 'Claude', color: 'bg-indigo-100 text-indigo-800' },
  { id: '7', name: 'Gemini', color: 'bg-teal-100 text-teal-800' },
  { id: '8', name: 'Archived', color: 'bg-gray-100 text-gray-800' },
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Chatbot Development',
    description: 'Building a customer service chatbot with advanced NLP capabilities',
    createdAt: '2023-08-15T10:30:00Z',
    updatedAt: '2023-08-20T14:15:00Z',
    conversationCount: 12
  },
  {
    id: '2',
    name: 'Content Generation',
    description: 'Using AI to generate marketing copy and blog content',
    createdAt: '2023-07-22T08:45:00Z',
    updatedAt: '2023-08-18T11:20:00Z',
    conversationCount: 8
  },
  {
    id: '3',
    name: 'Sentiment Analysis',
    description: 'Analyzing customer feedback for sentiment patterns',
    createdAt: '2023-09-01T15:00:00Z',
    updatedAt: '2023-09-10T09:30:00Z',
    conversationCount: 5
  },
  {
    id: '4',
    name: 'Prompt Engineering Research',
    description: 'Exploring optimal prompt structures for various AI models',
    createdAt: '2023-06-10T12:00:00Z',
    updatedAt: '2023-09-05T16:45:00Z',
    conversationCount: 24
  },
];

export const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'Initial Chatbot Requirements',
    content: 'Discussing the core requirements for our customer service chatbot implementation...',
    platform: 'ChatGPT',
    capturedAt: '2023-08-16T11:30:00Z',
    tags: [mockTags[0], mockTags[3]],
    projectId: '1'
  },
  {
    id: '2',
    title: 'NLP Feature Exploration',
    content: 'Exploring natural language processing features available in different AI models...',
    platform: 'Claude',
    capturedAt: '2023-08-18T14:45:00Z',
    tags: [mockTags[5], mockTags[3]],
    projectId: '1'
  },
  {
    id: '3',
    title: 'Blog Post Generation Test',
    content: 'Testing different approaches to generating engaging blog content...',
    platform: 'ChatGPT',
    capturedAt: '2023-08-10T09:15:00Z',
    tags: [mockTags[0], mockTags[4]],
    projectId: '2'
  },
  {
    id: '4',
    title: 'Marketing Copy Variations',
    content: 'Generating multiple variations of marketing copy for A/B testing...',
    platform: 'GPT-4',
    capturedAt: '2023-08-12T16:20:00Z',
    tags: [mockTags[0], mockTags[1]],
    projectId: '2'
  },
  {
    id: '5',
    title: 'Customer Review Analysis',
    content: 'Analyzing a batch of customer reviews to identify sentiment patterns...',
    platform: 'Claude',
    capturedAt: '2023-09-02T10:00:00Z',
    tags: [mockTags[5], mockTags[1]],
    projectId: '3'
  },
  {
    id: '6',
    title: 'Advanced Prompt Techniques',
    content: 'Exploring chain-of-thought and other advanced prompting techniques...',
    platform: 'GPT-4',
    capturedAt: '2023-07-05T13:45:00Z',
    tags: [mockTags[0], mockTags[2]],
    projectId: '4'
  },
  {
    id: '7',
    title: 'Comparative Model Testing',
    content: 'Comparing response quality across GPT-4, Claude, and Gemini using the same prompts...',
    platform: 'Multiple',
    capturedAt: '2023-08-25T15:30:00Z',
    tags: [mockTags[0], mockTags[5], mockTags[6], mockTags[2]],
    projectId: '4'
  },
];

export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find(project => project.id === id);
};

export const getConversationsByProjectId = (projectId: string): Conversation[] => {
  return mockConversations.filter(conversation => conversation.projectId === projectId);
};

export const getConversationById = (id: string): Conversation | undefined => {
  return mockConversations.find(conversation => conversation.id === id);
};
