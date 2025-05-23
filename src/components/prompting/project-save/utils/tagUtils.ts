
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
  // Check if tag already exists
  const sourceTag = tags.find(tag => 
    tag.name.toLowerCase() === `source:${source.toLowerCase()}`
  );
  
  if (sourceTag) {
    return sourceTag;
  }

  // Create a new tag with a color based on the source
  let tagColor = '#6366F1'; // Default indigo color
  
  if (source.toLowerCase().includes('designer')) {
    tagColor = '#2563EB'; // Blue for Designer
  } else if (source.toLowerCase().includes('scanner')) {
    tagColor = '#8B5CF6'; // Purple for Scanner
  }
  
  try {
    const newTag = await createTagMutation.mutateAsync({
      name: `source:${source}`,
      color: tagColor
    });
    return newTag;
  } catch (error) {
    console.error('Failed to create source tag:', error);
    return null;
  }
};
