begin;

select plan(8);

select has_table(
  'public',
  'measurement_units',
  'measurement_units table exists'
);

select col_is_pk(
  'public',
  'measurement_units',
  'code',
  'measurement_units.code is the primary key'
);

select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'public.measurement_units'::regclass
  ),
  'RLS is enabled on measurement_units'
);

select is(
  (select count(*)::integer from public.measurement_units),
  5,
  'default measurement units are seeded'
);

select ok(
  has_table_privilege('authenticated', 'public.measurement_units', 'select'),
  'authenticated users have select privilege'
);

select ok(
  not has_table_privilege('authenticated', 'public.measurement_units', 'insert'),
  'authenticated users cannot insert units'
);

select ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = 'public.plan_targets'::regclass
      and conname = 'plan_targets_unit_fkey'
      and contype = 'f'
  ),
  'plan targets reference measurement units'
);

select ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = 'public.shopping_items'::regclass
      and conname = 'shopping_items_unit_fkey'
      and contype = 'f'
  ),
  'shopping items reference measurement units'
);

select * from finish();

rollback;
