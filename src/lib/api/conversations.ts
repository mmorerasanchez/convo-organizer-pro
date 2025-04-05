
import { supabase } from '@/integrations/supabase/client';
import { Conversation, Tag } from '../types';
import { fetchTagsForConversations } from './tags';

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
  const conversationTags = await fetchTagsForConversations(conversationIds);

  // Map tags to conversations
  return conversationsData.map((item) => {
    // Find tags for this conversation
    const tags = conversationTags[item.id] || [];

    return {
      id: item.id,
      title: item.title,
      content: item.content,
      platform: item.platform,
      capturedAt: item.captured_at,
      tags,
      projectId: item.project_id,
      externalId: item.external_id,
      status: item.status || 'active'
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
  const conversationTags = await fetchTagsForConversations(conversationIds);

  // Map tags to conversations
  return conversationsData.map((item) => {
    // Find tags for this conversation
    const tags = conversationTags[item.id] || [];

    return {
      id: item.id,
      title: item.title,
      content: item.content,
      platform: item.platform,
      capturedAt: item.captured_at,
      tags,
      projectId: item.project_id,
      externalId: item.external_id,
      status: item.status || 'active'
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
  const conversationTags = await fetchTagsForConversations([id]);
  const tags = conversationTags[id] || [];

  return {
    id: conversation.id,
    title: conversation.title,
    content: conversation.content,
    platform: conversation.platform,
    capturedAt: conversation.captured_at,
    tags,
    projectId: conversation.project_id,
    externalId: conversation.external_id,
    status: conversation.status || 'active'
  };
};

export const createConversation = async (conversation: {
  title: string;
  content: string;
  platform: string;
  projectId: string;
  externalId?: string;
  status?: string;
}): Promise<Conversation> => {
  const { data, error } = await supabase
    .from('conversations')
    .insert([
      {
        title: conversation.title,
        content: conversation.content,
        platform: conversation.platform,
        project_id: conversation.projectId,
        external_id: conversation.externalId,
        status: conversation.status || 'active'
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
    projectId: data.project_id,
    externalId: data.external_id,
    status: data.status || 'active'
  };
};

export const updateConversation = async (
  id: string,
  updates: { 
    title?: string; 
    content?: string; 
    platform?: string; 
    projectId?: string;
    externalId?: string;
    status?: string;
  }
): Promise<void> => {
  const updatedData: Record<string, any> = {};
  
  if (updates.title) updatedData.title = updates.title;
  if (updates.content) updatedData.content = updates.content;
  if (updates.platform) updatedData.platform = updates.platform;
  if (updates.projectId) updatedData.project_id = updates.projectId;
  if (updates.externalId !== undefined) updatedData.external_id = updates.externalId;
  if (updates.status) updatedData.status = updates.status;
  
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
