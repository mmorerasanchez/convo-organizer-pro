
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { fetchTemplates } from '@/lib/api/templates';
import { useAuth } from '@/hooks/useAuth';
import TemplateCard from './TemplateCard';

interface TemplateLibraryProps {
  onCreateTemplate: () => void;
  searchTerm?: string;
  sortBy?: 'name' | 'created' | 'updated';
  filterBy?: string;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ 
  onCreateTemplate, 
  searchTerm = '',
  sortBy = 'name',
  filterBy = 'all'
}) => {
  const { user } = useAuth();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates,
    enabled: !!user
  });

  // Filter and sort templates
  const filteredTemplates = templates
    .filter(template => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Visibility filter
      if (filterBy === 'all') return matchesSearch;
      if (filterBy === 'my') return matchesSearch && template.visibility === 'private';
      if (filterBy === 'public') return matchesSearch && template.visibility === 'public';
      
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

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
      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center p-8 bg-muted/20 rounded-lg border border-dashed">
            <h3 className="text-lg font-medium mb-2">
              {searchTerm ? 'No templates found' : 'No templates yet'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? "Try adjusting your search criteria"
                : "Create your first template to get started"}
            </p>
          </div>
          {!searchTerm && (
            <div className="text-center">
              <Button onClick={onCreateTemplate}>
                Create Template
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TemplateLibrary;
