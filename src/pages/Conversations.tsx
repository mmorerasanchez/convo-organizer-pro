
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ConversationCard from '@/components/conversations/ConversationCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tag } from '@/lib/types';
import NewConversationDialog from '@/components/conversations/NewConversationDialog';
import ConversationsControlBar from '@/components/conversations/ConversationsControlBar';
import { useQuery } from '@tanstack/react-query';
import { fetchConversations, fetchTags } from '@/lib/api';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Skeleton } from '@/components/ui/skeleton';
import PageHeader from '@/components/common/PageHeader';

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
          <Skeleton className="h-24 w-full" />
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
        {/* Standardized Header */}
        <PageHeader 
          title="Conversations"
          description="Organize and manage your AI conversations with projects and tags"
          showSearch={true}
          searchPlaceholder="Search conversations..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        {/* Control Bar with filters and actions */}
        <ConversationsControlBar
          tags={tags}
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
          clearFilters={clearFilters}
          searchTerm={searchTerm}
        />
        
        {/* Conversations grid */}
        {filteredConversations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConversations.map((conversation) => (
              <ConversationCard key={conversation.id} conversation={conversation} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center p-8 bg-muted/20 rounded-lg border border-dashed">
              <p className="text-muted-foreground">
                {searchTerm || selectedTags.length > 0 
                  ? "No conversations found"
                  : "No conversations found. Create a project first to get started"}
              </p>
            </div>
            {searchTerm || selectedTags.length > 0 ? (
              <div className="text-center">
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className="text-center">
                <NewConversationDialog trigger={
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Conversation
                  </Button>
                } />
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Conversations;
