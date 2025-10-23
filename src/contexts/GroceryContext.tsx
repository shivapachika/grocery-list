import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { GroceryList, FilterOptions } from '../types';

interface GroceryContextValue {
  currentList: GroceryList | null;
  setCurrentList: (list: GroceryList | null) => void;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions | ((prev: FilterOptions) => FilterOptions)) => void;
  selectedItems: Set<string>;
  toggleItemSelection: (id: string) => void;
  clearSelection: () => void;
  selectAll: (itemIds: string[]) => void;
}

const GroceryContext = createContext<GroceryContextValue | undefined>(undefined);

export function GroceryProvider({ children }: { children: ReactNode }) {
  const [currentList, setCurrentList] = useState<GroceryList | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    storeId: null,
    categoryId: null,
    showCompleted: true,
    searchQuery: '',
  });
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const toggleItemSelection = (id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  const selectAll = (itemIds: string[]) => {
    setSelectedItems(new Set(itemIds));
  };

  const value = useMemo(
    () => ({
      currentList,
      setCurrentList,
      filters,
      setFilters,
      selectedItems,
      toggleItemSelection,
      clearSelection,
      selectAll,
    }),
    [currentList, filters, selectedItems]
  );

  return (
    <GroceryContext.Provider value={value}>
      {children}
    </GroceryContext.Provider>
  );
}

export function useGroceryContext() {
  const context = useContext(GroceryContext);
  if (context === undefined) {
    throw new Error('useGroceryContext must be used within a GroceryProvider');
  }
  return context;
}
