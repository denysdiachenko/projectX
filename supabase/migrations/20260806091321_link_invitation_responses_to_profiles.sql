alter table public.event_invitation_responses
add column profile_id uuid
references public.profiles (id)
on delete set null;

create index event_invitation_responses_profile_event_idx
on public.event_invitation_responses (profile_id, event_id)
where profile_id is not null;

comment on column public.event_invitation_responses.profile_id is
  'Authenticated profile that submitted this RSVP. Null for browser guests.';

drop function public.submit_event_invitation_response(
  text,
  uuid,
  text,
  smallint,
  smallint,
  text
);

create function public.submit_event_invitation_response(
  p_token text,
  p_response_key uuid,
  p_name text,
  p_adults_count smallint,
  p_children_count smallint,
  p_rsvp_status text,
  p_profile_id uuid default null
)
returns table (
  response_guest_id uuid,
  response_event_id uuid,
  linked_to_profile boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  token_id uuid;
  active_link public.event_invitation_links%rowtype;
  created_guest_id uuid;
  existing_profile_id uuid;
  effective_profile_id uuid;
  response_count integer;
  membership_is_active boolean;
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

  if p_profile_id is not null
    and p_profile_id <> active_link.user_id
    and exists (
      select 1
      from public.profiles
      where profiles.id = p_profile_id
    ) then
    effective_profile_id := p_profile_id;
  end if;

  select
    invitation_responses.guest_id,
    invitation_responses.profile_id
  into
    created_guest_id,
    existing_profile_id
  from public.event_invitation_responses as invitation_responses
  where invitation_responses.invitation_link_id = active_link.id
    and invitation_responses.response_key = p_response_key;

  if created_guest_id is not null then
    if existing_profile_id is not null then
      effective_profile_id := existing_profile_id;
    elsif effective_profile_id is not null then
      update public.event_invitation_responses
      set profile_id = effective_profile_id
      where invitation_link_id = active_link.id
        and response_key = p_response_key;
    end if;
  else
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
      response_key,
      profile_id
    )
    values (
      active_link.id,
      created_guest_id,
      active_link.event_id,
      active_link.user_id,
      p_response_key,
      effective_profile_id
    );
  end if;

  if effective_profile_id is not null then
    select exists (
      select 1
      from public.event_invitation_responses as invitation_responses
      join public.event_guests as guests
        on guests.id = invitation_responses.guest_id
      where invitation_responses.event_id = active_link.event_id
        and invitation_responses.profile_id = effective_profile_id
        and guests.rsvp_status in ('accepted', 'maybe')
    )
    into membership_is_active;

    insert into public.event_members as existing_member (
      event_id,
      user_id,
      profile_id,
      guest_id,
      invited_by,
      role,
      membership_status,
      joined_at
    )
    values (
      active_link.event_id,
      active_link.user_id,
      effective_profile_id,
      created_guest_id,
      active_link.user_id,
      'participant',
      case when membership_is_active then 'active' else 'declined' end,
      case when membership_is_active then now() else null end
    )
    on conflict (event_id, profile_id)
    do update set
      guest_id = coalesce(existing_member.guest_id, excluded.guest_id),
      membership_status = excluded.membership_status,
      joined_at = case
        when excluded.membership_status = 'active'
          then coalesce(existing_member.joined_at, excluded.joined_at)
        else null
      end,
      updated_at = now();
  end if;

  update private.event_invitation_tokens
  set last_used_at = now()
  where invitation_link_id = active_link.id;

  return query
  select
    created_guest_id,
    active_link.event_id,
    effective_profile_id is not null
      and effective_profile_id = p_profile_id;
end;
$$;

comment on function public.submit_event_invitation_response(
  text,
  uuid,
  text,
  smallint,
  smallint,
  text,
  uuid
) is
  'Creates an idempotent RSVP and links authenticated respondents to event membership.';

revoke all
on function public.submit_event_invitation_response(
  text,
  uuid,
  text,
  smallint,
  smallint,
  text,
  uuid
)
from public, anon, authenticated;

grant execute
on function public.submit_event_invitation_response(
  text,
  uuid,
  text,
  smallint,
  smallint,
  text,
  uuid
)
to service_role;
