import { supabase } from './client';
import { GroceryItem, GroceryItemWithRelations, AddItemFormData } from '../../types';

/**
 * Fetch all items for a specific list with relations
 */
export async function fetchItems(listId: string): Promise<GroceryItemWithRelations[]> {
  const { data, error } = await supabase
    .from('items')
    .select(`
      *,
      category:categories(*),
      store:stores(*)
    `)
    .eq('list_id', listId)
    .order('position', { ascending: true });

  if (error) throw error;

  // Transform the nested objects
  return (data || []).map((item: any) => ({
    ...item,
    category: Array.isArray(item.category) ? item.category[0] : item.category,
    store: Array.isArray(item.store) ? item.store[0] : item.store,
  })) as GroceryItemWithRelations[];
}

/**
 * Add a new item to a list
 */
export async function addItem(
  listId: string,
  itemData: AddItemFormData
): Promise<GroceryItem> {
  // Get the max position for this list
  const { data: maxPositionData } = await supabase
    .from('items')
    .select('position')
    .eq('list_id', listId)
    .order('position', { ascending: false })
    .limit(1);

  const maxPosition = maxPositionData?.[0]?.position ?? -1;
  const newPosition = maxPosition + 1;

  const { data, error } = await supabase
    .from('items')
    .insert([
      {
        list_id: listId,
        ...itemData,
        position: newPosition,
        completed: false,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // Update list's updated_at
  await supabase
    .from('lists')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', listId);

  return data;
}

/**
 * Update an item
 */
export async function updateItem(
  id: string,
  updates: Partial<GroceryItem>
): Promise<GroceryItem> {
  const { data, error } = await supabase
    .from('items')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Update list's updated_at
  await supabase
    .from('lists')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', data.list_id);

  return data;
}

/**
 * Toggle item completion status
 */
export async function toggleItem(id: string): Promise<GroceryItem> {
  // First fetch the current item
  const { data: currentItem } = await supabase
    .from('items')
    .select('completed, list_id')
    .eq('id', id)
    .single();

  if (!currentItem) throw new Error('Item not found');

  return updateItem(id, { completed: !currentItem.completed });
}

/**
 * Delete an item
 */
export async function deleteItem(id: string): Promise<void> {
  // Get list_id first
  const { data: item } = await supabase
    .from('items')
    .select('list_id')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id);

  if (error) throw error;

  // Update list's updated_at
  if (item) {
    await supabase
      .from('lists')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', item.list_id);
  }
}

/**
 * Bulk complete items
 */
export async function bulkCompleteItems(itemIds: string[]): Promise<void> {
  const { error } = await supabase
    .from('items')
    .update({ completed: true, updated_at: new Date().toISOString() })
    .in('id', itemIds);

  if (error) throw error;
}

/**
 * Bulk delete items
 */
export async function bulkDeleteItems(itemIds: string[]): Promise<void> {
  const { error } = await supabase
    .from('items')
    .delete()
    .in('id', itemIds);

  if (error) throw error;
}

/**
 * Reorder items (update positions)
 */
export async function reorderItems(
  itemIds: string[]
): Promise<void> {
  // Update positions based on order in array
  const updates = itemIds.map((id, index) => ({
    id,
    position: index,
    updated_at: new Date().toISOString(),
  }));

  for (const update of updates) {
    await supabase
      .from('items')
      .update({ position: update.position, updated_at: update.updated_at })
      .eq('id', update.id);
  }
}
