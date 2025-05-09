
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/lib/types';
import { extractShareId } from './shareUtils';

/**
 * Checks if a project exists by share link and joins it
 */
export const joinProjectByShareLink = async (shareLink: string): Promise<Project> => {
  console.log(`Attempting to join project with share link: ${shareLink}`);
  
  if (!shareLink || shareLink.trim() === '' || shareLink.trim() === 'shared') {
    throw new Error('Invalid project share link provided');
  }
  
  // Get the current user session
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) throw sessionError;
  if (!sessionData.session || !sessionData.session.user) {
    throw new Error('User not authenticated');
  }
  
  const userId = sessionData.session.user.id;
  
  try {
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
        shareLink: directProject.share_link,
        status: directProject.status || 'active' // Add status field
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
      shareLink: projectData.share_link,
      status: projectData.status || 'active' // Add status field
    };
  } catch (error) {
    console.error('Error in joinProjectByShareLink:', error);
    throw error;
  }
};
