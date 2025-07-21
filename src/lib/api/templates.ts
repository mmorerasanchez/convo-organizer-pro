
import { supabase } from '@/integrations/supabase/client';
import { Template } from '@/lib/types';

export const fetchTemplates = async (): Promise<Template[]> => {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }

  return (data || []) as Template[];
};

export const createTemplate = async (template: Omit<Template, 'id' | 'created_at' | 'updated_at' | 'usage_count' | 'created_by'>): Promise<Template> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Ensure framework_id is null if empty string
  const templateData = {
    ...template,
    framework_id: template.framework_id || null,
    created_by: user.id,
  };

  const { data, error } = await supabase
    .from('templates')
    .insert(templateData)
    .select()
    .single();

  if (error) {
    console.error('Error creating template:', error);
    throw error;
  }

  return data as Template;
};

export const updateTemplate = async (id: string, updates: Partial<Template>): Promise<Template> => {
  // Ensure framework_id is null if empty string
  const updateData = {
    ...updates,
    framework_id: updates.framework_id || null,
  };

  const { data, error } = await supabase
    .from('templates')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating template:', error);
    throw error;
  }

  return data as Template;
};

export const deleteTemplate = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('templates')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting template:', error);
    throw error;
  }
};

export const recordTemplateUsage = async (templateId: string, projectId?: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('template_usage')
    .insert({
      template_id: templateId,
      used_by: user.id,
      project_id: projectId,
      used_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error recording template usage:', error);
    throw error;
  }

  // Update usage count
  const { data: currentTemplate } = await supabase
    .from('templates')
    .select('usage_count')
    .eq('id', templateId)
    .single();

  if (currentTemplate) {
    await supabase
      .from('templates')
      .update({ usage_count: currentTemplate.usage_count + 1 })
      .eq('id', templateId);
  }
};
