import { supabase } from './client';
import { Category } from '../../types';

/**
 * Fetch all categories
 */
export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

/**
 * Create a new category
 */
export async function createCategory(
  name: string,
  color: string
): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name, color }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a category
 */
export async function updateCategory(
  id: string,
  updates: Partial<Pick<Category, 'name' | 'color'>>
): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
