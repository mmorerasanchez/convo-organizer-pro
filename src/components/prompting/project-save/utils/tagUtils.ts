
import { Tag } from '@/lib/types';
import { UseMutationResult } from '@tanstack/react-query';

/**
 * Helper function to find or create a source tag
 */
export const getOrCreateSourceTag = async (
  source: string,
  tags: Tag[],
  createTagMutation: UseMutationResult<Tag, Error, { name: string; color: string }>
): Promise<Tag | null> => {
  // Normalize the source name for consistent tagging
  const normalizedSource = source.toLowerCase();
  const tagName = `source:${normalizedSource}`;
  
  console.log('Looking for source tag:', tagName);
  
  // Check if tag already exists
  const sourceTag = tags.find(tag => 
    tag.name.toLowerCase() === tagName
  );
  
  if (sourceTag) {
    console.log('Found existing source tag:', sourceTag);
    return sourceTag;
  }

  // Create a new tag with a color based on the source
  let tagColor = '#6366F1'; // Default indigo color
  
  if (normalizedSource.includes('designer')) {
    tagColor = '#2563EB'; // Blue for Designer
  } else if (normalizedSource.includes('scanner')) {
    tagColor = '#8B5CF6'; // Purple for Scanner
  }
  
  console.log('Creating new source tag:', { name: tagName, color: tagColor });
  
  try {
    const newTag = await createTagMutation.mutateAsync({
      name: tagName,
      color: tagColor
    });
    console.log('Created new source tag:', newTag);
    return newTag;
  } catch (error) {
    console.error('Failed to create source tag:', error);
    return null;
  }
};
