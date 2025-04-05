
import { supabase } from '@/integrations/supabase/client';

/**
 * Generates a share link for a project
 */
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

/**
 * Shares a project with another user by email
 */
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
