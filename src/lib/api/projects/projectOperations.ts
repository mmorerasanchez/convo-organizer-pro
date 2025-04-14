
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
  
  if (sessionError) {
    console.error('Session error:', sessionError);
    throw sessionError;
  }
  
  if (!sessionData.session || !sessionData.session.user) {
    console.error('Authentication required to create a project');
    throw new Error('User not authenticated');
  }
  
  // Input validation
  if (!project.name || !project.name.trim()) {
    throw new Error('Project name is required');
  }
  
  const userId = sessionData.session.user.id;
  
  // Sanitize inputs
  const sanitizedName = project.name.trim();
  const sanitizedDescription = project.description ? project.description.trim() : '';
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          name: sanitizedName,
          description: sanitizedDescription,
          user_id: userId
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Project creation error:', error);
      throw error;
    }
    
    if (!data) {
      console.error('Failed to create project: No data returned');
      throw new Error('Failed to create project');
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      conversationCount: 0,
      shareLink: data.share_link
    };
  } catch (error) {
    console.error('Project operation error:', error);
    throw error;
  }
};

/**
 * Updates a project's details
 */
export const updateProject = async (
  id: string,
  updates: { name?: string; description?: string }
): Promise<void> => {
  // Get the current user session
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error('Session error:', sessionError);
    throw sessionError;
  }
  
  if (!sessionData.session || !sessionData.session.user) {
    console.error('Authentication required to update a project');
    throw new Error('User not authenticated');
  }
  
  // Input validation
  if (!id || !id.trim()) {
    throw new Error('Project ID is required');
  }
  
  if (updates.name !== undefined && !updates.name.trim()) {
    throw new Error('Project name cannot be empty');
  }
  
  // Sanitize inputs
  const sanitizedUpdates: Record<string, string> = {};
  
  if (updates.name !== undefined) {
    sanitizedUpdates.name = updates.name.trim();
  }
  
  if (updates.description !== undefined) {
    sanitizedUpdates.description = updates.description.trim();
  }
  
  try {
    const { error } = await supabase
      .from('projects')
      .update(sanitizedUpdates)
      .eq('id', id);

    if (error) {
      console.error('Project update error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Project update operation error:', error);
    throw error;
  }
};

/**
 * Deletes a project
 */
export const deleteProject = async (id: string): Promise<void> => {
  // Get the current user session
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error('Session error:', sessionError);
    throw sessionError;
  }
  
  if (!sessionData.session || !sessionData.session.user) {
    console.error('Authentication required to delete a project');
    throw new Error('User not authenticated');
  }
  
  // Input validation
  if (!id || !id.trim()) {
    throw new Error('Project ID is required');
  }
  
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Project deletion error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Project deletion operation error:', error);
    throw error;
  }
};
