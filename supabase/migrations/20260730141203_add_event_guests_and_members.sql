create table public.event_guests (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null,
  user_id uuid not null,
  name text not null,
  email text,
  phone text,
  adults_count smallint not null default 1,
  children_count smallint not null default 0,
  rsvp_status text not null default 'not_invited',
  note text,
  invited_at timestamptz,
  responded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint event_guests_event_owner_fkey
    foreign key (event_id, user_id)
    references public.events (id, user_id)
    on delete cascade,
  constraint event_guests_id_event_user_unique
    unique (id, event_id, user_id),
  constraint event_guests_name_length
    check (char_length(btrim(name)) between 1 and 120),
  constraint event_guests_email_length
    check (
      email is null
      or char_length(btrim(email)) between 3 and 320
    ),
  constraint event_guests_phone_length
    check (
      phone is null
      or char_length(btrim(phone)) between 7 and 32
    ),
  constraint event_guests_adults_count_range
    check (adults_count between 0 and 20),
  constraint event_guests_children_count_range
    check (children_count between 0 and 20),
  constraint event_guests_party_size_range
    check (adults_count + children_count between 1 and 20),
  constraint event_guests_rsvp_status_supported
    check (
      rsvp_status in (
        'not_invited',
        'pending',
        'accepted',
        'maybe',
        'declined'
      )
    ),
  constraint event_guests_note_length
    check (note is null or char_length(note) <= 500),
  constraint event_guests_invitation_dates_consistent
    check (
      responded_at is null
      or (
        invited_at is not null
        and responded_at >= invited_at
      )
    )
);

comment on table public.event_guests is
  'People expected at an event, including guests who do not have an application account.';

comment on column public.event_guests.rsvp_status is
  'Invitation lifecycle: not_invited, pending, accepted, maybe, or declined.';

create table public.event_members (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null,
  user_id uuid not null,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  guest_id uuid,
  invited_by uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'participant',
  membership_status text not null default 'invited',
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint event_members_event_owner_fkey
    foreign key (event_id, user_id)
    references public.events (id, user_id)
    on delete cascade,
  constraint event_members_guest_event_owner_fkey
    foreign key (guest_id, event_id, user_id)
    references public.event_guests (id, event_id, user_id)
    on delete set null (guest_id),
  constraint event_members_event_profile_unique
    unique (event_id, profile_id),
  constraint event_members_guest_unique
    unique (guest_id),
  constraint event_members_role_supported
    check (role in ('participant', 'co_organizer')),
  constraint event_members_status_supported
    check (
      membership_status in (
        'invited',
        'active',
        'declined',
        'removed'
      )
    ),
  constraint event_members_joined_at_consistent
    check (
      (membership_status = 'active' and joined_at is not null)
      or (membership_status <> 'active' and joined_at is null)
    ),
  constraint event_members_invited_by_owner
    check (invited_by = user_id),
  constraint event_members_owner_is_not_member
    check (profile_id <> user_id)
);

comment on table public.event_members is
  'Registered application users linked to an event. Owners remain events.user_id and are not duplicated here.';

comment on column public.event_members.role is
  'Only participant can currently be assigned through client policies. co_organizer is reserved for a later feature.';

create table public.event_invitation_links (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null,
  user_id uuid not null,
  guest_id uuid,
  link_type text not null,
  label text,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  max_responses integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint event_invitation_links_event_owner_fkey
    foreign key (event_id, user_id)
    references public.events (id, user_id)
    on delete cascade,
  constraint event_invitation_links_guest_event_owner_fkey
    foreign key (guest_id, event_id, user_id)
    references public.event_guests (id, event_id, user_id)
    on delete cascade,
  constraint event_invitation_links_id_event_user_unique
    unique (id, event_id, user_id),
  constraint event_invitation_links_type_supported
    check (link_type in ('personal', 'open')),
  constraint event_invitation_links_target_consistent
    check (
      (link_type = 'personal' and guest_id is not null)
      or (link_type = 'open' and guest_id is null)
    ),
  constraint event_invitation_links_label_length
    check (
      label is null
      or char_length(btrim(label)) between 1 and 80
    ),
  constraint event_invitation_links_expiry_valid
    check (expires_at > created_at),
  constraint event_invitation_links_revoked_at_valid
    check (revoked_at is null or revoked_at >= created_at),
  constraint event_invitation_links_max_responses_valid
    check (max_responses is null or max_responses between 1 and 500)
);

comment on table public.event_invitation_links is
  'Metadata for personal RSVP links and open event links shared with a group chat.';

comment on column public.event_invitation_links.link_type is
  'personal targets one pre-created guest; open lets each respondent create their own guest party.';

create table public.event_invitation_responses (
  id uuid primary key default gen_random_uuid(),
  invitation_link_id uuid not null,
  guest_id uuid not null,
  event_id uuid not null,
  user_id uuid not null,
  created_at timestamptz not null default now(),

  constraint event_invitation_responses_link_event_owner_fkey
    foreign key (invitation_link_id, event_id, user_id)
    references public.event_invitation_links (id, event_id, user_id)
    on delete cascade,
  constraint event_invitation_responses_guest_event_owner_fkey
    foreign key (guest_id, event_id, user_id)
    references public.event_guests (id, event_id, user_id)
    on delete cascade,
  constraint event_invitation_responses_link_guest_unique
    unique (invitation_link_id, guest_id)
);

