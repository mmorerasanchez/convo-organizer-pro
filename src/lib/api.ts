
import { supabase } from '@/integrations/supabase/client';
import { Project, Conversation, Tag } from './types';

// Projects API
export const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*, conversations:conversations(count)')
    .order('updated_at', { ascending: false });

  if (error) throw error;

  // Convert data into the format we need
  return data.map((project: any) => ({
    id: project.id,
    name: project.name,
    description: project.description || '',
    createdAt: project.created_at,
    updatedAt: project.updated_at,
    conversationCount: project.conversations ? project.conversations.length : 0
  }));
};

export const fetchProjectById = async (id: string): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*, conversations:conversations(count)')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    conversationCount: data.conversations ? data.conversations.length : 0
  };
};

export const createProject = async (project: {
  name: string;
  description: string;
}): Promise<Project> => {
  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        name: project.name,
        description: project.description
      }
    ])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    conversationCount: 0
  };
};

export const updateProject = async (
  id: string,
  updates: { name?: string; description?: string }
): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
};

export const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Conversations API
export const fetchConversations = async (): Promise<Conversation[]> => {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      project:projects(id, name)
    `)
    .order('captured_at', { ascending: false });

  if (error) throw error;

  // Convert data into the format we need
  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    content: item.content,
    platform: item.platform,
    capturedAt: item.captured_at,
    tags: [], // We'll implement tags separately
    projectId: item.project_id
  }));
};

export const fetchConversationsByProjectId = async (projectId: string): Promise<Conversation[]> => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('project_id', projectId)
    .order('captured_at', { ascending: false });

  if (error) throw error;

  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    content: item.content,
    platform: item.platform,
    capturedAt: item.captured_at,
    tags: [], // We'll implement tags separately
    projectId: item.project_id
  }));
};

export const fetchConversationById = async (id: string): Promise<Conversation | null> => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    platform: data.platform,
    capturedAt: data.captured_at,
    tags: [], // We'll implement tags separately
    projectId: data.project_id
  };
};

export const createConversation = async (conversation: {
  title: string;
  content: string;
  platform: string;
  projectId: string;
}): Promise<Conversation> => {
  const { data, error } = await supabase
    .from('conversations')
    .insert([
      {
        title: conversation.title,
        content: conversation.content,
        platform: conversation.platform,
        project_id: conversation.projectId
      }
    ])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    title: data.title,
    content: data.content,
    platform: data.platform,
    capturedAt: data.captured_at,
    tags: [],
    projectId: data.project_id
  };
};

export const updateConversation = async (
  id: string,
  updates: { title?: string; content?: string; platform?: string; projectId?: string }
): Promise<void> => {
  const updatedData: any = {};
  
  if (updates.title) updatedData.title = updates.title;
  if (updates.content) updatedData.content = updates.content;
  if (updates.platform) updatedData.platform = updates.platform;
  if (updates.projectId) updatedData.project_id = updates.projectId;
  
  const { error } = await supabase
    .from('conversations')
    .update(updatedData)
    .eq('id', id);

  if (error) throw error;
};

export const deleteConversation = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Tags API
export const fetchTags = async (): Promise<Tag[]> => {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name');

  if (error) throw error;

  return data.map((item: any) => ({
    id: item.id,
    name: item.name,
    color: item.color
  }));
};

export const createTag = async (tag: { name: string; color: string }): Promise<Tag> => {
  const { data, error } = await supabase
    .from('tags')
    .insert([
      {
        name: tag.name,
        color: tag.color
      }
    ])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    color: data.color
  };
};
