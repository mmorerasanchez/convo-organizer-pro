
import { supabase } from '@/integrations/supabase/client';
import { Tag } from '../types';

// Helper function to fetch tags for multiple conversations
export const fetchTagsForConversations = async (conversationIds: string[]): Promise<Record<string, Tag[]>> => {
  if (conversationIds.length === 0) {
    return {};
  }
  
  // Fetch tag relations
  const { data: tagRelations, error: tagRelationsError } = await supabase
    .from('conversation_tags')
    .select('conversation_id, tag_id')
    .in('conversation_id', conversationIds);

  if (tagRelationsError) throw tagRelationsError;
  if (!tagRelations || tagRelations.length === 0) {
    return conversationIds.reduce((acc, id) => ({ ...acc, [id]: [] }), {});
  }

  // Fetch all relevant tags
  const tagIds = [...new Set(tagRelations.map(rel => rel.tag_id))];
  
  const { data: tagsData, error: tagsError } = await supabase
    .from('tags')
    .select('*')
    .in('id', tagIds);
      
  if (tagsError) throw tagsError;
  if (!tagsData) {
    return conversationIds.reduce((acc, id) => ({ ...acc, [id]: [] }), {});
  }

  // Create a map of tag id to tag object for quick lookup
  const tagMap = tagsData.reduce((acc, tag) => ({
    ...acc,
    [tag.id]: {
      id: tag.id,
      name: tag.name,
      color: tag.color
    }
  }), {} as Record<string, Tag>);

  // Group tags by conversation
  const result: Record<string, Tag[]> = {};
  
  // Initialize with empty arrays for all conversations
  conversationIds.forEach(id => {
    result[id] = [];
  });
  
  // Populate with actual tags
  tagRelations.forEach(relation => {
    const tag = tagMap[relation.tag_id];
    if (tag) {
      if (!result[relation.conversation_id]) {
        result[relation.conversation_id] = [];
      }
      result[relation.conversation_id].push(tag);
    }
  });

  return result;
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
