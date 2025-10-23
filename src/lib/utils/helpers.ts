import { GroceryItemWithRelations, FilterOptions } from '../../types';

/**
 * Filter items based on filter options
 */
export function filterItems(
  items: GroceryItemWithRelations[],
  filters: FilterOptions
): GroceryItemWithRelations[] {
  return items.filter((item) => {
    // Store filter
    if (filters.storeId && item.store_id !== filters.storeId) {
      return false;
    }

    // Category filter
    if (filters.categoryId && item.category_id !== filters.categoryId) {
      return false;
    }

    // Completed filter
    if (filters.showCompleted === false && item.completed) {
      return false;
    }

    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(query);
    }

    return true;
  });
}

/**
 * Group items by store
 */
export function groupItemsByStore(
  items: GroceryItemWithRelations[]
): Record<string, GroceryItemWithRelations[]> {
  return items.reduce((acc, item) => {
    const storeId = item.store_id;
    if (!acc[storeId]) {
      acc[storeId] = [];
    }
    acc[storeId].push(item);
    return acc;
  }, {} as Record<string, GroceryItemWithRelations[]>);
}

/**
 * Count items by store
 */
export function countItemsByStore(
  items: GroceryItemWithRelations[]
): Record<string, number> {
  return items.reduce((acc, item) => {
    const storeId = item.store_id;
    acc[storeId] = (acc[storeId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Sort items by position
 */
export function sortItemsByPosition(
  items: GroceryItemWithRelations[]
): GroceryItemWithRelations[] {
  return [...items].sort((a, b) => a.position - b.position);
}

/**
 * Format date for display
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  return formatDate(date);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate a unique temporary ID
 */
export function generateTempId(): string {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
