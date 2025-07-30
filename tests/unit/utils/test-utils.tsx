import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { SWRConfig } from 'swr'
import { AuthProvider } from '@/app/contexts/AuthContext'
import { CartProvider } from '@/app/contexts/CartContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { InlineAdminModeProvider } from '@/contexts/InlineAdminModeContext'

// Mock providers for testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig value={{ 
      provider: () => new Map(),
      dedupingInterval: 0 
    }}>
      <AuthProvider>
        <ToastProvider>
          <InlineAdminModeProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </InlineAdminModeProvider>
        </ToastProvider>
      </AuthProvider>
    </SWRConfig>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock data generators
export const mockUser = {
  id: 'test-user-1',
  username: 'TestUser',
  email: 'test@example.com',
  isAdmin: false,
  role: 'user' as const,
  avatar: '👤',
  bio: 'Test user bio',
  joinDate: '2024-01-01',
  badges: ['Test Badge'],
  achievements: [],
  favorites: {
    characters: [],
    locations: [],
    timelineEvents: [],
    books: []
  },
  progress: {
    booksRead: 2,
    totalBooks: 5,
    timelineExplored: 50,
    charactersDiscovered: 25,
    locationsExplored: 10
  },
  preferences: {
    theme: 'dark' as const,
    spoilerLevel: 'minimal' as const,
    notifications: true
  },
  customPaths: [],
  notes: []
}

export const mockAdminUser = {
  ...mockUser,
  id: 'admin-user-1',
  username: 'AdminUser',
  email: 'admin@example.com',
  isAdmin: true,
  role: 'admin' as const,
  avatar: '👑'
}

export const mockCartItem = {
  id: '1',
  type: 'book' as const,
  title: 'Test Book',
  price: 15.99,
  quantity: 1,
  coverImage: '/test-cover.jpg',
  description: 'A test book for testing'
}

export const mockReview = {
  id: 1,
  item_id: 1,
  item_type: 'book' as const,
  user_id: 'test-user-1',
  rating: 5,
  comment: 'Great book!',
  is_verified_purchase: true,
  helpful_count: 3,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}

export const mockProgress = {
  id: 1,
  user_id: 'test-user-1',
  item_id: 1,
  item_type: 'book' as const,
  percent_complete: 75,
  last_position: 'chapter-10',
  started_at: '2024-01-01T00:00:00Z',
  completed_at: null,
  last_accessed: '2024-01-15T00:00:00Z',
  total_reading_time: 180,
  session_count: 8,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z'
}

// Test utilities
export const createMockServer = () => {
  // Returns mock server instance for testing
  return {
    listen: jest.fn(),
    close: jest.fn(),
    resetHandlers: jest.fn()
  }
}

export const mockFetch = (data: any, status = 200) => {
  return jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data)
  })
}

export const waitForElementToBeRemoved = async (element: HTMLElement) => {
  const { waitForElementToBeRemoved } = await import('@testing-library/react')
  return waitForElementToBeRemoved(element)
}
