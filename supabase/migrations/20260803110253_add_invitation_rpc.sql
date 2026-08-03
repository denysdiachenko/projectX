alter table public.event_invitation_responses
add column response_key uuid not null default gen_random_uuid();

create unique index event_invitation_responses_link_response_key_idx
on public.event_invitation_responses (invitation_link_id, response_key);

comment on column public.event_invitation_responses.response_key is
  'Client-generated idempotency key that prevents duplicate RSVP submissions.';

create function public.ensure_open_event_invitation(
  p_event_id uuid,
  p_user_id uuid,
  p_expires_in_days integer default 90
)
returns table (
  invitation_id uuid,
  invitation_expires_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  active_link public.event_invitation_links%rowtype;
begin
  if p_expires_in_days not between 1 and 365 then
    raise exception 'Invitation expiry must be between 1 and 365 days'
      using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.events
    where events.id = p_event_id
      and events.user_id = p_user_id
  ) then
    raise exception 'Event not found'
      using errcode = 'P0002';
  end if;

  update public.event_invitation_links
  set revoked_at = now()
  where event_id = p_event_id
    and user_id = p_user_id
    and link_type = 'open'
    and revoked_at is null
    and expires_at <= now();

  select invitation_links.*
  into active_link
  from public.event_invitation_links as invitation_links
  where invitation_links.event_id = p_event_id
    and invitation_links.user_id = p_user_id
    and invitation_links.link_type = 'open'
    and invitation_links.revoked_at is null
    and invitation_links.expires_at > now()
  order by invitation_links.created_at desc
  limit 1;

  if active_link.id is null then
    insert into public.event_invitation_links (
      event_id,
      user_id,
      link_type,
      expires_at,
      max_responses
    )
    values (
      p_event_id,
      p_user_id,
      'open',
      now() + make_interval(days => p_expires_in_days),
      500
    )
    on conflict (event_id)
      where link_type = 'open' and revoked_at is null
    do update
      set updated_at = now()
    returning * into active_link;
  end if;

  insert into private.event_invitation_tokens (
    invitation_link_id,
    token_hash
  )
  values (
    active_link.id,
    encode(extensions.digest(active_link.id::text, 'sha256'), 'hex')
  )
  on conflict (invitation_link_id) do nothing;

  return query
  select active_link.id, active_link.expires_at;
end;
$$;

comment on function public.ensure_open_event_invitation(uuid, uuid, integer) is
  'Creates or returns the active group invitation for an owned event. Service-role only.';

revoke all
on function public.ensure_open_event_invitation(uuid, uuid, integer)
from public, anon, authenticated;

grant execute
on function public.ensure_open_event_invitation(uuid, uuid, integer)
to service_role;

