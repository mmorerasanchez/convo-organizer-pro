
import { supabase } from '@/integrations/supabase/client';
import { Tool } from '../types';

// Tools API
export const fetchTools = async (): Promise<Tool[]> => {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return data.map((tool) => ({
    id: tool.id,
    name: tool.name,
    model: tool.model,
    score: tool.score,
    description: tool.description || '',
    createdAt: tool.created_at,
    updatedAt: tool.updated_at,
  }));
};

export const fetchToolById = async (id: string): Promise<Tool | null> => {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
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
    model: data.model,
    score: data.score,
    description: data.description || '',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

export const createTool = async (tool: {
  name: string;
  model: string;
  score: number;
  description?: string;
}): Promise<Tool> => {
  // Get the current user session
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) throw sessionError;
  if (!sessionData.session || !sessionData.session.user) {
    throw new Error('User not authenticated');
  }
  
  const userId = sessionData.session.user.id;
  
  const { data, error } = await supabase
    .from('tools')
    .insert([
      {
        name: tool.name,
        model: tool.model,
        score: tool.score,
        description: tool.description || '',
        user_id: userId
      }
    ])
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to create tool');

  return {
    id: data.id,
    name: data.name,
    model: data.model,
    score: data.score,
    description: data.description || '',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

export const updateTool = async (
  id: string,
  updates: { 
    name?: string; 
    model?: string; 
    score?: number; 
    description?: string;
  }
): Promise<void> => {
  const { error } = await supabase
    .from('tools')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
};

export const deleteTool = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('tools')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
