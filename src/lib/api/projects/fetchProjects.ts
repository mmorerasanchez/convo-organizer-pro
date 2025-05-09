
import { supabase } from '@/integrations/supabase/client';
import { Project } from '../../types';

/**
 * Fetches all projects for the current user
 */
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
    shareLink: project.share_link,
    status: project.status || 'active'
  }));
};

/**
 * Fetches a project by ID or share link
 */
export const fetchProjectById = async (id: string): Promise<Project | null> => {
  // First try to fetch by regular ID
  const { data, error } = await supabase
    .from('projects')
    .select('*, conversations(count)')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // If not found by ID, try to find by share_link
      const { data: sharedData, error: sharedError } = await supabase
        .from('projects')
        .select('*, conversations(count)')
        .eq('share_link', id)
        .single();
        
      if (sharedError) {
        if (sharedError.code === 'PGRST116') {
          return null; // Not found with either ID or share_link
        }
        throw sharedError;
      }
      
      if (!sharedData) return null;
      
      return {
        id: sharedData.id,
        name: sharedData.name,
        description: sharedData.description || '',
        createdAt: sharedData.created_at,
        updatedAt: sharedData.updated_at,
        conversationCount: sharedData.conversations?.[0]?.count || 0,
        shareLink: sharedData.share_link,
        status: sharedData.status || 'active'
      };
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
    shareLink: data.share_link,
    status: data.status || 'active'
  };
};

/**
 * Gets projects that are shared with the current user
 */
export const getSharedProjects = async (): Promise<Project[]> => {
  // First get projects that are shared with the current user
  const { data: sharedData, error: sharedError } = await supabase
    .from('project_shares')
    .select(`
      project_id,
      projects!inner(
        id, name, description, created_at, updated_at, status,
        conversations(count)
      )
    `)
    .order('created_at', { ascending: false });
    
  if (sharedError) throw sharedError;
  if (!sharedData || !sharedData.length) return [];
  
  return sharedData.map(item => ({
    id: item.projects.id,
    name: item.projects.name,
    description: item.projects.description || '',
    createdAt: item.projects.created_at,
    updatedAt: item.projects.updated_at,
    conversationCount: item.projects.conversations?.[0]?.count || 0,
    shareLink: undefined,
    status: item.projects.status || 'active'
  }));
};
