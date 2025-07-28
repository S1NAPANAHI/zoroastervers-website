import useSWR, { KeyedMutator } from 'swr';
import { supabase } from '@/lib/supabase';
import { Database, ItemType } from '@/lib/types';
import { useEffect, useCallback } from 'react';

// Generic types for our data operations
export interface PaginationOptions {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SortingOptions {
  column: string;
  direction: 'asc' | 'desc';
}

export interface FilterOptions {
  [key: string]: any;
}

export interface DataHookOptions {
  pagination?: PaginationOptions;
  sorting?: SortingOptions;
  filters?: FilterOptions;
  realtime?: boolean;
  revalidateOnFocus?: boolean;
  revalidateOnMount?: boolean;
}

export interface OptimisticUpdate<T> {
  optimisticData: T | ((current: T) => T);
  rollbackOnError?: boolean;
}

// Generic fetcher function for Supabase
export const createSupabaseFetcher = <T>(
  table: string,
  select: string = '*',
  options?: DataHookOptions
) => {
  return async (key: string): Promise<T[]> => {
    const urlParams = new URLSearchParams(key.split('?')[1] || '');
    
    let query = supabase.from(table).select(select);

    // Apply filters
    if (options?.filters) {
      Object.entries(options.filters).forEach(([column, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            query = query.in(column, value);
          } else {
            query = query.eq(column, value);
          }
        }
      });
    }

    // Apply URL params as additional filters
    for (const [key, value] of urlParams.entries()) {
      if (key !== 'page' && key !== 'limit' && key !== 'offset' && key !== 'sort' && key !== 'order') {
        query = query.eq(key, value);
      }
    }

    // Apply sorting
    const sortColumn = urlParams.get('sort') || options?.sorting?.column;
    const sortDirection = urlParams.get('order') || options?.sorting?.direction || 'desc';
    if (sortColumn) {
      query = query.order(sortColumn, { ascending: sortDirection === 'asc' });
    }

    // Apply pagination
    const page = parseInt(urlParams.get('page') || '0') || options?.pagination?.page || 0;
    const limit = parseInt(urlParams.get('limit') || '50') || options?.pagination?.limit || 50;
    const offset = parseInt(urlParams.get('offset') || '0') || options?.pagination?.offset || (page * limit);

    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data as T[];
  };
};

// Generic hook for data fetching with real-time subscriptions
export function useDataApi<T>(
  key: string,
  fetcher: (key: string) => Promise<T[]>,
  options?: DataHookOptions
) {
  const swrOptions = {
    revalidateOnFocus: options?.revalidateOnFocus ?? false,
    revalidateOnMount: options?.revalidateOnMount ?? true,
    dedupingInterval: 5000,
  };

  const { data, error, mutate, isLoading, isValidating } = useSWR<T[]>(
    key,
    fetcher,
    swrOptions
  );

  // Set up real-time subscriptions
  useEffect(() => {
    if (!options?.realtime || !data) return;

    // Extract table name from key (assuming format like 'table:filters')
    const tableName = key.split(':')[0];
    
    const channel = supabase
      .channel(`realtime-${tableName}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
        },
        (payload) => {
          console.log('Real-time update:', payload);
          // Revalidate data when changes occur
          mutate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [key, options?.realtime, data, mutate]);

  // Optimistic update helper
  const optimisticUpdate = useCallback(
    async <U>(
      updateFn: () => Promise<U>,
      optimisticOptions?: OptimisticUpdate<T[]>
    ): Promise<U> => {
      if (optimisticOptions) {
        const currentData = data || [];
        const optimisticData = typeof optimisticOptions.optimisticData === 'function'
          ? optimisticOptions.optimisticData(currentData)
          : optimisticOptions.optimisticData;

        // Update optimistically
        mutate(optimisticData, false);

        try {
          const result = await updateFn();
          // Revalidate after successful update
          mutate();
          return result;
        } catch (error) {
          // Rollback on error if specified
          if (optimisticOptions.rollbackOnError !== false) {
            mutate(currentData, false);
          }
          throw error;
        }
      } else {
        const result = await updateFn();
        mutate();
        return result;
      }
    },
    [data, mutate]
  );

  return {
    data: data || [],
    error,
    isLoading,
    isValidating,
    mutate,
    optimisticUpdate,
    // Pagination helpers
    hasMore: data && data.length === (options?.pagination?.limit || 50),
    refetch: () => mutate(),
  };
}

// Helper to build query keys with consistent formatting
export const buildQueryKey = (
  table: string,
  filters?: FilterOptions,
  pagination?: PaginationOptions,
  sorting?: SortingOptions
): string => {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });
  }

  if (pagination?.page !== undefined) {
    params.set('page', String(pagination.page));
  }
  if (pagination?.limit !== undefined) {
    params.set('limit', String(pagination.limit));
  }
  if (pagination?.offset !== undefined) {
    params.set('offset', String(pagination.offset));
  }

  if (sorting?.column) {
    params.set('sort', sorting.column);
    params.set('order', sorting.direction);
  }

  return `${table}${params.toString() ? `?${params.toString()}` : ''}`;
};

// Error boundary helper for data hooks
export class DataApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'DataApiError';
  }
}

// Typed API response helpers
export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

export interface PaginatedApiResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
  error?: string;
  status: number;
}

// Generic API client helpers
export const apiClient = {
  async get<T>(url: string): Promise<ApiResponse<T[]>> {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new DataApiError(data.error || 'API request failed', response.status);
    }
    
    return {
      data,
      status: response.status,
    };
  },

  async post<T>(url: string, body: any): Promise<ApiResponse<T>> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new DataApiError(data.error || 'API request failed', response.status);
    }
    
    return {
      data,
      status: response.status,
    };
  },

  async put<T>(url: string, body: any): Promise<ApiResponse<T>> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new DataApiError(data.error || 'API request failed', response.status);
    }
    
    return {
      data,
      status: response.status,
    };
  },

  async patch<T>(url: string, body: any): Promise<ApiResponse<T>> {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new DataApiError(data.error || 'API request failed', response.status);
    }
    
    return {
      data,
      status: response.status,
    };
  },

  async delete(url: string): Promise<ApiResponse<{ message: string }>> {
    const response = await fetch(url, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new DataApiError(data.error || 'API request failed', response.status);
    }
    
    return {
      data,
      status: response.status,
    };
  },
};
