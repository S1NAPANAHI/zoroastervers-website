import { NextRequest } from 'next/server'
import { supabase } from './supabase'

export interface AuthUser {
  id: string
  email: string
  role: 'user' | 'admin' | 'moderator'
  isAdmin: boolean
}

/**
 * Extracts user from session and validates authentication
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Set the auth token for this request
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return null
    }

    // Get user profile from our users table to check role
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      // Return basic user info if no profile exists yet
      return {
        id: user.id,
        email: user.email || '',
        role: 'user',
        isAdmin: false
      }
    }

    return {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      isAdmin: profile.role === 'admin'
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
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
