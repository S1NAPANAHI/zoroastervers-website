import { useCallback, useMemo } from 'react';
import { 
  Book, 
  Volume, 
  Saga, 
  Arc, 
  Issue, 
  BookInsert, 
  VolumeInsert, 
  SagaInsert, 
  ArcInsert, 
  IssueInsert,
  BookUpdate,
  VolumeUpdate,
  SagaUpdate,
  ArcUpdate,
  IssueUpdate,
  ItemType,
  ContentStatus 
} from '@/lib/types';
import { 
  useDataApi, 
  createSupabaseFetcher, 
  buildQueryKey, 
  apiClient,
  DataHookOptions,
  FilterOptions,
  PaginationOptions,
  SortingOptions 
} from './useDataApi';

// Union type for all inventory items
export type InventoryItem = Book | Volume | Saga | Arc | Issue;
export type InventoryInsert = BookInsert | VolumeInsert | SagaInsert | ArcInsert | IssueInsert;
export type InventoryUpdate = BookUpdate | VolumeUpdate | SagaUpdate | ArcUpdate | IssueUpdate;

// Inventory-specific filter options
export interface InventoryFilterOptions extends FilterOptions {
  item_type?: ItemType | ItemType[];
  status?: ContentStatus | ContentStatus[];
  parent_id?: number;
  price_min?: number;
  price_max?: number;
  is_complete?: boolean;
  physical_available?: boolean;
  digital_bundle?: boolean;
  search?: string;
}

// Inventory hook options
export interface InventoryHookOptions extends DataHookOptions {
  filters?: InventoryFilterOptions;
  includeHierarchy?: boolean;
  includeStats?: boolean;
}

// Inventory statistics
export interface InventoryStats {
  totalItems: number;
  itemsByType: Record<ItemType, number>;
  itemsByStatus: Record<ContentStatus, number>;
  totalValue: number;
  averagePrice: number;
  completionRate: number;
}

// Hierarchical inventory item with children
export type HierarchicalInventoryItem = InventoryItem & {
  children?: HierarchicalInventoryItem[];
  parent?: HierarchicalInventoryItem;
  depth: number;
  hasChildren: boolean;
};

// Custom fetcher for inventory with hierarchy support
const createInventoryFetcher = (options?: InventoryHookOptions) => {
  const baseSelect = options?.includeHierarchy 
    ? `
      *,
      parent:parent_id(*),
      children:volumes(*),
      sagas(*),
      arcs(*),
      issues(*)
    `
    : '*';

  return createSupabaseFetcher<InventoryItem>('books', baseSelect, options);
};

// API helpers for inventory operations
export const inventoryApi = {
  // Generic CRUD operations
  async create(itemType: ItemType, data: InventoryInsert): Promise<InventoryItem> {
    const endpoint = getApiEndpoint(itemType);
    const response = await apiClient.post<InventoryItem>(endpoint, data);
    return response.data;
  },

  async update(itemType: ItemType, id: number, data: InventoryUpdate): Promise<InventoryItem> {
    const endpoint = getApiEndpoint(itemType, id);
    const response = await apiClient.put<InventoryItem>(endpoint, data);
    return response.data;
  },

  async delete(itemType: ItemType, id: number): Promise<void> {
    const endpoint = getApiEndpoint(itemType, id);
    await apiClient.delete(endpoint);
  },

  // Bulk operations
  async bulkCreate(items: Array<{ type: ItemType; data: InventoryInsert }>): Promise<InventoryItem[]> {
    const response = await apiClient.post<InventoryItem[]>('/api/inventory/bulk', {
      operation: 'create',
      items,
    });
    return response.data;
  },

  async bulkUpdate(updates: Array<{ type: ItemType; id: number; data: InventoryUpdate }>): Promise<InventoryItem[]> {
    const response = await apiClient.put<InventoryItem[]>('/api/inventory/bulk', {
      operation: 'update',
      updates,
    });
    return response.data;
  },

  async bulkDelete(items: Array<{ type: ItemType; id: number }>): Promise<void> {
    await apiClient.delete('/api/inventory/bulk?' + 
      items.map(item => `items=${item.type}:${item.id}`).join('&')
    );
  },

  // Hierarchy operations
  async reorderItems(parentId: number, itemType: ItemType, orderUpdates: Array<{ id: number; order_index: number }>): Promise<void> {
    await apiClient.patch('/api/inventory/reorder', {
      parent_id: parentId,
      item_type: itemType,
      order_updates: orderUpdates,
    });
  },

  async moveItem(itemId: number, itemType: ItemType, newParentId: number, newOrderIndex?: number): Promise<InventoryItem> {
    const response = await apiClient.patch<InventoryItem>('/api/inventory/move', {
      item_id: itemId,
      item_type: itemType,
      new_parent_id: newParentId,
      new_order_index: newOrderIndex,
    });
    return response.data;
  },

  // Search and discovery
  async search(query: string, filters?: InventoryFilterOptions): Promise<InventoryItem[]> {
    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });
    }
    const response = await apiClient.get<InventoryItem>(`/api/inventory/search?${params}`);
    return response.data;
  },

  // Statistics
  async getStats(filters?: InventoryFilterOptions): Promise<InventoryStats> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });
    }
    const response = await apiClient.get<InventoryStats>(`/api/inventory/stats?${params}`);
    return response.data[0] as InventoryStats; // API returns array, we want the object
  },
};

