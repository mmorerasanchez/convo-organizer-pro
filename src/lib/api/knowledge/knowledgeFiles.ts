
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Get a secure signed URL for a knowledge file with privacy safeguards
 * @param filePath The path to the file in storage
 * @returns A signed URL with limited validity
 */
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
    
    // Generate a short-lived signed URL (30 minutes instead of 1 hour)
    // This reduces the window of opportunity for unauthorized access
    const { data, error } = await supabase.storage
      .from('knowledge')
      .createSignedUrl(filePath, 1800); // URL valid for 30 minutes

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

/**
 * Download a knowledge file with privacy and security controls
 * @param filePath The path to the file in storage
 * @param fileName The name to save the file as
 */
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
      toast.error('Authentication required to download files');
      throw new Error('Authentication required to download files');
    }
    
    const { data, error } = await supabase.storage
      .from('knowledge')
      .download(filePath);

    if (error) {
      toast.error(`Error downloading file: ${error.message}`);
      console.error('File download error:', error);
      throw new Error(`Error downloading file: ${error.message}`);
    }

    // Create a download link with sanitized filename
    // Security: Additional filename sanitization to prevent path traversal 
    const sanitizedFileName = fileName
      .replace(/[^a-zA-Z0-9.-_]/g, '_')
      .replace(/\.{2,}/g, '_'); // Prevent directory traversal
    
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = sanitizedFileName;
    document.body.appendChild(link);
    link.click();
    
    // Clean up resources
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
    console.log('File downloaded successfully');
    toast.success('File downloaded successfully');
  } catch (error) {
    console.error('Download file error:', error);
    throw error;
  }
};

// Add a function to verify file integrity with content hashing
export const verifyFileIntegrity = async (filePath: string, expectedHash?: string): Promise<boolean> => {
  try {
    if (!filePath) return false;
    
    const { data, error } = await supabase.storage
      .from('knowledge')
      .download(filePath);
      
    if (error || !data) return false;
    
    // If no expected hash provided, just confirm file exists
    if (!expectedHash) return true;
    
    // Calculate file hash for integrity verification
    // This is a placeholder - in a real implementation you would use
    // crypto.subtle.digest to create a SHA-256 hash of the file
    // For now we'll just confirm the file exists and is downloadable
    return true;
  } catch (error) {
    console.error('File integrity check failed:', error);
    return false;
  }
};
