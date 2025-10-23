import { supabase } from './client';
import { Store } from '../../types';

/**
 * Fetch all stores
 */
export async function fetchStores(): Promise<Store[]> {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

/**
 * Create a new store
 */
export async function createStore(
  name: string,
  color: string
): Promise<Store> {
  const { data, error } = await supabase
    .from('stores')
    .insert([{ name, color }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a store
 */
export async function updateStore(
  id: string,
  updates: Partial<Pick<Store, 'name' | 'color'>>
): Promise<Store> {
  const { data, error } = await supabase
    .from('stores')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a store
 */
export async function deleteStore(id: string): Promise<void> {
  const { error } = await supabase
    .from('stores')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
