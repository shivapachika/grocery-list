export const UNITS = [
  { value: 'pcs', label: 'Pieces' },
  { value: 'kg', label: 'Kilograms' },
  { value: 'g', label: 'Grams' },
  { value: 'lb', label: 'Pounds' },
  { value: 'oz', label: 'Ounces' },
  { value: 'l', label: 'Liters' },
  { value: 'ml', label: 'Milliliters' },
  { value: 'gal', label: 'Gallons' },
  { value: 'qt', label: 'Quarts' },
  { value: 'pt', label: 'Pints' },
  { value: 'cup', label: 'Cups' },
  { value: 'tbsp', label: 'Tablespoons' },
  { value: 'tsp', label: 'Teaspoons' },
  { value: 'dozen', label: 'Dozen' },
  { value: 'pack', label: 'Pack' },
  { value: 'box', label: 'Box' },
  { value: 'can', label: 'Can' },
  { value: 'bottle', label: 'Bottle' },
] as const;

export const DEFAULT_CATEGORIES = [
  { name: 'Fruits & Vegetables', color: 'green.500' },
  { name: 'Dairy & Eggs', color: 'blue.500' },
  { name: 'Meat & Seafood', color: 'red.500' },
  { name: 'Pantry & Dry Goods', color: 'yellow.500' },
  { name: 'Beverages', color: 'purple.500' },
  { name: 'Frozen Foods', color: 'cyan.500' },
  { name: 'Bakery', color: 'orange.500' },
  { name: 'Snacks', color: 'pink.500' },
  { name: 'Household', color: 'teal.500' },
  { name: 'Personal Care', color: 'indigo.500' },
] as const;

export const DEFAULT_STORES = [
  { name: 'HEB', color: 'red.500' },
  { name: 'Costco', color: 'blue.500' },
  { name: 'Indian Stores', color: 'orange.500' },
  { name: 'Walmart', color: 'blue.400' },
  { name: 'Whole Foods', color: 'green.500' },
  { name: 'Trader Joes', color: 'red.400' },
  { name: 'Target', color: 'red.600' },
] as const;

export const TOAST_DURATION = {
  SUCCESS: 2000,
  ERROR: 5000,
  INFO: 3000,
} as const;

export const QUERY_KEYS = {
  LISTS: 'lists',
  LIST: 'list',
  ITEMS: 'items',
  ITEM: 'item',
  CATEGORIES: 'categories',
  STORES: 'stores',
} as const;
