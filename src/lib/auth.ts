import { NextRequest } from 'next/server'
import { supabase } from './supabase'
import { sanitizeHtml, isValidUuid } from './validations'

export interface AuthUser {
  id: string
  email: string
  role: 'user' | 'admin' | 'moderator'
  isAdmin: boolean
  isModerator: boolean
  lastActive?: Date
}

export interface JWTPayload {
  sub: string // User ID
  email: string
  aud: string // Audience
  exp: number // Expiration time
  iat: number // Issued at
  iss: string // Issuer
  role?: string
}

/**
 * Enhanced JWT validation with additional security checks
 */
export function validateJWTStructure(token: string): boolean {
  try {
    // Basic JWT structure check (3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    // Check if each part is valid base64
    for (const part of parts) {
      if (!part || part.length === 0) {
        return false;
      }
    }

    // Decode header to check algorithm
    const header = JSON.parse(atob(parts[0]));
    if (!header.alg || !header.typ) {
      return false;
    }

    // Basic payload validation
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.sub || !payload.exp || !payload.iat) {
      return false;
    }

    // Check token expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Extracts user from session and validates authentication with enhanced security
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Enhanced JWT validation
    if (!token || token.length < 20 || !validateJWTStructure(token)) {
      console.warn('Invalid JWT structure received');
      return null;
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.warn('JWT verification failed:', error.message);
      return null;
    }

    if (!user || !user.id || !isValidUuid(user.id)) {
      console.warn('Invalid user data from JWT');
      return null;
    }

    // Additional security: Check if user exists and is active
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, email, role, created_at, updated_at')
      .eq('id', user.id)
      .single();

    if (profileError) {
      // If no profile exists, create a basic user profile
      if (profileError.code === 'PGRST116') {
        const userEmail = sanitizeHtml(user.email || '');
        
        // Create basic user profile
        const { data: newProfile, error: createError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: userEmail,
            role: 'user'
          })
          .select('id, email, role')
          .single();

        if (createError || !newProfile) {
          console.error('Failed to create user profile:', createError);
          return null;
        }

        return {
          id: newProfile.id,
          email: newProfile.email,
          role: newProfile.role as 'user' | 'admin' | 'moderator',
          isAdmin: false,
          isModerator: false,
          lastActive: new Date()
        };
      }
      
      console.error('Failed to fetch user profile:', profileError);
      return null;
    }

    if (!profile) {
      console.warn('User profile not found');
      return null;
    }

    // Validate profile data
    if (!profile.email || !profile.role) {
      console.warn('Invalid user profile data');
      return null;
    }

    return {
      id: profile.id,
      email: sanitizeHtml(profile.email),
      role: profile.role as 'user' | 'admin' | 'moderator',
      isAdmin: profile.role === 'admin',
      isModerator: profile.role === 'moderator' || profile.role === 'admin',
      lastActive: new Date()
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Middleware to require authentication
 */
export async function requireAuth(request: NextRequest): Promise<AuthUser | Response> {
  const user = await getAuthenticatedUser(request)
  
  if (!user) {
    return new Response(
      JSON.stringify({ error: 'Authentication required' }),
      { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
  
  return user
}

/**
 * Middleware to require admin privileges
 */
export async function requireAdmin(request: NextRequest): Promise<AuthUser | Response> {
  const userOrResponse = await requireAuth(request)
  
  if (userOrResponse instanceof Response) {
    return userOrResponse
  }
  
  if (!userOrResponse.isAdmin) {
    return new Response(
      JSON.stringify({ error: 'Admin privileges required' }),
      { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
  
  return userOrResponse
}

/**
 * Check if user is authenticated (returns boolean)
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const user = await getAuthenticatedUser(request)
  return user !== null
}

/**
 * Check if user is admin (returns boolean)
 */
export async function isAdmin(request: NextRequest): Promise<boolean> {
  const user = await getAuthenticatedUser(request)
  return user?.isAdmin ?? false
}
