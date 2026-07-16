create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  locale text not null default 'uk',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint profiles_display_name_length
    check (
      display_name is null
      or char_length(btrim(display_name)) between 1 and 120
    ),
  constraint profiles_avatar_url_length
    check (avatar_url is null or char_length(avatar_url) <= 2048),
  constraint profiles_locale_supported
    check (locale in ('uk', 'en'))
);

comment on table public.profiles is
  'Application profile data for a Supabase Auth user.';
comment on column public.profiles.id is
  'Matches auth.users.id. Deleting the Auth user removes the profile.';
comment on column public.profiles.locale is
  'Preferred application language.';

alter table public.profiles enable row level security;

revoke all on table public.profiles from anon;
revoke all on table public.profiles from authenticated;
grant select, update on table public.profiles to authenticated;
grant all on table public.profiles to service_role;

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_updated_at() from public, anon, authenticated;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  profile_name text;
  profile_avatar_url text;
  profile_locale text;
begin
  profile_name := nullif(
    btrim(
      coalesce(
        new.raw_user_meta_data ->> 'display_name',
        new.raw_user_meta_data ->> 'full_name',
        new.raw_user_meta_data ->> 'name'
      )
    ),
    ''
  );

  profile_avatar_url := nullif(
    btrim(new.raw_user_meta_data ->> 'avatar_url'),
    ''
  );

  profile_locale := case
    when new.raw_user_meta_data ->> 'locale' in ('uk', 'en')
      then new.raw_user_meta_data ->> 'locale'
    else 'uk'
  end;

  insert into public.profiles (id, display_name, avatar_url, locale)
  values (
    new.id,
    left(profile_name, 120),
    left(profile_avatar_url, 2048),
    profile_locale
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

insert into public.profiles (id, display_name, avatar_url, locale, created_at, updated_at)
select
  users.id,
  left(
    nullif(
      btrim(
        coalesce(
          users.raw_user_meta_data ->> 'display_name',
          users.raw_user_meta_data ->> 'full_name',
          users.raw_user_meta_data ->> 'name'
        )
      ),
      ''
    ),
    120
  ),
  left(
    nullif(btrim(users.raw_user_meta_data ->> 'avatar_url'), ''),
    2048
  ),
  case
    when users.raw_user_meta_data ->> 'locale' in ('uk', 'en')
      then users.raw_user_meta_data ->> 'locale'
    else 'uk'
  end,
  coalesce(users.created_at, now()),
  now()
from auth.users as users
on conflict (id) do nothing;
