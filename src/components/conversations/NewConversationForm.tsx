
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlatformSelector } from './form-fields/PlatformSelector';
import { ProjectSelector } from './form-fields/ProjectSelector';
import { ConversationTypeSelector } from './form-fields/ConversationTypeSelector';
import { ModelSelector } from './form-fields/ModelSelector';
import { StatusSelector } from './form-fields/StatusSelector';
import { useNewConversation } from './useNewConversation';

interface NewConversationFormProps {
  projectId?: string;
  onSuccess?: () => void;
}

export const NewConversationForm: React.FC<NewConversationFormProps> = ({ 
  projectId,
  onSuccess 
}) => {
  const {
    title,
    setTitle,
    content,
    setContent,
    platform,
    setPlatform,
    selectedProjectId,
    setSelectedProjectId,
    externalId,
    setExternalId,
    status,
    setStatus,
    type,
    setType,
    selectedModelId,
    setSelectedModelId,
    projects,
    models,
    isPending,
    handleSubmit
  } = useNewConversation({ projectId });

  const onSubmitWithCallback = (e: React.FormEvent) => {
    handleSubmit(e);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={onSubmitWithCallback} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter conversation title"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <PlatformSelector value={platform} onChange={setPlatform} />
        <ProjectSelector 
          value={selectedProjectId} 
          onChange={setSelectedProjectId}
          projects={projects}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <ConversationTypeSelector value={type} onChange={setType} />
        <ModelSelector value={selectedModelId} onChange={setSelectedModelId} models={models} />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="externalId">External ID</Label>
          <Input
            id="externalId"
            value={externalId}
            onChange={(e) => setExternalId(e.target.value)}
            placeholder="External conversation ID"
          />
        </div>
        
        <StatusSelector value={status} onChange={setStatus} />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Conversation Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste the conversation content here"
          rows={5}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={
          isPending || 
          !title.trim() || 
          !content.trim() || 
          !selectedProjectId
        }
      >
        {isPending ? 'Adding...' : 'Add Conversation'}
      </Button>
    </form>
  );
};
