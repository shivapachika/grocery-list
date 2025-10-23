import { useState, useEffect, useCallback } from 'react';
import { GroceryList, UseGroceryListsReturn } from '../types';
import {
  fetchLists,
  createList as createListAPI,
  deleteList as deleteListAPI,
} from '../lib/supabase/lists';

export function useGroceryLists(): UseGroceryListsReturn {
  const [lists, setLists] = useState<GroceryList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadLists = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchLists();
      setLists(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const createList = useCallback(async (name: string): Promise<GroceryList> => {
    const newList = await createListAPI(name);
    setLists((prev: GroceryList[]) => [newList, ...prev]);
    return newList;
  }, []);

  const deleteList = useCallback(async (id: string): Promise<void> => {
    await deleteListAPI(id);
    setLists((prev: GroceryList[]) => prev.filter((list: GroceryList) => list.id !== id));
  }, []);

  return {
    lists,
    isLoading,
    error,
    createList,
    deleteList,
    refetch: loadLists,
  };
}
