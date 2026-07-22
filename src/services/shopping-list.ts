import { supabase } from '@/lib/supabase';
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database';

import { getEventPlan } from './event-plan';

export type ShoppingItem = Tables<'shopping_items'>;

export type ShoppingTarget = {
  category: string;
  id: string;
  sortOrder: number;
  targetQuantity: number;
  unit: string;
};

export type ShoppingItemValues = {
  name: string;
  packageCount: number | null;
  packageSize: number | null;
  quantity: number;
  unit: string;
};

export async function getShoppingList(eventId: string) {
  const [plan, itemsResult] = await Promise.all([
    getEventPlan(eventId),
    supabase
      .from('shopping_items')
      .select('*')
      .eq('event_id', eventId)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true }),
  ]);

  if (itemsResult.error) throw itemsResult.error;

  return {
    items: itemsResult.data satisfies ShoppingItem[],
    targets: plan.targets satisfies ShoppingTarget[],
    units: plan.units,
  };
}

export async function getIsShoppingListEmpty(eventId: string) {
  const { count, error } = await supabase
    .from('shopping_items')
    .select('id', { count: 'exact', head: true })
    .eq('event_id', eventId);

  if (error) throw error;

  return count === 0;
}

export async function createShoppingItem({
  eventId,
  planTargetId,
  sortOrder,
  values,
}: {
  eventId: string;
  planTargetId: string;
  sortOrder: number;
  values: ShoppingItemValues;
}) {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) throw authError ?? new Error('Authentication required');

  const payload: TablesInsert<'shopping_items'> = {
    event_id: eventId,
    name: values.name.trim(),
    package_count: values.packageCount,
    package_size: values.packageSize,
    plan_target_id: planTargetId,
    quantity: values.quantity,
    sort_order: sortOrder,
    unit: values.unit,
    user_id: authData.user.id,
  };
  const { data, error } = await supabase
    .from('shopping_items')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;

  return data satisfies ShoppingItem;
}

export async function updateShoppingItem(itemId: string, values: ShoppingItemValues) {
  const payload: TablesUpdate<'shopping_items'> = {
    name: values.name.trim(),
    package_count: values.packageCount,
    package_size: values.packageSize,
    quantity: values.quantity,
    unit: values.unit,
  };
  const { data, error } = await supabase
    .from('shopping_items')
    .update(payload)
    .eq('id', itemId)
    .select('*')
    .single();

  if (error) throw error;

  return data satisfies ShoppingItem;
}

export async function setShoppingItemPurchased(itemId: string, isPurchased: boolean) {
  const { data, error } = await supabase
    .from('shopping_items')
    .update({ is_purchased: isPurchased })
    .eq('id', itemId)
    .select('*')
    .single();

  if (error) throw error;

  return data satisfies ShoppingItem;
}

export async function deleteShoppingItem(itemId: string) {
  const { data, error } = await supabase
    .from('shopping_items')
    .delete()
    .eq('id', itemId)
    .select('id')
    .single();

  if (error) throw error;

  return data.id;
}
