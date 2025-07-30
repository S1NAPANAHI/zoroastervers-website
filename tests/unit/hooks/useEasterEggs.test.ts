import { renderHook, waitFor } from '@testing-library/react'
import { useEasterEggs } from '@/lib/hooks/useEasterEggs'

describe('useEasterEggs', () => {
  test('should fetch easter eggs for a given item', async () => {
    const { result } = renderHook(() => 
      useEasterEggs({ 
        itemId: 1, 
        itemType: 'book' 
      })
    )

    expect(result.current.isLoading).toBe(true)
    expect(result.current.easterEggs).toEqual([])

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.easterEggs).toHaveLength(3)
    expect(result.current.easterEggs[0]).toMatchObject({
      title: 'Hidden Treasure',
      clue: 'Look closely at the book cover',
      reward: 'You found the author\'s secret note!',
      icon: '🗝️'
    })
  })

  test('should toggle egg visibility', async () => {
    const { result } = renderHook(() => 
      useEasterEggs({ 
        itemId: 1, 
        itemType: 'book',
        adminMode: true 
      })
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const initialEgg = result.current.easterEggs[0]
    const initialActiveState = initialEgg.is_active

    result.current.toggleEggVisibility(initialEgg.id)

    expect(result.current.easterEggs[0].is_active).toBe(!initialActiveState)
  })

  test('should filter eggs based on admin mode', async () => {
    const { result: regularResult } = renderHook(() => 
      useEasterEggs({ 
        itemId: 1, 
        itemType: 'book',
        adminMode: false 
      })
    )

    const { result: adminResult } = renderHook(() => 
      useEasterEggs({ 
        itemId: 1, 
        itemType: 'book',
        adminMode: true 
      })
    )

    await waitFor(() => {
      expect(regularResult.current.isLoading).toBe(false)
      expect(adminResult.current.isLoading).toBe(false)
    })

    // Admin should see all eggs
    expect(adminResult.current.easterEggs).toHaveLength(3)
    
    // Regular users should see only active eggs on books
    expect(regularResult.current.easterEggs).toHaveLength(3)
  })

  test('should handle error states', async () => {
    // Mock fetch to reject
    const originalFetch = global.fetch
    global.fetch = jest.fn().mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => 
      useEasterEggs({ 
        itemId: 999, 
        itemType: 'book' 
      })
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBe('Failed to load easter eggs')

    global.fetch = originalFetch
  })

  test('should refetch easter eggs', async () => {
    const { result } = renderHook(() => 
      useEasterEggs({ 
        itemId: 1, 
        itemType: 'book' 
      })
    )

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Trigger refetch
    result.current.refetch()

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.easterEggs).toHaveLength(3)
  })
})
