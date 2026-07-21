create or replace function public.update_event_plan(
  p_event_id uuid,
  p_event_data jsonb,
  p_normalized_input jsonb,
  p_result_snapshot jsonb,
  p_rules_version text,
  p_targets jsonb,
  p_checklist_items jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = ''
set statement_timeout = '5s'
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_snapshot_id uuid;
  v_sequence_number integer;
begin
  if v_user_id is null then
    raise exception 'Authentication is required' using errcode = '42501';
  end if;

  perform 1
  from public.events
  where id = p_event_id
    and user_id = v_user_id
  for update;

  if not found then
    raise exception 'Event not found' using errcode = 'P0002';
  end if;

  update public.events
  set
    name = p_event_data ->> 'name',
    event_type = p_event_data ->> 'event_type',
    starts_at = (p_event_data ->> 'starts_at')::timestamptz,
    time_zone = p_event_data ->> 'time_zone',
    duration_hours = (p_event_data ->> 'duration_hours')::smallint,
    location = p_event_data ->> 'location',
    adults_count = (p_event_data ->> 'adults_count')::smallint,
    children_count = (p_event_data ->> 'children_count')::smallint,
    alcohol_guests_count = (p_event_data ->> 'alcohol_guests_count')::smallint,
    menu_format = p_event_data ->> 'menu_format',
    drink_categories = coalesce(
      array(
        select jsonb_array_elements_text(p_event_data -> 'drink_categories')
      ),
      '{}'::text[]
    ),
    budget_amount = (p_event_data ->> 'budget_amount')::numeric,
    notes = nullif(p_event_data ->> 'notes', '')
  where id = p_event_id
    and user_id = v_user_id;

  select coalesce(max(sequence_number), 0) + 1
  into v_sequence_number
  from public.calculation_snapshots
  where event_id = p_event_id
    and user_id = v_user_id;

  insert into public.calculation_snapshots (
    event_id,
    user_id,
    sequence_number,
    rules_version,
    normalized_input,
    result_snapshot
  )
  values (
    p_event_id,
    v_user_id,
    v_sequence_number,
    p_rules_version,
    p_normalized_input,
    p_result_snapshot
  )
  returning id into v_snapshot_id;

  insert into public.plan_targets (
    event_id,
    snapshot_id,
    user_id,
    category,
    target_quantity,
    unit,
    explanation,
    sort_order
  )
  select
    p_event_id,
    v_snapshot_id,
    v_user_id,
    target.category,
    target.target_quantity,
    target.unit,
    target.explanation,
    target.sort_order
  from jsonb_to_recordset(p_targets) as target(
    category text,
    target_quantity numeric,
    unit text,
    explanation jsonb,
    sort_order integer
  );

  delete from public.checklist_items
  where event_id = p_event_id
    and user_id = v_user_id
    and source = 'generated';

  insert into public.checklist_items (
    event_id,
    snapshot_id,
    user_id,
    item_key,
    timing_group,
    source,
    sort_order
  )
  select
    p_event_id,
    v_snapshot_id,
    v_user_id,
    item.item_key,
    item.timing_group,
    'generated',
    item.sort_order
  from jsonb_to_recordset(p_checklist_items) as item(
    item_key text,
    timing_group text,
    sort_order integer
  );

  update public.shopping_items
  set plan_target_id = null
  where event_id = p_event_id
    and user_id = v_user_id
    and plan_target_id is not null;

  update public.events
  set current_snapshot_id = v_snapshot_id
  where id = p_event_id
    and user_id = v_user_id;

  return p_event_id;
end;
$$;

revoke all on function public.update_event_plan(
  uuid,
  jsonb,
  jsonb,
  jsonb,
  text,
  jsonb,
  jsonb
) from public, anon;

grant execute on function public.update_event_plan(
  uuid,
  jsonb,
  jsonb,
  jsonb,
  text,
  jsonb,
  jsonb
) to authenticated;

comment on function public.update_event_plan(
  uuid,
  jsonb,
  jsonb,
  jsonb,
  text,
  jsonb,
  jsonb
) is
  'Atomically updates an owned event and creates its next immutable calculation snapshot.';
