
import { supabase } from "@/integrations/supabase/client";

export const getKnowledgeFileUrl = async (filePath: string): Promise<string> => {
  try {
    // Validate input
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('Invalid file path provided');
    }
    
    console.log('Getting signed URL for file:', filePath);
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('Authentication required to access files');
      throw new Error('Authentication required to access files');
    }
    
    const { data, error } = await supabase.storage
      .from('knowledge')
      .createSignedUrl(filePath, 3600); // URL valid for 1 hour

    if (error) {
      console.error('Error generating file URL:', error);
      throw new Error(`Error generating file URL: ${error.message}`);
    }

    console.log('Generated signed URL successfully');
    return data.signedUrl;
  } catch (error) {
    console.error('Get file URL error:', error);
    throw error;
  }
};

export const downloadKnowledgeFile = async (filePath: string, fileName: string): Promise<void> => {
  try {
    // Validate inputs
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('Invalid file path provided');
    }
    
    if (!fileName || typeof fileName !== 'string') {
      throw new Error('Invalid file name provided');
    }
    
    console.log('Downloading file:', filePath);
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('Authentication required to download files');
      throw new Error('Authentication required to download files');
    }
    
    const { data, error } = await supabase.storage
      .from('knowledge')
      .download(filePath);

    if (error) {
      console.error('File download error:', error);
      throw new Error(`Error downloading file: ${error.message}`);
    }

    // Create a download link with sanitized filename
    const url = URL.createObjectURL(data);
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-_]/g, '_');
    const link = document.createElement('a');
    link.href = url;
    link.download = sanitizedFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log('File downloaded successfully');
  } catch (error) {
    console.error('Download file error:', error);
    throw error;
  }
};
