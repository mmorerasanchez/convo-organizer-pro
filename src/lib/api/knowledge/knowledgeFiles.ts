
import { supabase } from "@/integrations/supabase/client";

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
