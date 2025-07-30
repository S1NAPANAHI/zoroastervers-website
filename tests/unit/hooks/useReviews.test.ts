import { renderHook, waitFor, act } from '@testing-library/react'
import { useReviews } from '@/lib/hooks/useReviews'

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

// Mock the API client
jest.mock('@/lib/hooks/useDataApi', () => ({
  useDataApi: jest.fn(() => ({
    data: [],
    error: null,
    isLoading: false,
    isValidating: false,
    mutate: jest.fn(),
    optimisticUpdate: jest.fn(async (fn, options) => {
      return await fn()
    }),
    hasMore: false,
    refetch: jest.fn()
  })),
  createSupabaseFetcher: jest.fn(),
  buildQueryKey: jest.fn(() => 'mock-key'),
  apiClient: {
    post: jest.fn().mockResolvedValue({ data: { id: 1, rating: 5, comment: 'Great!' } }),
    put: jest.fn().mockResolvedValue({ data: { id: 1, rating: 4, comment: 'Updated!' } }),
    delete: jest.fn().mockResolvedValue({ data: { message: 'Deleted' } })
  }
}))

describe('useReviews', () => {
  test('should fetch reviews data', async () => {
    const { result } = renderHook(() => 
      useReviews({
        filters: { item_id: 1, item_type: 'book' }
      })
    )

    expect(result.current.isLoading).toBe(false)
    expect(result.current.reviews).toEqual([])
  })

  test('should create a review with optimistic updates', async () => {
    const { result } = renderHook(() => 
      useReviews({
        filters: { item_id: 1, item_type: 'book' }
      })
    )

    const reviewData = {
      item_id: 1,
      item_type: 'book' as const,
      user_id: 'user-1',
      rating: 5,
      comment: 'Excellent book!',
      is_verified_purchase: true
    }

    await act(async () => {
      await result.current.createReview(reviewData)
    })

    expect(result.current.optimisticUpdate).toHaveBeenCalled()
  })

  test('should update a review', async () => {
    const { result } = renderHook(() => 
      useReviews({
        filters: { item_id: 1, item_type: 'book' }
      })
    )

    const updateData = {
      rating: 4,
      comment: 'Good book, but could be better'
    }

    await act(async () => {
      await result.current.updateReview(1, updateData)
    })

    expect(result.current.optimisticUpdate).toHaveBeenCalled()
  })

  test('should delete a review', async () => {
    const { result } = renderHook(() => 
      useReviews({
        filters: { item_id: 1, item_type: 'book' }
      })
    )

    await act(async () => {
      await result.current.deleteReview(1)
    })

    expect(result.current.optimisticUpdate).toHaveBeenCalled()
  })

  test('should handle filtering by item type', async () => {
    const bookReviews = renderHook(() => 
      useReviews({
        filters: { item_id: 1, item_type: 'book' }
      })
    )

    const volumeReviews = renderHook(() => 
      useReviews({
        filters: { item_id: 1, item_type: 'volume' }
      })
    )

    expect(bookReviews.result.current.reviews).toEqual([])
    expect(volumeReviews.result.current.reviews).toEqual([])
  })

  test('should handle error states', async () => {
    const { useDataApi } = require('@/lib/hooks/useDataApi')
    useDataApi.mockReturnValueOnce({
      data: [],
      error: new Error('Failed to fetch reviews'),
      isLoading: false,
      isValidating: false,
      mutate: jest.fn(),
      optimisticUpdate: jest.fn(),
      hasMore: false,
      refetch: jest.fn()
    })

    const { result } = renderHook(() => 
      useReviews({
        filters: { item_id: 999, item_type: 'book' }
      })
    )

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('Failed to fetch reviews')
  })

  test('should support pagination', async () => {
    const { result } = renderHook(() => 
      useReviews({
        filters: { item_id: 1, item_type: 'book' },
        pagination: { page: 0, limit: 10 }
      })
    )

    expect(result.current.hasMore).toBe(false)
    expect(typeof result.current.refetch).toBe('function')
  })
})