// Helper to get API endpoint for item type
function getApiEndpoint(itemType: ItemType, id?: number): string {
  const baseEndpoints: Record<ItemType, string> = {
    book: '/api/admin/books',
    volume: '/api/admin/volumes',
    saga: '/api/admin/sagas',
    arc: '/api/admin/arcs',
    issue: '/api/admin/issues',
  };
  
  const base = baseEndpoints[itemType];
  return id ? `${base}/${id}` : base;
}

// Main inventory hook
export function useInventory(options?: InventoryHookOptions) {
  const queryKey = useMemo(() => 
    buildQueryKey(
      'inventory',
      options?.filters,
      options?.pagination,
      options?.sorting
    ),
    [options?.filters, options?.pagination, options?.sorting]
  );

  const fetcher = useMemo(() => createInventoryFetcher(options), [options]);

  const {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
    optimisticUpdate,
    hasMore,
    refetch,
  } = useDataApi<InventoryItem>(queryKey, fetcher, {
    ...options,
    realtime: options?.realtime ?? true,
  });

  // Memoized processed data
  const processedData = useMemo(() => {
    if (!data.length) return data;

    let processed = [...data];

    // Apply client-side search if needed
    if (options?.filters?.search) {
      const searchTerm = options.filters.search.toLowerCase();
      processed = processed.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description?.toLowerCase().includes(searchTerm)
      );
    }

    return processed;
  }, [data, options?.filters?.search]);

  // Build hierarchy if requested
  const hierarchicalData = useMemo(() => {
    if (!options?.includeHierarchy) return null;
    
    return buildHierarchy(processedData);
  }, [processedData, options?.includeHierarchy]);

  // Create operations with optimistic updates
  const createItem = useCallback(async (itemType: ItemType, itemData: InventoryInsert) => {
    const optimisticItem: InventoryItem = {
      id: Date.now(), // Temporary ID
      ...itemData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as InventoryItem;

    return optimisticUpdate(
      () => inventoryApi.create(itemType, itemData),
      {
        optimisticData: (current) => [optimisticItem, ...current],
        rollbackOnError: true,
      }
    );
  }, [optimisticUpdate]);

  const updateItem = useCallback(async (itemType: ItemType, id: number, itemData: InventoryUpdate) => {
    return optimisticUpdate(
      () => inventoryApi.update(itemType, id, itemData),
      {
        optimisticData: (current) => 
          current.map(item => 
            item.id === id ? { ...item, ...itemData, updated_at: new Date().toISOString() } as InventoryItem : item
          ),
        rollbackOnError: true,
      }
    );
  }, [optimisticUpdate]);

  const deleteItem = useCallback(async (itemType: ItemType, id: number) => {
    return optimisticUpdate(
      () => inventoryApi.delete(itemType, id),
      {
        optimisticData: (current) => current.filter(item => item.id !== id),
        rollbackOnError: true,
      }
    );
  }, [optimisticUpdate]);

  // Bulk operations
  const bulkCreate = useCallback(async (items: Array<{ type: ItemType; data: InventoryInsert }>) => {
    const optimisticItems = items.map(({ data }, index) => ({
      id: Date.now() + index,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as InventoryItem));

    return optimisticUpdate(
      () => inventoryApi.bulkCreate(items),
      {
        optimisticData: (current) => [...optimisticItems, ...current],
        rollbackOnError: true,
      }
    );
  }, [optimisticUpdate]);

  const bulkUpdate = useCallback(async (updates: Array<{ type: ItemType; id: number; data: InventoryUpdate }>) => {
    return optimisticUpdate(
      () => inventoryApi.bulkUpdate(updates),
      {
        optimisticData: (current) => {
          const updateMap = new Map(updates.map(u => [u.id, u.data]));
          return current.map(item => {
            const update = updateMap.get(item.id);
            return update ? { ...item, ...update, updated_at: new Date().toISOString() } as InventoryItem : item;
          });
        },
        rollbackOnError: true,
      }
    );
  }, [optimisticUpdate]);

  const bulkDelete = useCallback(async (items: Array<{ type: ItemType; id: number }>) => {
    const idsToDelete = new Set(items.map(item => item.id));
    
    return optimisticUpdate(
      () => inventoryApi.bulkDelete(items),
      {
        optimisticData: (current) => current.filter(item => !idsToDelete.has(item.id)),
        rollbackOnError: true,
      }
    );
  }, [optimisticUpdate]);

  // Reorder items with optimistic updates
  const reorderItems = useCallback(async (
    parentId: number, 
    itemType: ItemType, 
    orderUpdates: Array<{ id: number; order_index: number }>
  ) => {
    return optimisticUpdate(
      () => inventoryApi.reorderItems(parentId, itemType, orderUpdates),
      {
        optimisticData: (current) => {
          const orderMap = new Map(orderUpdates.map(u => [u.id, u.order_index]));
          return current.map(item => {
            const newOrder = orderMap.get(item.id);
            return newOrder !== undefined ? { ...item, order_index: newOrder } : item;
          });
        },
        rollbackOnError: true,
      }
    );
  }, [optimisticUpdate]);

  return {
    // Data
    inventory: processedData,
    hierarchicalInventory: hierarchicalData,
    
    // State
    isLoading,
    isValidating,
    error,
    hasMore,
    
    // Operations
    createItem,
    updateItem,
    deleteItem,
    bulkCreate,
    bulkUpdate,
    bulkDelete,
    reorderItems,
    
    // Utilities
    refetch,
    mutate,
    
    // Direct API access
    api: inventoryApi,
  };
}

// Hook for single inventory item
export function useInventoryItem(itemType: ItemType, id: number) {
  const queryKey = `inventory-item:${itemType}:${id}`;
  
  const fetcher = useCallback(async () => {
    const endpoint = getApiEndpoint(itemType, id);
    const response = await apiClient.get<InventoryItem>(endpoint);
    // Return as array for consistency with useDataApi, but ensure it's a single item
    return Array.isArray(response.data) ? response.data : [response.data];
  }, [itemType, id]);

  const { data, error, isLoading, mutate, optimisticUpdate } = useDataApi<InventoryItem>(
    queryKey,
    fetcher,
    { realtime: true }
  );

  const item = data[0];

  const updateItem = useCallback(async (itemData: InventoryUpdate) => {
    if (!item) throw new Error('Item not found');
    
    return optimisticUpdate(
      () => inventoryApi.update(itemType, id, itemData),
      {
        optimisticData: [{ ...item, ...itemData, updated_at: new Date().toISOString() } as InventoryItem],
        rollbackOnError: true,
      }
    );
  }, [item, itemType, id, optimisticUpdate]);

  const deleteItem = useCallback(async () => {
    if (!item) throw new Error('Item not found');
    
    await inventoryApi.delete(itemType, id);
    mutate([], false); // Clear the data optimistically
  }, [item, itemType, id, mutate]);

  return {
    item,
    isLoading,
    error,
    updateItem,
    deleteItem,
    refetch: () => mutate(),
  };
}

// Hook for inventory statistics
export function useInventoryStats(filters?: InventoryFilterOptions) {
  const queryKey = buildQueryKey('inventory-stats', filters);
  
  const fetcher = useCallback(async () => {
    const stats = await inventoryApi.getStats(filters);
    return [stats]; // Return as array for consistency
  }, [filters]);

  const { data, error, isLoading, refetch } = useDataApi<InventoryStats>(
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

// Helper to build hierarchical structure
function buildHierarchy(items: InventoryItem[]): HierarchicalInventoryItem[] {
  const itemMap = new Map<number, HierarchicalInventoryItem>();
  const roots: HierarchicalInventoryItem[] = [];

  // First pass: create all items with hierarchy info
  items.forEach(item => {
    const hierarchicalItem: HierarchicalInventoryItem = {
      ...item,
      children: [],
      depth: 0,
      hasChildren: false,
    };
    itemMap.set(item.id, hierarchicalItem);
  });

  // Second pass: build parent-child relationships
  items.forEach(item => {
    const hierarchicalItem = itemMap.get(item.id)!;
    
    // Check for parent_id in different item types
    const parentId = 'parent_id' in item ? item.parent_id :
                    'book_id' in item ? item.book_id :
                    'volume_id' in item ? item.volume_id :
                    'saga_id' in item ? item.saga_id :
                    'arc_id' in item ? item.arc_id :
                    null;

    if (parentId) {
      const parent = itemMap.get(parentId);
      if (parent) {
        parent.children!.push(hierarchicalItem);
        parent.hasChildren = true;
        hierarchicalItem.parent = parent;
        hierarchicalItem.depth = parent.depth + 1;
      }
    } else {
      roots.push(hierarchicalItem);
    }
  });

  return roots;
}

// All types are already exported above with their declarations
