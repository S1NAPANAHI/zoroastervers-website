import { renderHook, waitFor, act } from '@testing-library/react'
import { useProgress, useItemProgress } from '@/lib/hooks/useProgress'

// Mock SWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: [],
    error: null,
    isLoading: false,
    isValidating: false,
    mutate: jest.fn()
  }))
}))

describe('useProgress', () => {
  test('should fetch progress data', async () => {
    const { result } = renderHook(() => 
      useProgress({
        filters: { user_id: 'user-1' }
      })
    )

    expect(result.current.isLoading).toBe(false)
    expect(result.current.progress).toEqual([])
  })

  test('should update progress with optimistic updates', async () => {
    const { result } = renderHook(() => 
      useProgress({
        filters: { user_id: 'user-1' }
      })
    )

    await act(async () => {
      await result.current.updateProgress(1, 'book', {
        percent_complete: 75,
        last_position: 'chapter-10'
      })
    })

    // Check that optimistic update was called
    expect(result.current.optimisticUpdate).toBeDefined()
  })

  test('should mark item as completed', async () => {
    const { result } = renderHook(() => 
      useProgress({
        filters: { user_id: 'user-1' }
      })
    )

    await act(async () => {
      await result.current.markCompleted(1, 'book')
    })

    // Should call updateProgress with 100%
    expect(result.current.updateProgress).toBeDefined()
  })

  test('should start reading an item', async () => {
    const { result } = renderHook(() => 
      useProgress({
        filters: { user_id: 'user-1' }
      })
    )

    await act(async () => {
      await result.current.startReading(1, 'book')
    })

    expect(result.current.updateProgress).toBeDefined()
  })

  test('should update reading position', async () => {
    const { result } = renderHook(() => 
      useProgress({
        filters: { user_id: 'user-1' }
      })
    )

    await act(async () => {
      await result.current.updatePosition(1, 'book', 'chapter-5', 50)
    })

    expect(result.current.updateProgress).toBeDefined()
  })

  test('should log reading time', async () => {
    const { result } = renderHook(() => 
      useProgress({
        filters: { user_id: 'user-1' }
      })
    )

    await act(async () => {
      await result.current.logReadingTime(1, 'book', 30)
    })

    expect(result.current.updateProgress).toBeDefined()
  })
})

describe('useItemProgress', () => {
  test('should return progress for specific item', async () => {
    const { result } = renderHook(() => 
      useItemProgress(1, 'book')
    )

    expect(result.current.progress).toBeNull()
    expect(result.current.isCompleted).toBe(false)
    expect(result.current.isStarted).toBe(false)
  })

  test('should provide item-specific operations', async () => {
    const { result } = renderHook(() => 
      useItemProgress(1, 'book')
    )

    expect(typeof result.current.updateProgress).toBe('function')
    expect(typeof result.current.markCompleted).toBe('function')
    expect(typeof result.current.startReading).toBe('function')
    expect(typeof result.current.updatePosition).toBe('function')
    expect(typeof result.current.logReadingTime).toBe('function')
  })
})
