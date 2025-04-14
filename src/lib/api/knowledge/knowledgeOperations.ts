
import { supabase } from "@/integrations/supabase/client";
import { Knowledge } from "@/lib/types";
import { mapKnowledgeData } from "./utils";
import { toast } from "sonner";

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;
// Allowed file types
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv',
  'application/json',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/gif'
];

export const addKnowledge = async (
  projectId: string,
  title: string,
  description: string | null,
  file: File
): Promise<Knowledge> => {
  try {
    // Check authentication first
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Authentication required to upload files');
    }

    // Input validation
    if (!title.trim()) {
      throw new Error('Title is required');
    }
    
    if (!projectId.trim()) {
      throw new Error('Project ID is required');
    }

    // File validation
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds the maximum allowed size (${MAX_FILE_SIZE / (1024 * 1024)}MB)`);
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error(`File type '${file.type}' is not supported. Please upload an allowed file type.`);
    }

    console.log('Starting knowledge creation process', { projectId, title, fileSize: file.size, fileType: file.type });

    // 1. Upload file to storage
    const filePath = `${projectId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-_]/g, '_')}`;
    
    console.log('Uploading file to storage path:', filePath);
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('knowledge')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('File upload error:', uploadError);
      throw new Error(`Error uploading file: ${uploadError.message}`);
    }

    console.log('File uploaded successfully:', uploadData);

    // 2. Create knowledge entry in the database - sanitize inputs
    const { data, error } = await supabase
      .from('knowledge')
      .insert({
        title: title.trim(),
        description: description ? description.trim() : null,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        file_name: file.name.replace(/[^a-zA-Z0-9.-_]/g, '_'),
        project_id: projectId
      })
      .select()
      .single();

    if (error) {
      // Attempt to clean up the uploaded file if database insertion fails
      console.error('Database insertion error:', error);
      await supabase.storage.from('knowledge').remove([filePath]);
      throw new Error(`Error creating knowledge entry: ${error.message}`);
    }

    console.log('Knowledge entry created successfully:', data);
    return mapKnowledgeData(data);
  } catch (error) {
    console.error('Knowledge creation error:', error);
    throw error;
  }
};

export const updateKnowledge = async (
  id: string,
  title: string,
  description: string | null
): Promise<Knowledge> => {
  try {
    // Check authentication first
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Authentication required to update knowledge entries');
    }

    // Input validation
    if (!title.trim()) {
      throw new Error('Title is required');
    }
    
    if (!id.trim()) {
      throw new Error('Knowledge ID is required');
    }
    
    console.log('Updating knowledge entry:', { id, title });
    const { data, error } = await supabase
      .from('knowledge')
      .update({
        title: title.trim(),
        description: description ? description.trim() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Knowledge update error:', error);
      throw new Error(`Error updating knowledge: ${error.message}`);
    }

    console.log('Knowledge entry updated successfully:', data);
    return mapKnowledgeData(data);
  } catch (error) {
    console.error('Knowledge update error:', error);
    throw error;
  }
};

export const deleteKnowledge = async (id: string): Promise<void> => {
  try {
    // Check authentication first
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Authentication required to delete knowledge entries');
    }

    if (!id.trim()) {
      throw new Error('Knowledge ID is required');
    }
    
    // First get the file path
    console.log('Fetching knowledge entry for deletion:', id);
    const { data: knowledgeData, error: fetchError } = await supabase
      .from('knowledge')
      .select('file_path')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching knowledge file path:', fetchError);
      throw new Error(`Error fetching knowledge file path: ${fetchError.message}`);
    }

    // Delete the database entry
    console.log('Deleting knowledge entry from database:', id);
    const { error: deleteError } = await supabase
      .from('knowledge')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting knowledge entry:', deleteError);
      throw new Error(`Error deleting knowledge entry: ${deleteError.message}`);
    }

    // Delete the file from storage
    console.log('Deleting file from storage:', knowledgeData.file_path);
    const { error: storageError } = await supabase.storage
      .from('knowledge')
      .remove([knowledgeData.file_path]);

    if (storageError) {
      console.error(`Error deleting knowledge file: ${storageError.message}`);
      // We don't throw here since the database record is already deleted
    }
    
    console.log('Knowledge entry and file deleted successfully');
  } catch (error) {
    console.error('Knowledge deletion error:', error);
    throw error;
  }
};
