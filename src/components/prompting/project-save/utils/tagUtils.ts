
import { Tag } from '@/lib/types';
import { UseMutationResult } from '@tanstack/react-query';
import { errorHandler, AppError, LogLevel } from '@/lib/utils/errorHandler';

/**
 * Helper function to find or create a source tag with improved error handling
 */
export const getOrCreateSourceTag = async (
  source: string,
  tags: Tag[],
  createTagMutation: UseMutationResult<Tag, Error, { name: string; color: string }>
): Promise<Tag | null> => {
  try {
    // Normalize and validate the source name
    if (!source || typeof source !== 'string') {
      throw new AppError('Invalid source provided for tagging', LogLevel.WARN, {
        component: 'tagUtils',
        action: 'getOrCreateSourceTag'
      });
    }

    const normalizedSource = source.toLowerCase().trim();
    if (!normalizedSource) {
      throw new AppError('Empty source name provided', LogLevel.WARN, {
        component: 'tagUtils',
        action: 'getOrCreateSourceTag'
      });
    }

    // Create consistent tag name format
    const tagName = `source:${normalizedSource}`;
    
    errorHandler.handleInfo(`Looking for source tag: ${tagName}`, {
      component: 'tagUtils',
      action: 'getOrCreateSourceTag'
    });
    
    // Check if tag already exists (case-insensitive search)
    const sourceTag = tags.find(tag => 
      tag.name.toLowerCase() === tagName.toLowerCase()
    );
    
    if (sourceTag) {
      errorHandler.handleInfo('Found existing source tag', {
        component: 'tagUtils',
        metadata: { tagId: sourceTag.id, tagName: sourceTag.name }
      });
      return sourceTag;
    }

    // Determine tag color based on source
    let tagColor = '#6366F1'; // Default indigo color
    
    const sourceColorMap: Record<string, string> = {
      'prompt designer': '#2563EB', // Blue for Designer
      'designer': '#2563EB',
      'prompt scanner': '#8B5CF6', // Purple for Scanner  
      'scanner': '#8B5CF6',
      'chat': '#10B981', // Green for Chat
      'api': '#F59E0B', // Orange for API
      'import': '#EF4444' // Red for Import
    };

    tagColor = sourceColorMap[normalizedSource] || tagColor;
    
    errorHandler.handleInfo(`Creating new source tag: ${tagName}`, {
      component: 'tagUtils',
      metadata: { tagName, tagColor }
    });
    
    // Create the new tag
    const newTag = await createTagMutation.mutateAsync({
      name: tagName,
      color: tagColor
    });
    
    errorHandler.handleInfo('Created new source tag successfully', {
      component: 'tagUtils',
      metadata: { tagId: newTag.id, tagName: newTag.name }
    });
    
    return newTag;
    
  } catch (error) {
    errorHandler.log(new AppError(
      `Failed to get or create source tag: ${error instanceof Error ? error.message : 'Unknown error'}`,
      LogLevel.ERROR,
      {
        component: 'tagUtils',
        action: 'getOrCreateSourceTag',
        metadata: { source }
      }
    ));
    return null;
  }
};
