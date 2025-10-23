// Database types matching Supabase schema
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at'>;
        Update: Partial<Omit<Category, 'id' | 'created_at'>>;
      };
      stores: {
        Row: Store;
        Insert: Omit<Store, 'id' | 'created_at'>;
        Update: Partial<Omit<Store, 'id' | 'created_at'>>;
      };
      lists: {
        Row: GroceryList;
        Insert: Omit<GroceryList, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<GroceryList, 'id' | 'created_at'>>;
      };
      items: {
        Row: GroceryItem;
        Insert: Omit<GroceryItem, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<GroceryItem, 'id' | 'created_at'>>;
      };
    };
  };
}

export interface Category {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Store {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface GroceryList {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface GroceryItem {
  id: string;
  list_id: string;
  name: string;
  quantity: number;
  unit: string;
  category_id: string;
  store_id: string;
  completed: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

// UI Types
export interface GroceryItemWithRelations extends GroceryItem {
  category?: Category;
  store?: Store;
}

export interface GroceryListWithItems extends GroceryList {
  items: GroceryItemWithRelations[];
}

export interface FilterOptions {
  storeId?: string | null;
  categoryId?: string | null;
  showCompleted?: boolean;
  searchQuery?: string;
}

export interface BulkAction {
  type: 'complete' | 'delete' | 'move';
  itemIds: string[];
  targetListId?: string;
}

// Form Types
export interface AddItemFormData {
  name: string;
  quantity: number;
  unit: string;
  category_id: string;
  store_id: string;
}

export interface CreateListFormData {
  name: string;
}

// Hook Return Types
export interface UseGroceryListsReturn {
  lists: GroceryList[];
  isLoading: boolean;
  error: Error | null;
  createList: (name: string) => Promise<GroceryList>;
  deleteList: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export interface UseGroceryItemsReturn {
  items: GroceryItemWithRelations[];
  isLoading: boolean;
  error: Error | null;
  addItem: (item: AddItemFormData) => Promise<GroceryItem>;
  updateItem: (id: string, updates: Partial<GroceryItem>) => Promise<void>;
  toggleItem: (id: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  bulkAction: (action: BulkAction) => Promise<void>;
  reorderItems: (itemIds: string[]) => Promise<void>;
  refetch: () => Promise<void>;
}