comment on table public.event_invitation_responses is
  'Links RSVP responses to the guest party created or updated by that response.';

create schema if not exists private;

create table private.event_invitation_tokens (
  id uuid primary key default gen_random_uuid(),
  invitation_link_id uuid not null unique
    references public.event_invitation_links (id)
    on delete cascade,
  token_hash text not null unique,
  last_used_at timestamptz,
  created_at timestamptz not null default now(),

  constraint event_invitation_tokens_hash_format
    check (token_hash ~ '^[0-9a-f]{64}$'),
  constraint event_invitation_tokens_last_used_at_valid
    check (last_used_at is null or last_used_at >= created_at)
);

comment on table private.event_invitation_tokens is
  'SHA-256 hashes for personal and open RSVP links. Plain tokens must never be stored.';

create index event_guests_event_id_idx
on public.event_guests (event_id);

create index event_guests_user_id_idx
on public.event_guests (user_id);

create index event_guests_event_status_idx
on public.event_guests (event_id, rsvp_status);

create unique index event_guests_event_email_unique_idx
on public.event_guests (event_id, lower(btrim(email)))
where email is not null;

create unique index event_guests_event_phone_unique_idx
on public.event_guests (event_id, btrim(phone))
where phone is not null;

create index event_members_event_id_idx
on public.event_members (event_id);

create index event_members_user_id_idx
on public.event_members (user_id);

create index event_members_profile_id_idx
on public.event_members (profile_id);

create index event_members_invited_by_idx
on public.event_members (invited_by);

create index event_members_active_profile_event_idx
on public.event_members (profile_id, event_id)
where membership_status = 'active';

create index event_invitation_links_event_id_idx
on public.event_invitation_links (event_id);

create index event_invitation_links_user_id_idx
on public.event_invitation_links (user_id);

create index event_invitation_links_guest_id_idx
on public.event_invitation_links (guest_id);

create unique index event_invitation_links_active_personal_guest_idx
on public.event_invitation_links (guest_id)
where link_type = 'personal' and revoked_at is null;

create unique index event_invitation_links_active_open_event_idx
on public.event_invitation_links (event_id)
where link_type = 'open' and revoked_at is null;

create index event_invitation_links_active_expiry_idx
on public.event_invitation_links (expires_at)
where revoked_at is null;

create index event_invitation_responses_link_id_idx
on public.event_invitation_responses (invitation_link_id);

create index event_invitation_responses_guest_id_idx
on public.event_invitation_responses (guest_id);

create index event_invitation_responses_event_id_idx
on public.event_invitation_responses (event_id);

create trigger event_guests_set_updated_at
before update on public.event_guests
for each row
execute function public.set_updated_at();

create trigger event_members_set_updated_at
before update on public.event_members
for each row
execute function public.set_updated_at();

create trigger event_invitation_links_set_updated_at
before update on public.event_invitation_links
for each row
execute function public.set_updated_at();

alter table public.event_guests enable row level security;
alter table public.event_members enable row level security;
alter table public.event_invitation_links enable row level security;
alter table public.event_invitation_responses enable row level security;
alter table private.event_invitation_tokens enable row level security;

grant select, insert, update, delete
on table public.event_guests
to authenticated;

grant select, insert, update, delete
on table public.event_members
to authenticated;

grant select
on table public.event_invitation_links
to authenticated;

grant select
on table public.event_invitation_responses
to authenticated;

grant select, insert, update, delete
on table
  public.event_guests,
  public.event_members,
  public.event_invitation_links,
  public.event_invitation_responses
to service_role;

revoke all
on table private.event_invitation_tokens
from public, anon, authenticated;

grant usage on schema private to service_role;
grant select, insert, update, delete
on table private.event_invitation_tokens
to service_role;

create policy "Owners can read event guests"
on public.event_guests
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Owners can create event guests"
on public.event_guests
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Owners can update event guests"
on public.event_guests
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Owners can delete event guests"
on public.event_guests
for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "Owners can read event invitation links"
on public.event_invitation_links
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Owners can read event invitation responses"
on public.event_invitation_responses
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Owners and members can read event memberships"
on public.event_members
for select
to authenticated
using (
  (select auth.uid()) = user_id
  or (select auth.uid()) = profile_id
);

create policy "Owners can invite event participants"
on public.event_members
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and role = 'participant'
);

create policy "Owners can update event participants"
on public.event_members
for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and role = 'participant'
);

create policy "Owners can remove event participants"
on public.event_members
for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "Active members can read joined events"
on public.events
for select
to authenticated
using (
  exists (
    select 1
    from public.event_members
    where event_members.event_id = events.id
      and event_members.profile_id = (select auth.uid())
      and event_members.membership_status = 'active'
  )
);
