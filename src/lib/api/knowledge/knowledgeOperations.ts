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
    throw new Error(`Error updating knowledge: ${error.message}`);
  }

  return mapKnowledgeData(data);
};

export const deleteKnowledge = async (id: string): Promise<void> => {
  // First get the file path
  const { data: knowledgeData, error: fetchError } = await supabase
    .from('knowledge')
    .select('file_path')
    .eq('id', id)
    .single();

  if (fetchError) {
    throw new Error(`Error fetching knowledge file path: ${fetchError.message}`);
  }

  // Delete the database entry
  const { error: deleteError } = await supabase
    .from('knowledge')
    .delete()
    .eq('id', id);

  if (deleteError) {
    throw new Error(`Error deleting knowledge entry: ${deleteError.message}`);
  }

  // Delete the file from storage
  const { error: storageError } = await supabase.storage
    .from('knowledge')
    .remove([knowledgeData.file_path]);

  if (storageError) {
    console.error(`Error deleting knowledge file: ${storageError.message}`);
    // We don't throw here since the database record is already deleted
  }
};
