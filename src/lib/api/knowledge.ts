
import { supabase } from "@/integrations/supabase/client";
import { Knowledge } from "@/lib/types";

export const fetchKnowledgeByProjectId = async (projectId: string): Promise<Knowledge[]> => {
  const { data, error } = await supabase
    .from('knowledge')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching knowledge: ${error.message}`);
  }

  return data.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    filePath: item.file_path,
    fileType: item.file_type,
    fileSize: item.file_size,
    fileName: item.file_name,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    projectId: item.project_id
  }));
};

export const fetchKnowledgeById = async (id: string): Promise<Knowledge> => {
  const { data, error } = await supabase
    .from('knowledge')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Error fetching knowledge item: ${error.message}`);
  }

  if (!data) {
    throw new Error('Knowledge item not found');
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    filePath: data.file_path,
    fileType: data.file_type,
    fileSize: data.file_size,
    fileName: data.file_name,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    projectId: data.project_id
  };
};

export const addKnowledge = async (
  projectId: string,
  title: string,
  description: string | null,
  file: File
): Promise<Knowledge> => {
  // 1. Upload file to storage
  const filePath = `${projectId}/${crypto.randomUUID()}-${file.name}`;
  
  const { error: uploadError } = await supabase.storage
    .from('knowledge')
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(`Error uploading file: ${uploadError.message}`);
  }

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
    await supabase.storage.from('knowledge').remove([filePath]);
    throw new Error(`Error creating knowledge entry: ${error.message}`);
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    filePath: data.file_path,
    fileType: data.file_type,
    fileSize: data.file_size,
    fileName: data.file_name,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    projectId: data.project_id
  };
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

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    filePath: data.file_path,
    fileType: data.file_type,
    fileSize: data.file_size,
    fileName: data.file_name,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    projectId: data.project_id
  };
};

export const deleteKnowledge = async (id: string): Promise<void> => {
  // First get the file path
  const { data: knowledgeData, error: fetchError } = await supabase
    .from('knowledge')
    .select('file_path')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Error fetching knowledge file path: ${fetchError.message}`);
  }

  if (!knowledgeData) {
    throw new Error('Knowledge item not found');
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

export const getKnowledgeFileUrl = async (filePath: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('knowledge')
    .createSignedUrl(filePath, 3600); // URL valid for 1 hour

  if (error) {
    throw new Error(`Error generating file URL: ${error.message}`);
  }

  return data.signedUrl;
};

export const downloadKnowledgeFile = async (filePath: string, fileName: string): Promise<void> => {
  const { data, error } = await supabase.storage
    .from('knowledge')
    .download(filePath);

  if (error) {
    throw new Error(`Error downloading file: ${error.message}`);
  }

  // Create a download link
  const url = URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
