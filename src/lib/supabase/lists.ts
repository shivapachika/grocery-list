import { supabase } from './client';
import { GroceryList } from '../../types';

/**
 * Fetch all grocery lists
 */
export async function fetchLists(): Promise<GroceryList[]> {
  const { data, error } = await supabase
    .from('lists')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Fetch a single list by ID
 */
export async function fetchList(id: string): Promise<GroceryList | null> {
  const { data, error } = await supabase
    .from('lists')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data;
}

/**
 * Create a new grocery list
 */
export async function createList(name: string): Promise<GroceryList> {
  const { data, error } = await supabase
    .from('lists')
    .insert([{ name }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a grocery list
 */
export async function updateList(
  id: string,
  updates: Partial<Pick<GroceryList, 'name'>>
): Promise<GroceryList> {
  const { data, error } = await supabase
    .from('lists')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a grocery list (will cascade delete all items)
 */
export async function deleteList(id: string): Promise<void> {
  const { error } = await supabase
    .from('lists')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
