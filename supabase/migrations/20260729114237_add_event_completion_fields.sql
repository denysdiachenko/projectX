alter table public.events
add column completed_at timestamptz;

update public.events
set completed_at = updated_at
where status = 'completed';

alter table public.events
drop constraint events_budget_outcome_supported;

alter table public.events
add constraint events_budget_outcome_supported
check (
  budget_outcome is null
  or budget_outcome in ('within_budget', 'over_budget', 'unknown')
);

alter table public.events
add constraint events_completion_consistent
check (
  (status = 'completed' and completed_at is not null)
  or (status <> 'completed' and completed_at is null)
);

comment on column public.events.completed_at is
  'Timestamp when the owner explicitly marked the event as completed.';

comment on column public.events.budget_outcome is
  'Optional post-event budget result: within_budget, over_budget, or unknown.';
