
import { logger } from '@/lib/utils/logger';

/**
 * Sanitizes and validates input before processing
 */
const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  
  // Remove any potentially malicious characters and trim
  return input
    .trim()
    .replace(/[<>\"']/g, '') // Remove HTML/script injection characters
    .substring(0, 200); // Limit length to prevent DoS
};

/**
 * Extracts share ID from various URL formats or plain IDs
 */
export const extractShareId = (input: string): string => {
  // Early validation to prevent processing invalid inputs
  if (!input || typeof input !== 'string') {
    throw new Error('Share link cannot be empty');
  }
  
  // Sanitize input
  const sanitizedInput = sanitizeInput(input);
  
  if (sanitizedInput === '' || sanitizedInput === 'shared' || sanitizedInput === 'projects/shared') {
    throw new Error('Invalid share link format. Please provide the complete share link or project ID');
  }
  
  // Check if it's a URL and extract the UUID from it
  let shareId = sanitizedInput;
  
  try {
    // If it looks like a URL, try to parse it
    if (shareId.startsWith('http') || shareId.includes('/')) {
      logger.debug('Input appears to be a URL, attempting to parse', { metadata: { input: sanitizedInput } });
      
      try {
        // Try to create a URL object to parse it properly
        const url = new URL(shareId);
        
        // Validate the URL is from expected domains (optional security check)
        const allowedHosts = ['localhost', '127.0.0.1', 'lovable.app'];
        const isAllowedHost = allowedHosts.some(host => 
          url.hostname === host || url.hostname.endsWith(`.${host}`)
        );
        
        if (!isAllowedHost && import.meta.env.PROD) {
          logger.warn('URL from unexpected domain', { metadata: { hostname: url.hostname } });
        }
        
        // Get the path segments
        const pathSegments = url.pathname.split('/').filter(Boolean);
        logger.debug('URL path segments parsed', { metadata: { segments: pathSegments } });
        
        // Find the ID - it should be after 'shared' in the URL
        let foundSharedIndex = false;
        for (let i = 0; i < pathSegments.length; i++) {
          if (pathSegments[i] === 'shared') {
            foundSharedIndex = true;
            // The next segment should be the ID
            if (i + 1 < pathSegments.length) {
              shareId = pathSegments[i + 1];
              logger.debug('Found ID after "shared"', { metadata: { shareId } });
              break;
            }
          }
        }
        
        // If we didn't find 'shared' in the path, look for UUID pattern
        if (!foundSharedIndex) {
          for (const segment of pathSegments) {
            if (isValidUuid(segment)) {
              shareId = segment;
              logger.debug('Found UUID in path', { metadata: { shareId } });
              break;
            }
          }
        }
      } catch (parseError) {
        // If URL parsing fails, try a simple regex approach
        logger.debug('URL parsing failed, trying regex approach');
        const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
        const match = shareId.match(uuidPattern);
        
        if (match) {
          shareId = match[0];
          logger.debug('Found UUID using regex', { metadata: { shareId } });
        } else {
          // Just get the last path segment
          const segments = shareId.split('/').filter(Boolean);
          if (segments.length > 0) {
            const lastSegment = segments[segments.length - 1];
            // Verify it's not 'shared'
            if (lastSegment !== 'shared') {
              shareId = lastSegment;
              logger.debug('Using last segment after split', { metadata: { shareId } });
            } else if (segments.length > 1) {
              // If the last segment is 'shared', try the one before
              shareId = segments[segments.length - 2];
              logger.debug('Using segment before "shared"', { metadata: { shareId } });
            }
          }
        }
      }
    }
    
    // Remove any trailing slashes or query params and sanitize again
    shareId = sanitizeInput(shareId.split('?')[0].split('#')[0].replace(/\/$/, ''));
    
    logger.debug('Final extracted share ID', { metadata: { shareId } });
    
    // Validate the extracted ID
    if (!shareId || shareId === 'shared' || shareId === 'projects') {
      throw new Error('Invalid share link format. Please provide a complete share link or project ID');
    }
    
    // Final UUID validation
    if (!isValidUuid(shareId)) {
      throw new Error('Invalid project ID format. Please check the share link.');
    }
    
    return shareId;
  } catch (error) {
    logger.error('Error extracting share ID', error, { metadata: { input: sanitizedInput } });
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to extract a valid project ID from the provided link');
  }
};

/**
 * Enhanced UUID validation with additional security checks
 */
export function isValidUuid(str: string): boolean {
  if (typeof str !== 'string') {
    return false;
  }
  
  // Basic length check first
  if (str.length !== 36) {
    return false;
  }
  
  // Enhanced UUID pattern with stricter validation
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidPattern.test(str);
}
