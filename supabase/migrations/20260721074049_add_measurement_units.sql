create table public.measurement_units (
  code text primary key,
  dimension text not null,
  symbol_uk text not null,
  symbol_en text not null,
  base_multiplier numeric(24, 12) not null,
  sort_order smallint not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint measurement_units_code_format check (code ~ '^[a-z][a-z0-9_]{0,31}$'),
  constraint measurement_units_dimension_supported check (
    dimension in ('mass', 'volume', 'count')
  ),
  constraint measurement_units_symbol_uk_length check (
    char_length(btrim(symbol_uk)) between 1 and 16
  ),
  constraint measurement_units_symbol_en_length check (
    char_length(btrim(symbol_en)) between 1 and 16
  ),
  constraint measurement_units_base_multiplier_positive check (base_multiplier > 0)
);

insert into public.measurement_units (
  code,
  dimension,
  symbol_uk,
  symbol_en,
  base_multiplier,
  sort_order
)
values
  ('g', 'mass', 'г', 'g', 0.001, 10),
  ('kg', 'mass', 'кг', 'kg', 1, 20),
  ('ml', 'volume', 'мл', 'ml', 0.001, 30),
  ('l', 'volume', 'л', 'L', 1, 40),
  ('pcs', 'count', 'шт', 'pcs', 1, 50);

alter table public.plan_targets
drop constraint plan_targets_unit_supported;

alter table public.shopping_items
drop constraint shopping_items_unit_supported;

alter table public.plan_targets
add constraint plan_targets_unit_fkey
foreign key (unit)
references public.measurement_units (code)
on update cascade
on delete restrict;

alter table public.shopping_items
add constraint shopping_items_unit_fkey
foreign key (unit)
references public.measurement_units (code)
on update cascade
on delete restrict;

create index plan_targets_unit_idx
on public.plan_targets (unit);

create index shopping_items_unit_idx
on public.shopping_items (unit);

create trigger measurement_units_set_updated_at
before update on public.measurement_units
for each row
execute function public.set_updated_at();

alter table public.measurement_units enable row level security;

revoke all on table public.measurement_units from anon, authenticated;
grant select on table public.measurement_units to authenticated;
grant all on table public.measurement_units to service_role;

create policy "Authenticated users can read measurement units"
on public.measurement_units
for select
to authenticated
using (true);

comment on table public.measurement_units is
  'Managed measurement-unit catalog. Deactivate referenced units instead of deleting them.';
comment on column public.measurement_units.code is
  'Stable API and foreign-key identifier. Do not repurpose an existing code.';
comment on column public.measurement_units.base_multiplier is
  'Multiplier from this unit to its dimension base unit (kg, l, or pcs).';
