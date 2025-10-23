import { useState, useEffect, useCallback } from 'react';
import {
  GroceryItemWithRelations,
  AddItemFormData,
  BulkAction,
  UseGroceryItemsReturn,
  GroceryItem,
} from '../types';
import {
  fetchItems,
  addItem as addItemAPI,
  updateItem as updateItemAPI,
  toggleItem as toggleItemAPI,
  deleteItem as deleteItemAPI,
  bulkCompleteItems,
  bulkDeleteItems,
  reorderItems as reorderItemsAPI,
} from '../lib/supabase/items';

export function useGroceryItems(listId: string | null): UseGroceryItemsReturn {
  const [items, setItems] = useState<GroceryItemWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadItems = useCallback(async () => {
    if (!listId) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchItems(listId);
      setItems(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [listId]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const addItem = useCallback(
    async (itemData: AddItemFormData): Promise<GroceryItem> => {
      if (!listId) throw new Error('No list selected');

      const newItem = await addItemAPI(listId, itemData);
      await loadItems(); // Reload to get relations
      return newItem;
    },
    [listId, loadItems]
  );

  const updateItem = useCallback(
    async (id: string, updates: Partial<GroceryItem>): Promise<void> => {
      // Optimistic update
      setItems((prev: GroceryItemWithRelations[]) =>
        prev.map((item: GroceryItemWithRelations) =>
          item.id === id ? { ...item, ...updates } : item
        )
      );

      try {
        await updateItemAPI(id, updates);
      } catch (err) {
        // Revert on error
        await loadItems();
        throw err;
      }
    },
    [loadItems]
  );

  const toggleItem = useCallback(
    async (id: string): Promise<void> => {
      // Optimistic update
      setItems((prev: GroceryItemWithRelations[]) =>
        prev.map((item: GroceryItemWithRelations) =>
          item.id === id ? { ...item, completed: !item.completed } : item
        )
      );

      try {
        await toggleItemAPI(id);
      } catch (err) {
        // Revert on error
        await loadItems();
        throw err;
      }
    },
    [loadItems]
  );

  const deleteItem = useCallback(
    async (id: string): Promise<void> => {
      // Optimistic update
      setItems((prev: GroceryItemWithRelations[]) => prev.filter((item: GroceryItemWithRelations) => item.id !== id));

      try {
        await deleteItemAPI(id);
      } catch (err) {
        // Revert on error
        await loadItems();
        throw err;
      }
    },
    [loadItems]
  );

  const bulkAction = useCallback(
    async (action: BulkAction): Promise<void> => {
      const { type, itemIds } = action;

      if (type === 'complete') {
        await bulkCompleteItems(itemIds);
      } else if (type === 'delete') {
        await bulkDeleteItems(itemIds);
      }

      await loadItems();
    },
    [loadItems]
  );

  const reorderItems = useCallback(
    async (itemIds: string[]): Promise<void> => {
      // Optimistic update
      const reorderedItems = itemIds.map((id: string, index: number) => {
        const item = items.find((i: GroceryItemWithRelations) => i.id === id);
        return item ? { ...item, position: index } : null;
      }).filter(Boolean) as GroceryItemWithRelations[];

      setItems(reorderedItems);

      try {
        await reorderItemsAPI(itemIds);
      } catch (err) {
        // Revert on error
        await loadItems();
        throw err;
      }
    },
    [items, loadItems]
  );

  return {
    items,
    isLoading,
    error,
    addItem,
    updateItem,
    toggleItem,
    deleteItem,
    bulkAction,
    reorderItems,
    refetch: loadItems,
  };
}