create function public.get_event_invitation_by_token(p_token text)
returns table (
  invitation_id uuid,
  event_id uuid,
  event_name text,
  event_type text,
  starts_at timestamptz,
  time_zone text,
  location_text text,
  organizer_name text,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  token_id uuid;
begin
  begin
    token_id := p_token::uuid;
  exception
    when invalid_text_representation then
      return;
  end;

  return query
  select
    invitation_links.id,
    events.id,
    events.name,
    events.event_type,
    events.starts_at,
    events.time_zone,
    events.location_text,
    profiles.display_name,
    invitation_links.expires_at
  from private.event_invitation_tokens as invitation_tokens
  join public.event_invitation_links as invitation_links
    on invitation_links.id = invitation_tokens.invitation_link_id
  join public.events
    on events.id = invitation_links.event_id
   and events.user_id = invitation_links.user_id
  join public.profiles
    on profiles.id = invitation_links.user_id
  where invitation_links.id = token_id
    and invitation_tokens.token_hash = encode(
      extensions.digest(p_token, 'sha256'),
      'hex'
    )
    and invitation_links.link_type = 'open'
    and invitation_links.revoked_at is null
    and invitation_links.expires_at > now()
  limit 1;
end;
$$;

comment on function public.get_event_invitation_by_token(text) is
  'Returns the safe public event fields for a valid invitation capability token.';

revoke all
on function public.get_event_invitation_by_token(text)
from public, anon, authenticated;

grant execute
on function public.get_event_invitation_by_token(text)
to service_role;

create function public.submit_event_invitation_response(
  p_token text,
  p_response_key uuid,
  p_name text,
  p_adults_count smallint,
  p_children_count smallint,
  p_rsvp_status text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  token_id uuid;
  active_link public.event_invitation_links%rowtype;
  existing_guest_id uuid;
  created_guest_id uuid;
  response_count integer;
begin
  begin
    token_id := p_token::uuid;
  exception
    when invalid_text_representation then
      raise exception 'Invitation is invalid or unavailable'
        using errcode = '22023';
  end;

  if p_response_key is null then
    raise exception 'Response key is invalid'
      using errcode = '22023';
  end if;

  if p_name is null
    or char_length(btrim(p_name)) not between 1 and 120 then
    raise exception 'Guest name is invalid'
      using errcode = '22023';
  end if;

  if p_adults_count is null
    or p_children_count is null
    or p_adults_count not between 0 and 20
    or p_children_count not between 0 and 20
    or p_adults_count + p_children_count not between 1 and 20 then
    raise exception 'Guest party size is invalid'
      using errcode = '22023';
  end if;

  if p_rsvp_status is null
    or p_rsvp_status not in ('accepted', 'maybe', 'declined') then
    raise exception 'RSVP status is invalid'
      using errcode = '22023';
  end if;

  select invitation_links.*
  into active_link
  from private.event_invitation_tokens as invitation_tokens
  join public.event_invitation_links as invitation_links
    on invitation_links.id = invitation_tokens.invitation_link_id
  where invitation_links.id = token_id
    and invitation_tokens.token_hash = encode(
      extensions.digest(p_token, 'sha256'),
      'hex'
    )
    and invitation_links.link_type = 'open'
    and invitation_links.revoked_at is null
    and invitation_links.expires_at > now()
  for update of invitation_links;

  if active_link.id is null then
    raise exception 'Invitation is invalid or unavailable'
      using errcode = 'P0002';
  end if;

  select invitation_responses.guest_id
  into existing_guest_id
  from public.event_invitation_responses as invitation_responses
  where invitation_responses.invitation_link_id = active_link.id
    and invitation_responses.response_key = p_response_key;

  if existing_guest_id is not null then
    return existing_guest_id;
  end if;

  if active_link.max_responses is not null then
    select count(*)
    into response_count
    from public.event_invitation_responses
    where invitation_link_id = active_link.id;

    if response_count >= active_link.max_responses then
      raise exception 'Invitation response limit reached'
        using errcode = 'P0001';
    end if;
  end if;

  insert into public.event_guests (
    event_id,
    user_id,
    name,
    adults_count,
    children_count,
    rsvp_status,
    invited_at,
    responded_at
  )
  values (
    active_link.event_id,
    active_link.user_id,
    btrim(p_name),
    p_adults_count,
    p_children_count,
    p_rsvp_status,
    active_link.created_at,
    now()
  )
  returning id into created_guest_id;

  insert into public.event_invitation_responses (
    invitation_link_id,
    guest_id,
    event_id,
    user_id,
    response_key
  )
  values (
    active_link.id,
    created_guest_id,
    active_link.event_id,
    active_link.user_id,
    p_response_key
  );

  update private.event_invitation_tokens
  set last_used_at = now()
  where invitation_link_id = active_link.id;

  return created_guest_id;
end;
$$;

comment on function public.submit_event_invitation_response(text, uuid, text, smallint, smallint, text) is
  'Atomically validates an invitation and creates one idempotent guest-party RSVP.';

revoke all
on function public.submit_event_invitation_response(text, uuid, text, smallint, smallint, text)
from public, anon, authenticated;

grant execute
on function public.submit_event_invitation_response(text, uuid, text, smallint, smallint, text)
to service_role;
