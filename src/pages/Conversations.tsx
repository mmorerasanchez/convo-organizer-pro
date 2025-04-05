
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ConversationCard from '@/components/conversations/ConversationCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, X } from 'lucide-react';
import { Tag } from '@/lib/types';
import NewConversationDialog from '@/components/conversations/NewConversationDialog';
import { useQuery } from '@tanstack/react-query';
import { fetchConversations, fetchTags } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Skeleton } from '@/components/ui/skeleton';

const Conversations = () => {
  useRequireAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  
  // Fetch conversations
  const { 
    data: conversations = [], 
    isLoading: isLoadingConversations,
    error: conversationsError
  } = useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations
  });
  
  // Fetch tags
  const { 
    data: tags = [], 
    isLoading: isLoadingTags,
    error: tagsError
  } = useQuery({
    queryKey: ['tags'],
    queryFn: fetchTags
  });
  
  const isLoading = isLoadingConversations || isLoadingTags;
  const error = conversationsError || tagsError;
  
  // Filter conversations based on search term and selected tags
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = searchTerm === '' || 
      conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.content.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => 
        conversation.tags.some(t => t.id === tag.id)
      );
      
    return matchesSearch && matchesTags;
  });
  
  const handleTagSelect = (tag: Tag) => {
    if (selectedTags.some(t => t.id === tag.id)) {
      setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-12 w-full" />
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Error loading data</h1>
          <p className="mb-4 text-red-500">{(error as Error).message}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
          <div className="hidden md:block">
            <NewConversationDialog />
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagSelect(tag)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedTags.some(t => t.id === tag.id)
                    ? tag.color + ' ring-2 ring-primary/30'
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                {tag.name}
              </button>
            ))}
            
            {(searchTerm || selectedTags.length > 0) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary hover:bg-secondary/80"
              >
                <X size={12} className="mr-1" />
                Clear filters
              </button>
            )}
          </div>
        </div>
        
        {/* Conversations grid */}
        {filteredConversations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConversations.map((conversation) => (
              <ConversationCard key={conversation.id} conversation={conversation} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 grid-pattern rounded-lg">
            <h3 className="text-lg font-medium mb-2">No conversations found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedTags.length > 0 
                ? "Try changing your search or filters"
                : "Start adding conversations to your projects"}
            </p>
            {searchTerm || selectedTags.length > 0 ? (
              <Button onClick={clearFilters}>Clear Filters</Button>
            ) : (
              <NewConversationDialog trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Conversation
                </Button>
              } />
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Conversations;
