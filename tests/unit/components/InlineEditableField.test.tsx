import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InlineEditableField } from '@components/ui'
import { InlineAdminModeProvider } from '@/contexts/InlineAdminModeContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { AuthProvider } from '@/app/contexts/AuthContext'

// Mock fetch
global.fetch = jest.fn()

// Mock AuthContext
const mockAdminUser = {
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
    user: mockAdminUser,
    isAuthenticated: true
  })),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock SWR mutate
jest.mock('swr', () => ({
  mutate: jest.fn()
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <ToastProvider>
      <InlineAdminModeProvider>
        {children}
      </InlineAdminModeProvider>
    </ToastProvider>
  </AuthProvider>
)

describe('InlineEditableField', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  test('should display value in normal mode', () => {
    render(
      <TestWrapper>
        <InlineEditableField
          id="test-1"
          value="Test Value"
          apiEndpoint="/api/test"
          fieldName="title"
        />
      </TestWrapper>
    )

    expect(screen.getByText('Test Value')).toBeInTheDocument()
  })

  test('should show edit indicator when in admin mode', async () => {
    // Enable admin mode
    localStorage.setItem('inlineAdminMode', 'true')

    render(
      <TestWrapper>
        <InlineEditableField
          id="test-1"
          value="Test Value"
          apiEndpoint="/api/test"
          fieldName="title"
        />
      </TestWrapper>
    )

    const field = screen.getByText('Test Value').closest('div')
    expect(field).toHaveClass('cursor-pointer')

    // Should show edit icon on hover
    fireEvent.mouseEnter(field!)
    await waitFor(() => {
      expect(document.querySelector('.w-4.h-4')).toBeInTheDocument()
    })
  })

  test('should enter edit mode when clicked in admin mode', async () => {
    localStorage.setItem('inlineAdminMode', 'true')

    render(
      <TestWrapper>
        <InlineEditableField
          id="test-1"
          value="Test Value"
          apiEndpoint="/api/test"
          fieldName="title"
        />
      </TestWrapper>
    )

    const field = screen.getByText('Test Value')
    fireEvent.click(field)

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Value')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })
  })

  test('should save changes when save button is clicked', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ title: 'Updated Value' })
    } as Response)

    localStorage.setItem('inlineAdminMode', 'true')

    render(
      <TestWrapper>
        <InlineEditableField
          id="test-1"
          value="Test Value"
          apiEndpoint="/api/test"
          fieldName="title"
        />
      </TestWrapper>
    )

    // Enter edit mode
    fireEvent.click(screen.getByText('Test Value'))

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Value')).toBeInTheDocument()
    })

    // Change value
    const input = screen.getByDisplayValue('Test Value')
    await userEvent.clear(input)
    await userEvent.type(input, 'Updated Value')

    // Save changes
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/test', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: 'Updated Value' })
      })
    })
  })

  test('should cancel changes when cancel button is clicked', async () => {
    localStorage.setItem('inlineAdminMode', 'true')

    render(
      <TestWrapper>
        <InlineEditableField
          id="test-1"
          value="Test Value"
          apiEndpoint="/api/test"
          fieldName="title"
        />
      </TestWrapper>
    )

    // Enter edit mode
    fireEvent.click(screen.getByText('Test Value'))

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Value')).toBeInTheDocument()
    })

    // Change value
    const input = screen.getByDisplayValue('Test Value')
    await userEvent.clear(input)
    await userEvent.type(input, 'Changed Value')

    // Cancel changes
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

    await waitFor(() => {
      expect(screen.getByText('Test Value')).toBeInTheDocument()
      expect(screen.queryByDisplayValue('Changed Value')).not.toBeInTheDocument()
    })
  })

  test('should save on Enter key for text inputs', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ title: 'New Value' })
    } as Response)

    localStorage.setItem('inlineAdminMode', 'true')

    render(
      <TestWrapper>
        <InlineEditableField
          id="test-1"
          value="Test Value"
          apiEndpoint="/api/test"
          fieldName="title"
        />
      </TestWrapper>
    )

    // Enter edit mode
    fireEvent.click(screen.getByText('Test Value'))

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Value')).toBeInTheDocument()
    })

    // Change value and press Enter
    const input = screen.getByDisplayValue('Test Value')
    await userEvent.clear(input)
    await userEvent.type(input, 'New Value{enter}')

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  test('should cancel on Escape key', async () => {
    localStorage.setItem('inlineAdminMode', 'true')

    render(
      <TestWrapper>
        <InlineEditableField
          id="test-1"
          value="Test Value"
          apiEndpoint="/api/test"
          fieldName="title"
        />
      </TestWrapper>
    )

    // Enter edit mode
    fireEvent.click(screen.getByText('Test Value'))

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Value')).toBeInTheDocument()
    })

    // Press Escape
    const input = screen.getByDisplayValue('Test Value')
    fireEvent.keyDown(input, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.getByText('Test Value')).toBeInTheDocument()
      expect(screen.queryByDisplayValue('Test Value')).not.toBeInTheDocument()
    })
  })

  test('should render textarea for multiline fields', async () => {
    localStorage.setItem('inlineAdminMode', 'true')

    render(
      <TestWrapper>
        <InlineEditableField
          id="test-1"
          value="Test Value"
          apiEndpoint="/api/test"
          fieldName="description"
          multiline={true}
        />
      </TestWrapper>
    )

    // Enter edit mode
    fireEvent.click(screen.getByText('Test Value'))

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInstanceOf(HTMLTextAreaElement)
    })
  })

  test('should render select for select type', async () => {
    const options = [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' }
    ]

    localStorage.setItem('inlineAdminMode', 'true')

    render(
      <TestWrapper>
        <InlineEditableField
          id="test-1"
          value="draft"
          apiEndpoint="/api/test"
          fieldName="status"
          type="select"
          options={options}
        />
      </TestWrapper>
    )

    // Enter edit mode
    fireEvent.click(screen.getByText('draft'))

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument()
      expect(screen.getByText('Draft')).toBeInTheDocument()
      expect(screen.getByText('Published')).toBeInTheDocument()
    })
  })

  test('should validate value if validator is provided', async () => {
    const validator = jest.fn().mockReturnValue('Invalid value')

    localStorage.setItem('inlineAdminMode', 'true')

    render(
      <TestWrapper>
        <InlineEditableField
          id="test-1"
          value="Test Value"
          apiEndpoint="/api/test"
          fieldName="title"
          validateValue={validator}
        />
      </TestWrapper>
    )

    // Enter edit mode
    fireEvent.click(screen.getByText('Test Value'))

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Value')).toBeInTheDocument()
    })

    // Try to save
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    expect(validator).toHaveBeenCalledWith('Test Value')
    // Should not call fetch due to validation error
    expect(global.fetch).not.toHaveBeenCalled()
  })

  test('should handle API errors gracefully', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    } as Response)

    localStorage.setItem('inlineAdminMode', 'true')

    render(
      <TestWrapper>
        <InlineEditableField
          id="test-1"
          value="Test Value"
          apiEndpoint="/api/test"
          fieldName="title"
        />
      </TestWrapper>
    )

    // Enter edit mode
    fireEvent.click(screen.getByText('Test Value'))

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Value')).toBeInTheDocument()
    })

    // Change value and save
    const input = screen.getByDisplayValue('Test Value')
    await userEvent.clear(input)
    await userEvent.type(input, 'New Value')
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
      // Should show error toast (tested in integration)
    })
  })

  test('should not save if value has not changed', async () => {
    localStorage.setItem('inlineAdminMode', 'true')

    render(
      <TestWrapper>
        <InlineEditableField
          id="test-1"
          value="Test Value"
          apiEndpoint="/api/test"
          fieldName="title"
        />
      </TestWrapper>
    )

    // Enter edit mode
    fireEvent.click(screen.getByText('Test Value'))

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Value')).toBeInTheDocument()
    })

    // Save without changing value
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(screen.getByText('Test Value')).toBeInTheDocument()
    })

    // Should not call API
    expect(global.fetch).not.toHaveBeenCalled()
  })
})
