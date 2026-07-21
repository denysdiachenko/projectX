import { supabase } from '@/lib/supabase';

export async function getIsShoppingListEmpty(eventId: string) {
  const { count, error } = await supabase
    .from('shopping_items')
    .select('id', { count: 'exact', head: true })
    .eq('event_id', eventId);

  if (error) throw error;

  return count === 0;
}
