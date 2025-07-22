
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { fetchTemplates, deleteTemplate } from '@/lib/api/templates';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import TemplateCard from './TemplateCard';

interface TemplateLibraryProps {
  onCreateTemplate: () => void;
  searchTerm?: string;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ 
  onCreateTemplate, 
  searchTerm = '' 
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
    enabled: !!user
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('Template deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  });

  // Filter templates based on search term
  const filteredTemplates = templates.filter(template => 
    searchTerm === '' || 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (templateId: string) => {
    deleteMutation.mutate(templateId);
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Sign in required</h3>
        <p className="text-muted-foreground">
          Please sign in to view and manage your templates
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Additional filters could go here */}
        </div>
        <Button onClick={onCreateTemplate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onDelete={handleDelete}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 grid-pattern rounded-lg">
          <h3 className="text-lg font-medium mb-2">
            {searchTerm ? 'No templates found' : 'No templates yet'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm 
              ? "Try adjusting your search criteria"
              : "Create your first template to get started"}
          </p>
          {searchTerm ? (
            <Button variant="outline" onClick={() => window.location.reload()}>
              Clear Search
            </Button>
          ) : (
            <Button onClick={onCreateTemplate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateLibrary;
