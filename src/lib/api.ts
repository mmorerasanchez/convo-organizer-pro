
import { supabase } from '@/integrations/supabase/client';
import { Project, Conversation, Tag } from './types';
import { Database } from '@/integrations/supabase/types';

// Type definitions for Supabase tables
type Tables = Database['public']['Tables'];
type ProjectTable = Tables['projects']['Row'];
type ConversationTable = Tables['conversations']['Row'];
type TagTable = Tables['tags']['Row'];

// Projects API
export const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*, conversations(count)')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  if (!data) return [];

  // Convert data into the format we need
  return data.map((project) => ({
    id: project.id,
    name: project.name,
    description: project.description || '',
    createdAt: project.created_at,
    updatedAt: project.updated_at,
    conversationCount: project.conversations?.[0]?.count || 0
  }));
};

export const fetchProjectById = async (id: string): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*, conversations(count)')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw error;
  }

  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    conversationCount: data.conversations?.[0]?.count || 0
  };
};

export const createProject = async (project: {
  name: string;
  description: string;
}): Promise<Project> => {
  // Get the current user session
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) throw sessionError;
  if (!sessionData.session || !sessionData.session.user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        name: project.name,
        description: project.description,
        user_id: sessionData.session.user.id
      }
    ])
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to create project');

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
  // First fetch all conversations
  const { data: conversationsData, error: conversationsError } = await supabase
    .from('conversations')
    .select(`
      *,
      project:projects(id, name)
    `)
    .order('captured_at', { ascending: false });

  if (conversationsError) throw conversationsError;
  if (!conversationsData) return [];

  // Now fetch all tags for these conversations
  const conversationIds = conversationsData.map(conv => conv.id);
  
  const { data: tagRelations, error: tagRelationsError } = await supabase
    .from('conversation_tags')
    .select('conversation_id, tag_id')
    .in('conversation_id', conversationIds);

  if (tagRelationsError) throw tagRelationsError;

  // Fetch all relevant tags
  const tagIds = tagRelations ? tagRelations.map(rel => rel.tag_id) : [];
  
  let tags: Tag[] = [];
  if (tagIds.length > 0) {
    const { data: tagsData, error: tagsError } = await supabase
      .from('tags')
      .select('*')
      .in('id', tagIds);
      
    if (tagsError) throw tagsError;
    if (tagsData) {
      tags = tagsData.map(tag => ({
        id: tag.id,
        name: tag.name,
        color: tag.color
      }));
    }
  }

  // Map tags to conversations
  return conversationsData.map((item) => {
    // Find tags for this conversation
    const conversationTagIds = tagRelations
      ? tagRelations
          .filter(rel => rel.conversation_id === item.id)
          .map(rel => rel.tag_id)
      : [];
      
    const conversationTags = tags.filter(tag => 
      conversationTagIds.includes(tag.id)
    );

    return {
      id: item.id,
      title: item.title,
      content: item.content,
      platform: item.platform,
      capturedAt: item.captured_at,
      tags: conversationTags,
      projectId: item.project_id
    };
  });
};

export const fetchConversationsByProjectId = async (projectId: string): Promise<Conversation[]> => {
  // First fetch all conversations for the project
  const { data: conversationsData, error: conversationsError } = await supabase
    .from('conversations')
    .select('*')
    .eq('project_id', projectId)
    .order('captured_at', { ascending: false });

  if (conversationsError) throw conversationsError;
  if (!conversationsData) return [];

  // Now fetch all tags for these conversations
  const conversationIds = conversationsData.map(conv => conv.id);
  
  const { data: tagRelations, error: tagRelationsError } = await supabase
    .from('conversation_tags')
    .select('conversation_id, tag_id')
    .in('conversation_id', conversationIds);

  if (tagRelationsError) throw tagRelationsError;

  // Fetch all relevant tags
  const tagIds = tagRelations ? tagRelations.map(rel => rel.tag_id) : [];
  
  let tags: Tag[] = [];
  if (tagIds.length > 0) {
    const { data: tagsData, error: tagsError } = await supabase
      .from('tags')
      .select('*')
      .in('id', tagIds);
      
    if (tagsError) throw tagsError;
    if (tagsData) {
      tags = tagsData.map(tag => ({
        id: tag.id,
        name: tag.name,
        color: tag.color
      }));
    }
  }

  // Map tags to conversations
  return conversationsData.map((item) => {
    // Find tags for this conversation
    const conversationTagIds = tagRelations
      ? tagRelations
          .filter(rel => rel.conversation_id === item.id)
          .map(rel => rel.tag_id)
      : [];
      
    const conversationTags = tags.filter(tag => 
      conversationTagIds.includes(tag.id)
    );

    return {
      id: item.id,
      title: item.title,
      content: item.content,
      platform: item.platform,
      capturedAt: item.captured_at,
      tags: conversationTags,
      projectId: item.project_id
    };
  });
};

export const fetchConversationById = async (id: string): Promise<Conversation | null> => {
  // Fetch the conversation
  const { data: conversation, error: conversationError } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', id)
    .single();

  if (conversationError) {
    if (conversationError.code === 'PGRST116') {
      return null; // Not found
    }
    throw conversationError;
  }

  if (!conversation) return null;

  // Fetch tags for this conversation
  const { data: tagRelations, error: tagRelationsError } = await supabase
    .from('conversation_tags')
    .select('tag_id')
    .eq('conversation_id', id);

  if (tagRelationsError) throw tagRelationsError;

  // Fetch all tag details
  let tags: Tag[] = [];
  if (tagRelations && tagRelations.length > 0) {
    const tagIds = tagRelations.map(rel => rel.tag_id);
    
    const { data: tagsData, error: tagsError } = await supabase
      .from('tags')
      .select('*')
      .in('id', tagIds);
      
    if (tagsError) throw tagsError;
    if (tagsData) {
      tags = tagsData.map(tag => ({
        id: tag.id,
        name: tag.name,
        color: tag.color
      }));
    }
  }

  return {
    id: conversation.id,
    title: conversation.title,
    content: conversation.content,
    platform: conversation.platform,
    capturedAt: conversation.captured_at,
    tags,
    projectId: conversation.project_id
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
  if (!data) throw new Error('Failed to create conversation');

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
  const updatedData: Record<string, any> = {};
  
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
  if (!data) return [];

  return data.map((item) => ({
    id: item.id,
    name: item.name,
    color: item.color
  }));
};

export const createTag = async (tag: { name: string; color: string }): Promise<Tag> => {
  // Get the current user session
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) throw sessionError;
  if (!sessionData.session || !sessionData.session.user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('tags')
    .insert([
      {
        name: tag.name,
        color: tag.color,
        user_id: sessionData.session.user.id
      }
    ])
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to create tag');

  return {
    id: data.id,
    name: data.name,
    color: data.color
  };
};

// Tag assignment API
export const assignTagToConversation = async (conversationId: string, tagId: string): Promise<void> => {
  const { error } = await supabase
    .from('conversation_tags')
    .insert([
      {
        conversation_id: conversationId,
        tag_id: tagId
      }
    ]);

  if (error) throw error;
};

export const removeTagFromConversation = async (conversationId: string, tagId: string): Promise<void> => {
  const { error } = await supabase
    .from('conversation_tags')
    .delete()
    .eq('conversation_id', conversationId)
    .eq('tag_id', tagId);

  if (error) throw error;
};
