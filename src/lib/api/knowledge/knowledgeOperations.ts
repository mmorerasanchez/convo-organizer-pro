
import { supabase } from "@/integrations/supabase/client";
import { Knowledge } from "@/lib/types";
import { mapKnowledgeData } from "./utils";

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

    console.log('Starting knowledge creation process', { projectId, title, fileSize: file.size });

    // 1. Upload file to storage
    const filePath = `${projectId}/${crypto.randomUUID()}-${file.name}`;
    
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

    // 2. Create knowledge entry in the database
    const { data, error } = await supabase
      .from('knowledge')
      .insert({
        title,
        description,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        file_name: file.name,
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
    console.log('Updating knowledge entry:', { id, title });
    const { data, error } = await supabase
      .from('knowledge')
      .update({
        title,
        description,
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
