import { useState, useEffect, useCallback } from 'react';
import { Store } from '../types';
import { fetchStores } from '../lib/supabase/stores';

export function useStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadStores = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchStores();
      setStores(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  return {
    stores,
    isLoading,
    error,
    refetch: loadStores,
  };
}
