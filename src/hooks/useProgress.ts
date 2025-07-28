import { useCallback } from 'react';
import { 
  useDataApi, 
  createSupabaseFetcher, 
  buildQueryKey, 
  apiClient,
  DataHookOptions,
  FilterOptions
} from './useDataApi';
import { UserProgress, UserProgressInsert, UserProgressUpdate } from '@/lib/types';

// Progress-specific filter options
export interface ProgressFilterOptions extends FilterOptions {
  item_id?: number;
  item_type?: 'book' | 'volume' | 'saga' | 'arc' | 'issue';
  user_id?: string;
  percent_complete_min?: number;
  percent_complete_max?: number;
  completed?: boolean;
}

// Progress hook options
export interface ProgressHookOptions extends DataHookOptions {
  filters?: ProgressFilterOptions;
  includeContent?: boolean;
}

// API helpers for progress operations
export const progressApi = {
  async update(data: UserProgressUpdate & { item_id: number; item_type: string }): Promise<UserProgress> {
    const response = await apiClient.patch<UserProgress>('/api/books/progress', data);
    return response.data;
  },

  async getStats(userId?: string): Promise<{
    totalItems: number;
    completedItems: number;
    inProgressItems: number;
    averageProgress: number;
    totalReadingTime: number;
  }> {
    const params = userId ? `?user_id=${userId}` : '';
    const response = await apiClient.get<any>(`/api/books/progress/stats${params}`);
    return response.data[0];
  },
};

// Main progress hook
export function useProgress(options?: ProgressHookOptions) {
  const queryKey = buildQueryKey(
    'user_progress',
    options?.filters,
    options?.pagination,
    options?.sorting
  );

  const selectQuery = options?.includeContent 
    ? `
      *,
      content:item_id (
        id,
        title,
        description,
        status,
        created_at,
        updated_at
      )
    `
    : '*';

  const fetcher = createSupabaseFetcher<UserProgress>(
    'user_progress',
    selectQuery,
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
  } = useDataApi<UserProgress>(queryKey, fetcher, {
    ...options,
    realtime: options?.realtime ?? true,
  });

  // Update progress with optimistic updates
  const updateProgress = useCallback(async (
    itemId: number,
    itemType: 'book' | 'volume' | 'saga' | 'arc' | 'issue',
    progressData: Partial<UserProgressUpdate>
  ) => {
    const now = new Date().toISOString();
    const optimisticData: UserProgressUpdate = {
      ...progressData,
      last_accessed: now,
      updated_at: now,
    };

    return optimisticUpdate(
      () => progressApi.update({ ...progressData, item_id: itemId, item_type: itemType }),
      {
        optimisticData: (current) => {
          const existingIndex = current.findIndex(
            p => p.item_id === itemId && p.item_type === itemType
          );

          if (existingIndex >= 0) {
            // Update existing progress
            const updated = [...current];
            updated[existingIndex] = { ...updated[existingIndex], ...optimisticData };
            return updated;
          } else {
            // Create new progress entry
            const newProgress: UserProgress = {
              id: Date.now(), // Temporary ID
              user_id: '', // Will be set by server
              item_id: itemId,
              item_type: itemType,
              percent_complete: 0,
              last_position: null,
              started_at: now,
              completed_at: null,
              last_accessed: now,
              total_reading_time: 0,
              session_count: 1,
              created_at: now,
              updated_at: now,
              ...progressData,
            } as UserProgress;
            return [newProgress, ...current];
          }
        },
        rollbackOnError: true,
      }
    );
  }, [optimisticUpdate]);

  // Helper to mark item as completed
  const markCompleted = useCallback(async (
    itemId: number,
    itemType: 'book' | 'volume' | 'saga' | 'arc' | 'issue'
  ) => {
    return updateProgress(itemId, itemType, {
      percent_complete: 100,
      completed_at: new Date().toISOString(),
    });
  }, [updateProgress]);

  // Helper to start reading an item
  const startReading = useCallback(async (
    itemId: number,
    itemType: 'book' | 'volume' | 'saga' | 'arc' | 'issue'
  ) => {
    return updateProgress(itemId, itemType, {
      started_at: new Date().toISOString(),
      percent_complete: 1, // Mark as started
    });
  }, [updateProgress]);

  // Helper to update reading position
  const updatePosition = useCallback(async (
    itemId: number,
    itemType: 'book' | 'volume' | 'saga' | 'arc' | 'issue',
    position: string,
    percentComplete?: number
  ) => {
    return updateProgress(itemId, itemType, {
      last_position: position,
      percent_complete: percentComplete,
    });
  }, [updateProgress]);

  // Helper to log reading time
  const logReadingTime = useCallback(async (
    itemId: number,
    itemType: 'book' | 'volume' | 'saga' | 'arc' | 'issue',
    additionalMinutes: number
  ) => {
    const existingProgress = data.find(
      p => p.item_id === itemId && p.item_type === itemType
    );

    const currentTime = existingProgress?.total_reading_time || 0;
    const currentSessions = existingProgress?.session_count || 0;

    return updateProgress(itemId, itemType, {
      total_reading_time: currentTime + additionalMinutes,
      session_count: currentSessions + 1,
    });
  }, [data, updateProgress]);

  return {
    // Data
    progress: data,
    
    // State
    isLoading,
    isValidating,
    error,
    hasMore,
    
    // Operations
    updateProgress,
    markCompleted,
    startReading,
    updatePosition,
    logReadingTime,
    
    // Utilities
    refetch,
    mutate,
    
    // Direct API access
    api: progressApi,
  };
}

// Hook for single item progress
export function useItemProgress(
  itemId: number,
  itemType: 'book' | 'volume' | 'saga' | 'arc' | 'issue'
) {
  const { progress, updateProgress, markCompleted, startReading, updatePosition, logReadingTime, isLoading, error } = useProgress({
    filters: { item_id: itemId, item_type: itemType },
    pagination: { limit: 1 },
  });

  const itemProgress = progress[0] || null;
  const isCompleted = itemProgress?.percent_complete === 100;
  const isStarted = itemProgress && itemProgress.percent_complete > 0;

  return {
    progress: itemProgress,
    isCompleted,
    isStarted,
    isLoading,
    error,
    
    // Operations bound to this specific item
    updateProgress: (data: Partial<UserProgressUpdate>) => 
      updateProgress(itemId, itemType, data),
    markCompleted: () => markCompleted(itemId, itemType),
    startReading: () => startReading(itemId, itemType),
    updatePosition: (position: string, percentComplete?: number) => 
      updatePosition(itemId, itemType, position, percentComplete),
    logReadingTime: (minutes: number) => 
      logReadingTime(itemId, itemType, minutes),
  };
}

// Hook for progress statistics
export function useProgressStats(userId?: string) {
  const queryKey = `progress-stats${userId ? `:${userId}` : ''}`;
  
  const fetcher = useCallback(async () => {
    const stats = await progressApi.getStats(userId);
    return [stats]; // Return as array for consistency
  }, [userId]);

  const { data, error, isLoading, refetch } = useDataApi<ReturnType<typeof progressApi.getStats>>(
    queryKey,
    fetcher,
    { revalidateOnFocus: false, realtime: false }
  );

  return {
    stats: data[0],
    isLoading,
    error,
    refetch,
  };
}

// Export types
export type {
  ProgressFilterOptions,
  ProgressHookOptions,
};
