
import { supabase } from '@/integrations/supabase/client';
import { Project } from '../types';

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
