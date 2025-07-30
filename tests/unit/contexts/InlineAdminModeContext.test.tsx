import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react'
import { InlineAdminModeProvider, useInlineAdminMode } from '@/contexts/InlineAdminModeContext'
import { AuthProvider } from '@/app/contexts/AuthContext'

// Mock AuthContext
const mockUser = {
  id: 'admin-1',
  username: 'Admin',
  email: 'admin@test.com',
  isAdmin: true,
  role: 'admin' as const,
  avatar: '👑',
  bio: '',
  joinDate: '2024-01-01',
  badges: [],
  achievements: [],
  favorites: {
    characters: [],
    locations: [],
    timelineEvents: [],
    books: []
  },
  progress: {
    booksRead: 0,
    totalBooks: 0,
    timelineExplored: 0,
    charactersDiscovered: 0,
    locationsExplored: 0
  },
  preferences: {
    theme: 'dark' as const,
    spoilerLevel: 'none' as const,
    notifications: true
  },
  customPaths: [],
  notes: []
}

jest.mock('@/app/contexts/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    user: mockUser,
    isAuthenticated: true
  })),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <InlineAdminModeProvider>
      {children}
    </InlineAdminModeProvider>
  </AuthProvider>
)

describe('InlineAdminModeContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('should initialize with admin mode disabled', () => {
    const { result } = renderHook(() => useInlineAdminMode(), {
      wrapper: TestWrapper
    })

    expect(result.current.isInlineAdminMode).toBe(false)
    expect(result.current.isEditing).toBeNull()
    expect(result.current.editingData).toEqual({})
  })

  test('should toggle admin mode for admin users', () => {
    const { result } = renderHook(() => useInlineAdminMode(), {
      wrapper: TestWrapper
    })

    act(() => {
      result.current.toggleInlineAdminMode()
    })

    expect(result.current.isInlineAdminMode).toBe(true)
    expect(localStorage.getItem('inlineAdminMode')).toBe('true')
  })

  test('should not toggle admin mode for non-admin users', () => {
    const { useAuth } = require('@/app/contexts/AuthContext')
    useAuth.mockReturnValue({
      user: { ...mockUser, isAdmin: false },
      isAuthenticated: true
    })

    const { result } = renderHook(() => useInlineAdminMode(), {
      wrapper: TestWrapper
    })

    act(() => {
      result.current.toggleInlineAdminMode()
    })

    expect(result.current.isInlineAdminMode).toBe(false)
  })

  test('should manage editing state', () => {
    const { result } = renderHook(() => useInlineAdminMode(), {
      wrapper: TestWrapper
    })

    act(() => {
      result.current.toggleInlineAdminMode() // Enable admin mode first
    })

    act(() => {
      result.current.setIsEditing('field-1')
    })

    expect(result.current.isEditing).toBe('field-1')

    act(() => {
      result.current.setIsEditing(null)
    })

    expect(result.current.isEditing).toBeNull()
  })

  test('should manage editing data', () => {
    const { result } = renderHook(() => useInlineAdminMode(), {
      wrapper: TestWrapper
    })

    act(() => {
      result.current.setEditingData('field-1', { title: 'New Title' })
    })

    expect(result.current.editingData['field-1']).toEqual({ title: 'New Title' })

    act(() => {
      result.current.setEditingData('field-1', { description: 'New Description' })
    })

    expect(result.current.editingData['field-1']).toEqual({ 
      title: 'New Title', 
      description: 'New Description' 
    })

    act(() => {
      result.current.clearEditingData('field-1')
    })

    expect(result.current.editingData['field-1']).toBeUndefined()
  })

  test('should clear editing state when disabling admin mode', () => {
    const { result } = renderHook(() => useInlineAdminMode(), {
      wrapper: TestWrapper
    })

    act(() => {
      result.current.toggleInlineAdminMode() // Enable
      result.current.setIsEditing('field-1')
      result.current.setEditingData('field-1', { title: 'Test' })
    })

    expect(result.current.isEditing).toBe('field-1')
    expect(result.current.editingData['field-1']).toBeDefined()

    act(() => {
      result.current.toggleInlineAdminMode() // Disable
    })

    expect(result.current.isInlineAdminMode).toBe(false)
    expect(result.current.isEditing).toBeNull()
    expect(result.current.editingData).toEqual({})
  })

  test('should load saved admin mode from localStorage', () => {
    localStorage.setItem('inlineAdminMode', 'true')

    const { result } = renderHook(() => useInlineAdminMode(), {
      wrapper: TestWrapper
    })

    expect(result.current.isInlineAdminMode).toBe(true)
  })

  test('should throw error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      renderHook(() => useInlineAdminMode())
    }).toThrow('useInlineAdminMode must be used within an InlineAdminModeProvider')

    consoleError.mockRestore()
  })
})
