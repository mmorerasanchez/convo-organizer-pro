
import React, { useState } from 'react';
import { Tag } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { assignTagToConversation, createTag, fetchTags, removeTagFromConversation } from '@/lib/api';
import { toast } from '@/lib/utils/toast';

interface TagManagementProps {
  conversationId: string;
  assignedTags: Tag[];
}

const TagManagement: React.FC<TagManagementProps> = ({ conversationId, assignedTags }) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('bg-blue-100 text-blue-800');
  const [isCreateTagDialogOpen, setIsCreateTagDialogOpen] = useState(false);
  
  const queryClient = useQueryClient();
  
  // Fetch available tags
  const { data: availableTags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags
  });
  
  // Filter out already assigned tags
  const unassignedTags = availableTags.filter(
    tag => !assignedTags.some(assignedTag => assignedTag.id === tag.id)
  );
  
  // Create tag mutation
  const createTagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      toast.success('Tag created successfully');
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      setNewTagName('');
      setIsCreateTagDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Error creating tag: ${error.message}`);
    }
  });
  
  // Assign tag mutation
  const assignTagMutation = useMutation({
    mutationFn: (tagId: string) => assignTagToConversation(conversationId, tagId),
    onSuccess: () => {
      toast.success('Tag assigned successfully');
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
      setIsAddingTag(false);
    },
    onError: (error: Error) => {
      toast.error(`Error assigning tag: ${error.message}`);
    }
  });
  
  // Remove tag mutation
  const removeTagMutation = useMutation({
    mutationFn: (tagId: string) => removeTagFromConversation(conversationId, tagId),
    onSuccess: () => {
      toast.success('Tag removed successfully');
      queryClient.invalidateQueries({ queryKey: ['conversation', conversationId] });
    },
    onError: (error: Error) => {
      toast.error(`Error removing tag: ${error.message}`);
    }
  });
  
  const handleCreateTag = (e: React.FormEvent) => {
    e.preventDefault();
    createTagMutation.mutate({
      name: newTagName.trim(),
      color: newTagColor
    });
  };
  
  const handleAssignTag = (tagId: string) => {
    assignTagMutation.mutate(tagId);
  };
  
  const handleRemoveTag = (tagId: string) => {
    removeTagMutation.mutate(tagId);
  };
  
  const colorOptions = [
    { value: 'bg-blue-100 text-blue-800', label: 'Blue' },
    { value: 'bg-green-100 text-green-800', label: 'Green' },
    { value: 'bg-purple-100 text-purple-800', label: 'Purple' },
    { value: 'bg-red-100 text-red-800', label: 'Red' },
    { value: 'bg-orange-100 text-orange-800', label: 'Orange' },
    { value: 'bg-yellow-100 text-yellow-800', label: 'Yellow' },
    { value: 'bg-pink-100 text-pink-800', label: 'Pink' },
    { value: 'bg-indigo-100 text-indigo-800', label: 'Indigo' }
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Tags</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsAddingTag(!isAddingTag)}
          className="h-7 px-2"
        >
          {isAddingTag ? 'Done' : 
            <div className="flex items-center gap-1">
              <Plus size={14} /> Add Tags
            </div>
          }
        </Button>
      </div>
      
      {assignedTags.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {assignedTags.map(tag => (
            <div 
              key={tag.id} 
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tag.color}`}
            >
              {tag.name}
              {isAddingTag && (
                <button 
                  onClick={() => handleRemoveTag(tag.id)} 
                  className="ml-1 h-3.5 w-3.5 rounded-full flex items-center justify-center hover:bg-gray-200"
                >
                  <X size={10} />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-xs text-muted-foreground">
          No tags assigned yet
        </div>
      )}
      
      {isAddingTag && (
        <div className="mt-2 p-2 border rounded-md bg-muted/50">
          <div className="space-y-2">
            <h4 className="text-xs font-medium">Available Tags</h4>
            {unassignedTags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {unassignedTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => handleAssignTag(tag.id)}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tag.color}`}
                  >
                    <Plus size={10} className="mr-1" />
                    {tag.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                No more tags available
              </div>
            )}
            
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full mt-2"
              onClick={() => setIsCreateTagDialogOpen(true)}
            >
              <Plus size={12} className="mr-1" />
              Create New Tag
            </Button>
          </div>
        </div>
      )}
      
      {/* Create Tag Dialog */}
      <Dialog open={isCreateTagDialogOpen} onOpenChange={setIsCreateTagDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateTag}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Enter tag name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setNewTagColor(color.value)}
                      className={`h-8 rounded-md flex items-center justify-center text-xs ${
                        newTagColor === color.value ? 'ring-2 ring-primary' : ''
                      } ${color.value}`}
                    >
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={!newTagName.trim() || createTagMutation.isPending}
              >
                {createTagMutation.isPending ? 'Creating...' : 'Create Tag'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TagManagement;
