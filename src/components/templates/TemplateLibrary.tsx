import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTemplates } from '@/lib/api/templates';
import { Template } from '@/lib/types';
import TemplateCard from './TemplateCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, SlidersHorizontal, X, Plus, FileCode } from 'lucide-react';

interface TemplateLibraryProps {
  onCreateTemplate?: () => void;
}

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onCreateTemplate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'name' | 'usage'>('updated');

  const { data: templates = [], isLoading, error } = useQuery({
    queryKey: ['templates'],
    queryFn: fetchTemplates
  });

  const tags = ['Research', 'Content Creation', 'Analysis', 'Customer Support', 'Development', 'Custom'];

  // Filter and sort templates
  const filteredTemplates = templates
    .filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesTag = selectedTag === 'all' || template.tag === selectedTag;
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'usage':
          return b.usage_count - a.usage_count;
        default:
          return 0;
      }
    });

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedTag('all');
    setSortBy('updated');
  };

  const hasActiveFilters = searchTerm || selectedTag !== 'all' || sortBy !== 'updated';

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-section">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive">Error loading templates. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-section">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tag filter */}
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-full sm:w-48">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tags</SelectItem>
              {tags.map(tag => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value: 'updated' | 'name' | 'usage') => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Recently updated</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="usage">Most used</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={resetFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear filters
            </Button>
          )}
        </div>

        {/* Create template button */}
        <Button onClick={onCreateTemplate} className="whitespace-nowrap">
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Results count and active filters */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}</span>
        {selectedTag !== 'all' && (
          <Badge variant="secondary" className="text-xs">
            {selectedTag}
          </Badge>
        )}
      </div>

      {/* Templates grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <FileCode className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {searchTerm || selectedTag !== 'all' ? 'No templates found' : 'No templates yet'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedTag !== 'all' 
              ? 'Try adjusting your search or filters.' 
              : 'Create your first template to get started.'
            }
          </p>
          {(!searchTerm && selectedTag === 'all') && (
            <Button onClick={onCreateTemplate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-section">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateLibrary;