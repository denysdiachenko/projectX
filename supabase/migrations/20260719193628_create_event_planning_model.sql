create table public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  event_type text not null,
  starts_at timestamptz not null,
  time_zone text not null,
  duration_hours smallint not null,
  location text not null,
  adults_count smallint not null,
  children_count smallint not null,
  alcohol_guests_count smallint not null,
  menu_format text not null,
  drink_categories text[] not null default '{}',
  budget_amount numeric(12, 2),
  currency text not null default 'UAH',
  notes text,
  status text not null default 'planned',
  budget_outcome text,
  budget_feedback_at timestamptz,
  current_snapshot_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint events_id_user_id_unique unique (id, user_id),
  constraint events_name_length check (char_length(btrim(name)) between 1 and 120),
  constraint events_event_type_supported
    check (event_type in ('birthday', 'bbq', 'home_party')),
  constraint events_time_zone_length
    check (char_length(btrim(time_zone)) between 1 and 100),
  constraint events_duration_hours_range check (duration_hours between 1 and 24),
  constraint events_location_supported check (location in ('indoor', 'outdoor')),
  constraint events_adults_count_range check (adults_count between 0 and 100),
  constraint events_children_count_range check (children_count between 0 and 100),
  constraint events_total_guests_range
    check (adults_count + children_count between 1 and 100),
  constraint events_alcohol_guests_count_range
    check (alcohol_guests_count between 0 and adults_count),
  constraint events_menu_format_supported
    check (menu_format in ('snacks', 'buffet', 'full_menu')),
  constraint events_drink_categories_supported
    check (drink_categories <@ array['beer', 'wine', 'spirits', 'juice', 'soda']::text[]),
  constraint events_budget_amount_non_negative
    check (budget_amount is null or budget_amount >= 0),
  constraint events_currency_supported check (currency = 'UAH'),
  constraint events_notes_length check (notes is null or char_length(notes) <= 1000),
  constraint events_status_supported
    check (status in ('planned', 'completed', 'cancelled')),
  constraint events_budget_outcome_supported
    check (budget_outcome is null or budget_outcome in ('within_budget', 'over_budget')),
  constraint events_budget_outcome_requires_budget
    check (budget_outcome is null or budget_amount is not null),
  constraint events_budget_feedback_consistent
    check (
      (budget_outcome is null and budget_feedback_at is null)
      or (budget_outcome is not null and budget_feedback_at is not null)
    )
);

create table public.calculation_snapshots (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null,
  user_id uuid not null,
  sequence_number integer not null,
  rules_version text not null,
  normalized_input jsonb not null,
  result_snapshot jsonb not null,
  created_at timestamptz not null default now(),

  constraint calculation_snapshots_event_owner_fkey
    foreign key (event_id, user_id)
    references public.events (id, user_id)
    on delete cascade,
  constraint calculation_snapshots_id_event_user_unique
    unique (id, event_id, user_id),
  constraint calculation_snapshots_event_sequence_unique
    unique (event_id, sequence_number),
  constraint calculation_snapshots_sequence_positive check (sequence_number > 0),
  constraint calculation_snapshots_rules_version_length
    check (char_length(btrim(rules_version)) between 1 and 50),
  constraint calculation_snapshots_input_is_object
    check (jsonb_typeof(normalized_input) = 'object'),
  constraint calculation_snapshots_result_is_object
    check (jsonb_typeof(result_snapshot) = 'object')
);

alter table public.events
add constraint events_current_snapshot_fkey
foreign key (current_snapshot_id, id, user_id)
references public.calculation_snapshots (id, event_id, user_id)
on delete set null (current_snapshot_id);

create table public.plan_targets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null,
  snapshot_id uuid not null,
  user_id uuid not null,
  category text not null,
  target_quantity numeric(12, 3) not null,
  unit text not null,
  explanation jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),

  constraint plan_targets_snapshot_owner_fkey
    foreign key (snapshot_id, event_id, user_id)
    references public.calculation_snapshots (id, event_id, user_id)
    on delete cascade,
  constraint plan_targets_id_event_user_unique unique (id, event_id, user_id),
  constraint plan_targets_snapshot_category_unique unique (snapshot_id, category),
  constraint plan_targets_category_supported check (
    category in (
      'snacks_and_canapes',
      'substantial_food',
      'sides_and_vegetables',
      'fruit_and_dessert',
      'water',
      'juice',
      'soda',
      'beer',
      'wine',
      'spirits',
      'ice',
      'plates',
      'cups',
      'napkins'
    )
  ),
  constraint plan_targets_quantity_positive check (target_quantity > 0),
  constraint plan_targets_unit_supported check (unit in ('kg', 'l', 'pcs')),
  constraint plan_targets_explanation_is_object
    check (jsonb_typeof(explanation) = 'object')
);

create table public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null,
  plan_target_id uuid,
  user_id uuid not null,
  name text not null,
  quantity numeric(12, 3) not null,
  unit text not null,
  package_size numeric(12, 3),
  package_count integer,
  note text,
  is_purchased boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint shopping_items_event_owner_fkey
    foreign key (event_id, user_id)
    references public.events (id, user_id)
    on delete cascade,
  constraint shopping_items_target_owner_fkey
    foreign key (plan_target_id, event_id, user_id)
    references public.plan_targets (id, event_id, user_id)
    on delete set null (plan_target_id),
  constraint shopping_items_name_length check (char_length(btrim(name)) between 1 and 120),
  constraint shopping_items_quantity_positive check (quantity > 0),
  constraint shopping_items_unit_supported check (unit in ('g', 'kg', 'ml', 'l', 'pcs')),
  constraint shopping_items_package_values_positive check (
    (package_size is null or package_size > 0)
    and (package_count is null or package_count > 0)
  ),
  constraint shopping_items_package_values_consistent check (
    (package_size is null and package_count is null)
    or (package_size is not null and package_count is not null)
  ),
  constraint shopping_items_note_length check (note is null or char_length(note) <= 500)
);

create table public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null,
  snapshot_id uuid,
  user_id uuid not null,
  source text not null default 'generated',
  item_key text,
  custom_title text,
  timing_group text not null,
  is_completed boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint checklist_items_event_owner_fkey
    foreign key (event_id, user_id)
    references public.events (id, user_id)
    on delete cascade,
  constraint checklist_items_snapshot_owner_fkey
    foreign key (snapshot_id, event_id, user_id)
    references public.calculation_snapshots (id, event_id, user_id)
    on delete set null (snapshot_id),
  constraint checklist_items_source_supported check (source in ('generated', 'custom')),
  constraint checklist_items_content_consistent check (
    (source = 'generated' and item_key is not null and custom_title is null)
    or (source = 'custom' and item_key is null and custom_title is not null)
  ),
  constraint checklist_items_item_key_length
    check (item_key is null or char_length(btrim(item_key)) between 1 and 100),
  constraint checklist_items_custom_title_length
    check (custom_title is null or char_length(btrim(custom_title)) between 1 and 200),
  constraint checklist_items_timing_group_supported
    check (timing_group in ('week_before', 'day_before', 'event_day'))
);

create index events_user_starts_at_idx
on public.events (user_id, starts_at desc);

create index events_user_status_idx
on public.events (user_id, status);

create index calculation_snapshots_user_id_idx
on public.calculation_snapshots (user_id);

create index plan_targets_event_id_idx
on public.plan_targets (event_id);

create index plan_targets_user_id_idx
on public.plan_targets (user_id);

create index shopping_items_event_id_idx
on public.shopping_items (event_id);

create index shopping_items_plan_target_id_idx
on public.shopping_items (plan_target_id)
where plan_target_id is not null;

create index shopping_items_user_id_idx
on public.shopping_items (user_id);

create index checklist_items_event_id_idx
on public.checklist_items (event_id);

create index checklist_items_snapshot_id_idx
on public.checklist_items (snapshot_id)
where snapshot_id is not null;

create index checklist_items_user_id_idx
on public.checklist_items (user_id);

create trigger events_set_updated_at
before update on public.events
for each row
execute function public.set_updated_at();

create trigger shopping_items_set_updated_at
before update on public.shopping_items
for each row
execute function public.set_updated_at();

create trigger checklist_items_set_updated_at
before update on public.checklist_items
for each row
execute function public.set_updated_at();

alter table public.events enable row level security;
alter table public.calculation_snapshots enable row level security;
alter table public.plan_targets enable row level security;
alter table public.shopping_items enable row level security;
alter table public.checklist_items enable row level security;

revoke all on table public.events from anon, authenticated;
revoke all on table public.calculation_snapshots from anon, authenticated;
revoke all on table public.plan_targets from anon, authenticated;
revoke all on table public.shopping_items from anon, authenticated;
revoke all on table public.checklist_items from anon, authenticated;

grant select, insert, update, delete on table public.events to authenticated;
grant select, insert on table public.calculation_snapshots to authenticated;
grant select, insert on table public.plan_targets to authenticated;
grant select, insert, update, delete on table public.shopping_items to authenticated;
grant select, insert, update, delete on table public.checklist_items to authenticated;

grant all on table public.events to service_role;
grant all on table public.calculation_snapshots to service_role;
grant all on table public.plan_targets to service_role;
grant all on table public.shopping_items to service_role;
grant all on table public.checklist_items to service_role;

create policy "Users can manage their own events"
on public.events
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can read their own calculation snapshots"
on public.calculation_snapshots
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own calculation snapshots"
on public.calculation_snapshots
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can read their own plan targets"
on public.plan_targets
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own plan targets"
on public.plan_targets
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can manage their own shopping items"
on public.shopping_items
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can manage their own checklist items"
on public.checklist_items
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

comment on table public.events is
  'User-owned event parameters. Budget is informational and never affects calculations.';
comment on table public.calculation_snapshots is
  'Immutable versioned inputs and outputs produced by the deterministic calculation engine.';
comment on table public.plan_targets is
  'Calculated category-level quantity targets; never concrete products or prices.';
comment on table public.shopping_items is
  'Concrete products entered and maintained exclusively by the user.';
comment on table public.checklist_items is
  'Generated and custom preparation tasks for an event.';
