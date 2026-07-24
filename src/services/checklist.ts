import { supabase } from '@/lib/supabase';
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database';

export type ChecklistItem = Tables<'checklist_items'>;

export async function getChecklist(eventId: string) {
  const { data, error } = await supabase
    .from('checklist_items')
    .select('*')
    .eq('event_id', eventId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) throw error;

  return data satisfies ChecklistItem[];
}

export async function createChecklistItem({
  eventId,
  sortOrder,
  title,
}: {
  eventId: string;
  sortOrder: number;
  title: string;
}) {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    throw authError ?? new Error('Authentication required');
  }

  const payload: TablesInsert<'checklist_items'> = {
    custom_title: title.trim(),
    event_id: eventId,
    sort_order: sortOrder,
    source: 'custom',
    timing_group: 'week_before',
    user_id: authData.user.id,
  };
  const { data, error } = await supabase
    .from('checklist_items')
    .insert(payload)
    .select('*')
    .single();

  if (error) throw error;

  return data satisfies ChecklistItem;
}

export async function updateChecklistItem(itemId: string, title: string) {
  const payload: TablesUpdate<'checklist_items'> = {
    custom_title: title.trim(),
  };
  const { data, error } = await supabase
    .from('checklist_items')
    .update(payload)
    .eq('id', itemId)
    .eq('source', 'custom')
    .select('*')
    .single();

  if (error) throw error;

  return data satisfies ChecklistItem;
}

export async function setChecklistItemCompleted(itemId: string, isCompleted: boolean) {
  const { data, error } = await supabase
    .from('checklist_items')
    .update({ is_completed: isCompleted })
    .eq('id', itemId)
    .select('*')
    .single();

  if (error) throw error;

  return data satisfies ChecklistItem;
}

export async function deleteChecklistItem(itemId: string) {
  const { data, error } = await supabase
    .from('checklist_items')
    .delete()
    .eq('id', itemId)
    .select('id')
    .single();

  if (error) throw error;

  return data.id;
}
