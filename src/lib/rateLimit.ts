// Rate limiting implementation using in-memory store as fallback
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * General rate limiting for API endpoints
 */
export async function applyGeneralRateLimit(identifier: string, maxRequests = 100, windowMs = 60000): Promise<boolean> {
  const now = Date.now();
  const key = `general_${identifier}`;
  
  const existing = rateLimitMap.get(key);
  
  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (existing.count >= maxRequests) {
    return false;
  }
  
  existing.count++;
  return true;
}

/**
 * Review-specific rate limiting
 */
export async function applyReviewRateLimit(identifier: string, maxRequests = 10, windowMs = 60000): Promise<boolean> {
  const now = Date.now();
  const key = `review_${identifier}`;
  
  const existing = rateLimitMap.get(key);
  
  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (existing.count >= maxRequests) {
    return false;
  }
  
  existing.count++;
  return true;
}

/**
 * Progress-specific rate limiting
 */
export async function applyProgressRateLimit(identifier: string, maxRequests = 50, windowMs = 60000): Promise<boolean> {
  const now = Date.now();
  const key = `progress_${identifier}`;
  
  const existing = rateLimitMap.get(key);
  
  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (existing.count >= maxRequests) {
    return false;
  }
  
  existing.count++;
  return true;
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60000); // Clean up every minute
