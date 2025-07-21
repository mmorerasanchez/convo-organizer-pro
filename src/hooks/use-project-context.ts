
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProjectContext, getContextSuggestions } from '@/lib/api/projectContext';

export interface ProjectContextData {
  summary: string;
  themes: string[];
  relevantChunks: Array<{
    content: string;
    type: 'conversation' | 'document' | 'prompt';
    similarity: number;
  }>;
}

export function useProjectContext(projectId?: string, userPrompt?: string) {
  const [contextEnabled, setContextEnabled] = useState(true);

  // Fetch project context summary
  const { data: projectContext } = useQuery({
    queryKey: ['projectContext', projectId],
    queryFn: () => getProjectContext(projectId!),
    enabled: !!projectId
  });

  // Fetch relevant context chunks based on user prompt
  const { data: contextSuggestions } = useQuery({
    queryKey: ['contextSuggestions', projectId, userPrompt],
    queryFn: () => getContextSuggestions(
      projectId!,
      userPrompt!,
      3, // limit to 3 most relevant chunks
      ['conversation', 'document', 'prompt']
    ),
    enabled: !!projectId && !!userPrompt && userPrompt.length > 10 && contextEnabled
  });

  // Format context for AI injection
  const formatContextForAI = (originalPrompt: string): string => {
    if (!projectId || !contextEnabled || !projectContext) {
      return originalPrompt;
    }

    let contextSection = "PROJECT CONTEXT:\n";
    
    // Add project summary
    if (projectContext.context_summary) {
      contextSection += `Summary: ${projectContext.context_summary}\n`;
    }

    // Add key themes
    if (projectContext.key_themes && projectContext.key_themes.length > 0) {
      contextSection += `Key Themes: ${projectContext.key_themes.join(', ')}\n`;
    }

    // Add relevant content chunks
    if (contextSuggestions && contextSuggestions.length > 0) {
      contextSection += "\nRelevant Content:\n";
      contextSuggestions.forEach((chunk: any, index: number) => {
        contextSection += `- [${chunk.content_type}] ${chunk.chunk_text.substring(0, 200)}...\n`;
      });
    }

    contextSection += "\n---\n\nUSER PROMPT:\n";
    
    return contextSection + originalPrompt;
  };

  const getContextData = (): ProjectContextData | null => {
    if (!projectContext) return null;

    return {
      summary: projectContext.context_summary || '',
      themes: projectContext.key_themes || [],
      relevantChunks: contextSuggestions?.map((chunk: any) => ({
        content: chunk.chunk_text,
        type: chunk.content_type,
        similarity: chunk.similarity
      })) || []
    };
  };

  return {
    contextEnabled,
    setContextEnabled,
    contextData: getContextData(),
    formatContextForAI,
    hasContext: !!projectContext?.context_summary,
    isContextStale: projectContext ? 
      (new Date().getTime() - new Date(projectContext.updated_at).getTime()) > (30 * 24 * 60 * 60 * 1000) : 
      false
  };
}
