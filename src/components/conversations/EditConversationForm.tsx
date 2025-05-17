
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { Conversation, Project, AIModel } from '@/lib/types';
import { PlatformSelector } from './form-fields/PlatformSelector';
import { ProjectSelector } from './form-fields/ProjectSelector';
import { ConversationTypeSelector } from './form-fields/ConversationTypeSelector';
import { ModelSelector } from './form-fields/ModelSelector';
import { StatusSelector } from './form-fields/StatusSelector';

interface EditConversationFormProps {
  title: string;
  setTitle: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  platform: string;
  setPlatform: (value: string) => void;
  projectId: string;
  setProjectId: (value: string) => void;
  externalId: string;
  setExternalId: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  type: 'input' | 'output';
  setType: (value: 'input' | 'output') => void;
  modelId: string;
  setModelId: (value: string) => void;
  projects: Project[];
  models: AIModel[];
  isPending: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

const EditConversationForm: React.FC<EditConversationFormProps> = ({
  title,
  setTitle,
  content,
  setContent,
  platform,
  setPlatform,
  projectId,
  setProjectId,
  externalId,
  setExternalId,
  status,
  setStatus,
  type,
  setType,
  modelId,
  setModelId,
  projects,
  models,
  isPending,
  handleSubmit
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          value={projectId} 
          onChange={setProjectId}
          projects={projects}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <ConversationTypeSelector value={type} onChange={setType} />
        <ModelSelector value={modelId} onChange={setModelId} models={models} />
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
      
      <DialogFooter>
        <Button 
          type="submit" 
          disabled={
            isPending || 
            !title.trim() || 
            !content.trim() || 
            !projectId
          }
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default EditConversationForm;
