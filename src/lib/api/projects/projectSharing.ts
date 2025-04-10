
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Project } from '@/lib/types';

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

/**
 * Checks if a project exists by share link and joins it
 */
export const joinProjectByShareLink = async (shareLink: string): Promise<Project> => {
  console.log(`Attempting to join project with share link: ${shareLink}`);
  
  // Get the current user session
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) throw sessionError;
  if (!sessionData.session || !sessionData.session.user) {
    throw new Error('User not authenticated');
  }
  
  const userId = sessionData.session.user.id;
  
  // First try to find the project by share_link
  const { data: projectData, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('share_link', shareLink)
    .maybeSingle();
    
  if (projectError && projectError.code !== 'PGRST116') {
    console.error('Error finding project by share_link:', projectError);
    throw projectError;
  }
  
  // If not found by share_link, try finding by project ID directly
  // This handles cases where the user might paste a project ID instead of a share link
  if (!projectData) {
    const { data: directProject, error: directProjectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', shareLink)
      .maybeSingle();
      
    if (directProjectError && directProjectError.code !== 'PGRST116') {
      console.error('Error finding project by ID:', directProjectError);
      throw directProjectError;
    }
    
    if (!directProject) {
      console.error('Project not found with share link or ID:', shareLink);
      throw new Error('Project not found or share link is invalid');
    }
    
    console.log(`Found project by direct ID: ${directProject.id}`);
    
    // Check if the project is already shared with the user
    const { data: existingShare, error: shareCheckError } = await supabase
      .from('project_shares')
      .select('id')
      .eq('project_id', directProject.id)
      .eq('shared_with_user_id', userId)
      .maybeSingle();
      
    if (shareCheckError && shareCheckError.code !== 'PGRST116') {
      console.error('Error checking existing share:', shareCheckError);
      throw shareCheckError;
    }
    
    // If the project is not already shared with the user, create a share record
    if (!existingShare) {
      const { error: shareError } = await supabase
        .from('project_shares')
        .insert([
          {
            project_id: directProject.id,
            shared_with_user_id: userId
          }
        ]);
        
      if (shareError) {
        console.error('Error creating share record:', shareError);
        throw shareError;
      }
      
      console.log(`Successfully shared project with user: ${userId}`);
    } else {
      console.log(`Project already shared with user: ${userId}`);
    }
    
    return {
      id: directProject.id,
      name: directProject.name,
      description: directProject.description || '',
      createdAt: directProject.created_at,
      updatedAt: directProject.updated_at,
      conversationCount: 0, // We don't have this information yet
      shareLink: directProject.share_link
    };
  }
  
  console.log(`Found project with ID: ${projectData.id}`);
  
  // Check if the project is already shared with the user
  const { data: existingShare, error: shareCheckError } = await supabase
    .from('project_shares')
    .select('id')
    .eq('project_id', projectData.id)
    .eq('shared_with_user_id', userId)
    .maybeSingle();
    
  if (shareCheckError && shareCheckError.code !== 'PGRST116') {
    console.error('Error checking existing share:', shareCheckError);
    throw shareCheckError;
  }
  
  // If the project is not already shared with the user, create a share record
  if (!existingShare) {
    const { error: shareError } = await supabase
      .from('project_shares')
      .insert([
        {
          project_id: projectData.id,
          shared_with_user_id: userId
        }
      ]);
      
    if (shareError) {
      console.error('Error creating share record:', shareError);
      throw shareError;
    }
    
    console.log(`Successfully shared project with user: ${userId}`);
  } else {
    console.log(`Project already shared with user: ${userId}`);
  }
  
  // Return the project data
  return {
    id: projectData.id,
    name: projectData.name,
    description: projectData.description || '',
    createdAt: projectData.created_at,
    updatedAt: projectData.updated_at,
    conversationCount: 0, // We don't have this information yet
    shareLink: projectData.share_link
  };
};

/**
 * Extracts share ID from various URL formats or plain IDs
 */
export const extractShareId = (input: string): string => {
  // Check if it's a URL and extract the UUID from it
  let shareId = input.trim();
  
  try {
    // If it looks like a URL, try to parse it
    if (shareId.startsWith('http') || shareId.includes('/')) {
      // Try to create a URL object to parse it properly
      const url = new URL(shareId);
      
      // Get the path segments
      const pathSegments = url.pathname.split('/').filter(Boolean);
      
      // Look for 'shared' in the path to extract the UUID that follows
      const sharedIndex = pathSegments.findIndex(segment => 
        segment === 'shared' || segment === 'projects' || segment === 'project'
      );
      
      if (sharedIndex >= 0 && sharedIndex < pathSegments.length - 1) {
        // Get the segment after 'shared', 'projects', or 'project'
        shareId = pathSegments[sharedIndex + 1];
      } else {
        // If we can't find a specific pattern, just use the last segment
        shareId = pathSegments[pathSegments.length - 1];
      }
    }
    
    // Remove any trailing slashes or query params
    shareId = shareId.split('?')[0].split('#')[0].replace(/\/$/, '');
    
    console.log(`Extracted share ID: ${shareId}`);
    return shareId;
  } catch (error) {
    // If URL parsing fails, just return the trimmed input
    console.log(`URL parsing failed, using original input: ${shareId}`);
    return shareId;
  }
};
