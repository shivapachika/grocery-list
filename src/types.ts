export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  store: string;
  completed: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface GroceryList {
  id: string;
  name: string;
  items: GroceryItem[];
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  name: string;
  color: string;
} 