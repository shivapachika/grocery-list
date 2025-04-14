export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  completed: boolean;
  category: string;
  store: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: string;
  name: string;
  color: string;
} 