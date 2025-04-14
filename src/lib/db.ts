import { supabase } from './supabase';
import { GroceryList, GroceryItem } from '../types';

export async function fetchLists() {
  const { data, error } = await supabase
    .from('lists')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as GroceryList[];
}

export async function createList(name: string) {
  const newList = {
    name,
    items: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('lists')
    .insert([newList])
    .select()
    .single();

  if (error) throw error;
  return data as GroceryList;
}

export async function updateList(list: GroceryList) {
  const { error } = await supabase
    .from('lists')
    .update({
      name: list.name,
      items: list.items,
      updated_at: new Date().toISOString(),
    })
    .eq('id', list.id);

  if (error) throw error;
}

export async function deleteList(id: string) {
  const { error } = await supabase
    .from('lists')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function addItem(listId: string, item: Omit<GroceryItem, 'id' | 'completed'>) {
  const { data: list } = await supabase
    .from('lists')
    .select('items')
    .eq('id', listId)
    .single();

  if (!list) throw new Error('List not found');

  const newItem: GroceryItem = {
    ...item,
    id: Date.now().toString(),
    completed: false,
  };

  const updatedItems = [...(list.items || []), newItem];

  const { error } = await supabase
    .from('lists')
    .update({
      items: updatedItems,
      updated_at: new Date().toISOString(),
    })
    .eq('id', listId);

  if (error) throw error;
  return newItem;
}

export async function toggleItem(listId: string, itemId: string) {
  const { data: list } = await supabase
    .from('lists')
    .select('items')
    .eq('id', listId)
    .single();

  if (!list) throw new Error('List not found');

  const updatedItems = (list.items || []).map((item: GroceryItem) =>
    item.id === itemId ? { ...item, completed: !item.completed } : item
  );

  const { error } = await supabase
    .from('lists')
    .update({
      items: updatedItems,
      updated_at: new Date().toISOString(),
    })
    .eq('id', listId);

  if (error) throw error;
}

export async function deleteItem(listId: string, itemId: string) {
  const { data: list } = await supabase
    .from('lists')
    .select('items')
    .eq('id', listId)
    .single();

  if (!list) throw new Error('List not found');

  const updatedItems = (list.items || []).filter(
    (item: GroceryItem) => item.id !== itemId
  );

  const { error } = await supabase
    .from('lists')
    .update({
      items: updatedItems,
      updated_at: new Date().toISOString(),
    })
    .eq('id', listId);

  if (error) throw error;
} 