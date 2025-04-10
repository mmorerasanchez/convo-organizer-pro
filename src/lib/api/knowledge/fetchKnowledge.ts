
import { supabase } from "@/integrations/supabase/client";
import { Knowledge } from "@/lib/types";
import { mapKnowledgeData } from "./utils";

export const fetchKnowledgeByProjectId = async (projectId: string): Promise<Knowledge[]> => {
  const { data, error } = await supabase
    .from('knowledge')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching knowledge: ${error.message}`);
  }

  return data.map(mapKnowledgeData);
};

export const fetchKnowledgeCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('knowledge')
    .select('*', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Error fetching knowledge count: ${error.message}`);
  }

  return count || 0;
};

export const fetchKnowledgeById = async (id: string): Promise<Knowledge> => {
  const { data, error } = await supabase
    .from('knowledge')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Error fetching knowledge item: ${error.message}`);
  }

  return mapKnowledgeData(data);
};
