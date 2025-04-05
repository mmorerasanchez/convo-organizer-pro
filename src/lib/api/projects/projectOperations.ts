
import { supabase } from '@/integrations/supabase/client';
import { Project } from '../../types';

/**
 * Creates a new project
 */
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
  
  const userId = sessionData.session.user.id;
  
  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        name: project.name,
        description: project.description,
        user_id: userId
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Project creation error:', error);
    throw error;
  }
  
  if (!data) throw new Error('Failed to create project');

  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    conversationCount: 0,
    shareLink: data.share_link
  };
};

/**
 * Updates a project's details
 */
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

/**
 * Deletes a project
 */
export const deleteProject = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
