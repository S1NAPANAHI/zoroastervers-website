import { NextRequest } from 'next/server'

// Helper to create NextRequest for testing
export function createTestRequest(url: string, options?: RequestInit): NextRequest {
  // Use the URL string directly for NextRequest in test environment
  return new NextRequest(url, options) as NextRequest
}

export function createTestRequestWithURL(url: string, options?: RequestInit): NextRequest {
  // Alternative that might work better with the URL constructor
  return new NextRequest(url, options) as NextRequest
}
