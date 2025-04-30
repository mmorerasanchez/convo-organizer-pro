
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useFrameworks() {
  return useQuery({
    queryKey: ['frameworks'],
    queryFn: async () => {
      try {
        const { data: frameworks, error } = await supabase
          .from('frameworks')
          .select('*');
          
        if (error) throw error;
        
        return frameworks;
      } catch (error) {
        toast.error("Failed to load frameworks");
        console.error("Error loading frameworks:", error);
        return [];
      }
    }
  });
}

export function useFrameworkFields(frameworkId: string | null) {
  return useQuery({
    queryKey: ['frameworkFields', frameworkId],
    queryFn: async () => {
      if (!frameworkId) return [];
      
      try {
        const { data: fields, error } = await supabase
          .from('framework_fields')
          .select('*')
          .eq('framework_id', frameworkId)
          .order('ordinal', { ascending: true });
          
        if (error) throw error;
        
        return fields;
      } catch (error) {
        toast.error("Failed to load framework fields");
        console.error("Error loading framework fields:", error);
        return [];
      }
    },
    enabled: !!frameworkId
  });
}

export function useModels() {
  return useQuery({
    queryKey: ['models'],
    queryFn: async () => {
      try {
        const { data: models, error } = await supabase
          .from('models')
          .select('*');
          
        if (error) throw error;
        
        return models;
      } catch (error) {
        toast.error("Failed to load models");
        console.error("Error loading models:", error);
        return [];
      }
    }
  });
}
