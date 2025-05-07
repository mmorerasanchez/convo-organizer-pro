
/**
 * Extracts share ID from various URL formats or plain IDs
 */
export const extractShareId = (input: string): string => {
  // Early validation to prevent processing invalid inputs
  if (!input || input.trim() === '') {
    throw new Error('Share link cannot be empty');
  }
  
  // Reject known invalid inputs early
  const trimmedInput = input.trim();
  if (trimmedInput === 'shared' || trimmedInput === 'projects/shared') {
    throw new Error('Invalid share link format. Please provide the complete share link or project ID');
  }
  
  // Check if it's a URL and extract the UUID from it
  let shareId = trimmedInput;
  
  try {
    // If it looks like a URL, try to parse it
    if (shareId.startsWith('http') || shareId.includes('/')) {
      console.log('Input appears to be a URL, attempting to parse:', shareId);
      
      try {
        // Try to create a URL object to parse it properly
        const url = new URL(shareId);
        
        // Get the path segments
        const pathSegments = url.pathname.split('/').filter(Boolean);
        console.log('URL path segments:', pathSegments);
        
        // Find the ID - it should be after 'shared' in the URL
        let foundSharedIndex = false;
        for (let i = 0; i < pathSegments.length; i++) {
          if (pathSegments[i] === 'shared') {
            foundSharedIndex = true;
            // The next segment should be the ID
            if (i + 1 < pathSegments.length) {
              shareId = pathSegments[i + 1];
              console.log('Found ID after "shared":', shareId);
              break;
            }
          }
        }
        
        // If we didn't find 'shared' in the path, look for UUID pattern
        if (!foundSharedIndex) {
          for (const segment of pathSegments) {
            if (isValidUuid(segment)) {
              shareId = segment;
              console.log('Found UUID in path:', shareId);
              break;
            }
          }
        }
      } catch (parseError) {
        // If URL parsing fails, try a simple regex approach
        console.log('URL parsing failed, trying regex approach');
        const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
        const match = shareId.match(uuidPattern);
        
        if (match) {
          shareId = match[0];
          console.log('Found UUID using regex:', shareId);
        } else {
          // Just get the last path segment
          const segments = shareId.split('/').filter(Boolean);
          if (segments.length > 0) {
            const lastSegment = segments[segments.length - 1];
            // Verify it's not 'shared'
            if (lastSegment !== 'shared') {
              shareId = lastSegment;
              console.log('Using last segment after split:', shareId);
            } else if (segments.length > 1) {
              // If the last segment is 'shared', try the one before
              shareId = segments[segments.length - 2];
              console.log('Using segment before "shared":', shareId);
            }
          }
        }
      }
    }
    
    // Remove any trailing slashes or query params
    shareId = shareId.split('?')[0].split('#')[0].replace(/\/$/, '');
    
    console.log(`Final extracted share ID: ${shareId}`);
    
    // Validate the extracted ID
    if (!shareId || shareId === 'shared' || shareId === 'projects') {
      throw new Error('Invalid share link format. Please provide a complete share link or project ID');
    }
    
    return shareId;
  } catch (error) {
    console.error('Error extracting share ID:', error);
    throw new Error('Failed to extract a valid project ID from the provided link');
  }
};

/**
 * Basic validation to check if a string looks like a UUID
 */
export function isValidUuid(str: string): boolean {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(str);
}
