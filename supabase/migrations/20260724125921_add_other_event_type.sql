alter table public.events
drop constraint events_event_type_supported;

alter table public.events
add constraint events_event_type_supported
check (event_type in ('birthday', 'bbq', 'home_party', 'other'));
