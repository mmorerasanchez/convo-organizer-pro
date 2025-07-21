
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Framework {
  id: string;
  name: string;
  description: string;
  framework_type: 'zero-shot' | 'few-shot';
}

export interface FrameworkField {
  id: string;
  framework_id: string;
  label: string;
  ordinal: number;
  help_text: string;
}

export interface FrameworkExample {
  id: string;
  framework_id: string;
  title: string;
  content: string;
  ordinal: number;
}

export interface SystemPrompt {
  id: string;
  name: string;
  version: string;
  prompt_text: string;
  framework_type: 'scanner' | 'designer';
  active: boolean;
  performance_score?: number;
  usage_count: number;
}

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

export function useFrameworkExamples(frameworkId: string | null) {
  return useQuery({
    queryKey: ['frameworkExamples', frameworkId],
    queryFn: async () => {
      if (!frameworkId) return [];
      
      try {
        const { data: examples, error } = await supabase
          .from('framework_examples')
          .select('*')
          .eq('framework_id', frameworkId)
          .order('ordinal', { ascending: true });
          
        if (error) throw error;
        
        return examples as FrameworkExample[];
      } catch (error) {
        toast.error("Failed to load framework examples");
        console.error("Error loading framework examples:", error);
        return [];
      }
    },
    enabled: !!frameworkId
  });
}

export function useSystemPrompts(frameworkType?: 'scanner' | 'designer') {
  return useQuery({
    queryKey: ['systemPrompts', frameworkType],
    queryFn: async () => {
      try {
        let query = supabase
          .from('system_prompts')
          .select('*')
          .eq('active', true);
          
        if (frameworkType) {
          query = query.eq('framework_type', frameworkType);
        }
          
        const { data: prompts, error } = await query;
        
        if (error) throw error;
        
        return prompts as SystemPrompt[];
      } catch (error) {
        toast.error("Failed to load system prompts");
        console.error("Error loading system prompts:", error);
        return [];
      }
    }
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
