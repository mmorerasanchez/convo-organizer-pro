
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
    conversationCount: project.conversations?.[0]?.count || 0,
    shareLink: project.share_link
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
    conversationCount: data.conversations?.[0]?.count || 0,
    shareLink: data.share_link
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

export const generateShareLink = async (projectId: string): Promise<string> => {
  // Get the current user session
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) throw sessionError;
  if (!sessionData.session || !sessionData.session.user) {
    throw new Error('User not authenticated');
  }
  
  // First check if the user owns this project
  const { data: projectData, error: projectError } = await supabase
    .from('projects')
    .select('id, share_link')
    .eq('id', projectId)
    .eq('user_id', sessionData.session.user.id)
    .single();
    
  if (projectError) throw projectError;
  if (!projectData) throw new Error('Project not found or not owned by you');
  
  // If share_link doesn't exist, generate a new one
  if (!projectData.share_link) {
    const newShareLink = crypto.randomUUID();
    
    const { error: updateError } = await supabase
      .from('projects')
      .update({ share_link: newShareLink })
      .eq('id', projectId);
      
    if (updateError) throw updateError;
    
    return newShareLink;
  }
  
  return projectData.share_link;
};

export const shareProjectWithUser = async (projectId: string, email: string): Promise<void> => {
  // Get the user ID for the email
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();
    
  if (userError) {
    if (userError.code === 'PGRST116') {
      throw new Error('User not found');
    }
    throw userError;
  }
  
  if (!userData) throw new Error('User not found');
  
  // Add share record
  const { error } = await supabase
    .from('project_shares')
    .insert([
      {
        project_id: projectId,
        shared_with_user_id: userData.id
      }
    ]);
    
  if (error) {
    // Check if it's a duplicate
    if (error.code === '23505') {
      throw new Error('Project already shared with this user');
    }
    throw error;
  }
};

export const getSharedProjects = async (): Promise<Project[]> => {
  // First get projects that are shared with the current user
  const { data: sharedData, error: sharedError } = await supabase
    .from('project_shares')
    .select(`
      project_id,
      project:projects(
        id, name, description, created_at, updated_at, 
        conversations(count)
      )
    `)
    .order('created_at', { ascending: false });
    
  if (sharedError) throw sharedError;
  if (!sharedData) return [];
  
  return sharedData.map(item => ({
    id: item.project.id,
    name: item.project.name,
    description: item.project.description || '',
    createdAt: item.project.created_at,
    updatedAt: item.project.updated_at,
    conversationCount: item.project.conversations?.[0]?.count || 0,
    shareLink: undefined
  }));
};
