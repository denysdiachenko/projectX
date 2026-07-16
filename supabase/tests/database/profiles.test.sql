begin;

select plan(8);

select has_table('public', 'profiles', 'profiles table exists');

select col_is_pk(
  'public',
  'profiles',
  'id',
  'profiles.id is the primary key'
);

select ok(
  (
    select relrowsecurity
    from pg_class
    where oid = 'public.profiles'::regclass
  ),
  'RLS is enabled on profiles'
);

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '10000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'alice@example.com',
    crypt('password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"Alice","locale":"uk"}'::jsonb,
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '10000000-0000-0000-0000-000000000002',
    'authenticated',
    'authenticated',
    'bob@example.com',
    crypt('password', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"Bob","locale":"en"}'::jsonb,
    now(),
    now()
  );

select is(
  (select count(*)::integer from public.profiles),
  2,
  'a profile is created for every Auth user'
);

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"10000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

select results_eq(
  'select id from public.profiles order by id',
  $$values ('10000000-0000-0000-0000-000000000001'::uuid)$$,
  'a user can read only their own profile'
);

update public.profiles
set display_name = 'Alice Updated'
where id = '10000000-0000-0000-0000-000000000001';

reset role;

select is(
  (
    select display_name
    from public.profiles
    where id = '10000000-0000-0000-0000-000000000001'
  ),
  'Alice Updated',
  'a user can update their own profile'
);

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"10000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

update public.profiles
set display_name = 'Compromised'
where id = '10000000-0000-0000-0000-000000000002';

reset role;

select is(
  (
    select display_name
    from public.profiles
    where id = '10000000-0000-0000-0000-000000000002'
  ),
  'Bob',
  'a user cannot update another profile'
);

delete from auth.users
where id = '10000000-0000-0000-0000-000000000001';

select is(
  (
    select count(*)::integer
    from public.profiles
    where id = '10000000-0000-0000-0000-000000000001'
  ),
  0,
  'deleting an Auth user cascades to their profile'
);

select * from finish();

rollback;
