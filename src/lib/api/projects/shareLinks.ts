
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
 * Create a short code for sharing projects
 * This is an alternative to UUID-based sharing
 */
export const generateShortShareCode = async (projectId: string): Promise<string> => {
  // Get the current user session
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) throw sessionError;
  if (!sessionData.session || !sessionData.session.user) {
    throw new Error('User not authenticated');
  }
  
  // First check if the user owns this project
  const { data: projectData, error: projectError } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('user_id', sessionData.session.user.id)
    .single();
    
  if (projectError) throw projectError;
  if (!projectData) throw new Error('Project not found or not owned by you');
  
  // Generate a random 8-character alphanumeric code
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shareCode = '';
  for (let i = 0; i < 8; i++) {
    shareCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  // Save the share code in the projects table
  const { error: updateError } = await supabase
    .from('projects')
    .update({ share_link: shareCode })
    .eq('id', projectId);
    
  if (updateError) throw updateError;
  
  return shareCode;
};
