import { useCallback } from 'react';
import { 
  useDataApi, 
  createSupabaseFetcher, 
  buildQueryKey, 
  apiClient,
  DataHookOptions,
  FilterOptions
} from './useDataApi';
import { Review, ReviewInsert, ReviewUpdate } from '@/lib/types';

// Reviews-specific filter options
export interface ReviewFilterOptions extends FilterOptions {
  item_id?: number;
  item_type?: 'book' | 'volume' | 'saga' | 'arc' | 'issue';
  user_id?: string;
  rating?: number;
  is_verified_purchase?: boolean;
}

// Reviews hook options
export interface ReviewsHookOptions extends DataHookOptions {
  filters?: ReviewFilterOptions;
}

// API helpers for reviews operations
export const reviewsApi = {
  async create(data: ReviewInsert): Promise<Review> {
    const response = await apiClient.post<Review>('/api/books/reviews', data);
    return response.data;
  },

  async update(id: number, data: ReviewUpdate): Promise<Review> {
    const response = await apiClient.put<Review>(`/api/books/reviews/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/books/reviews/${id}`);
  },
};

// Main reviews hook
export function useReviews(options?: ReviewsHookOptions) {
  const queryKey = buildQueryKey(
    'reviews',
    options?.filters,
    options?.pagination,
    options?.sorting
  );

  const fetcher = createSupabaseFetcher<Review>(
    'reviews',
    '*',
    options
  );

  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    optimisticUpdate,
    hasMore,
    refetch,
  } = useDataApi<Review>(queryKey, fetcher, {
    ...options,
    realtime: options?.realtime ?? true,
  });

  // Create operations with optimistic updates
  const createReview = useCallback(async (reviewData: ReviewInsert) => {
    const optimisticReview: Review = {
      id: Date.now(), // Temporary ID
      ...reviewData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      helpful_count: 0,
    };

    return optimisticUpdate(
      () => reviewsApi.create(reviewData),
      {
        optimisticData: (current) => [optimisticReview, ...current],
        rollbackOnError: true,
      }
    );
  }, [optimisticUpdate]);

  const updateReview = useCallback(async (id: number, reviewData: ReviewUpdate) => {
    return optimisticUpdate(
      () => reviewsApi.update(id, reviewData),
      {
        optimisticData: (current) => 
          current.map(review => 
            review.id === id ? { ...review, ...reviewData, updated_at: new Date().toISOString() } : review
          ),
        rollbackOnError: true,
      }
    );
  }, [optimisticUpdate]);

  const deleteReview = useCallback(async (id: number) => {
    return optimisticUpdate(
      () => reviewsApi.delete(id),
      {
        optimisticData: (current) => current.filter(review => review.id !== id),
        rollbackOnError: true,
      }
    );
  }, [optimisticUpdate]);

  return {
    // Data
    reviews: data,
    
    // State
    isLoading,
    isValidating,
    error,
    hasMore,
    
    // Operations
    createReview,
    updateReview,
    deleteReview,
    
    // Utilities
    refetch,
    mutate
  };
}

