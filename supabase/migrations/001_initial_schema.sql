-- Travel OS MVP initial schema
-- Run this in the Supabase SQL Editor or with the Supabase CLI.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  locale text not null default 'zh-TW',
  timezone text not null default 'Asia/Taipei',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.journeys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default '未命名旅程',
  destination text,
  start_date date,
  end_date date,
  duration_days integer check (duration_days is null or duration_days > 0),
  status text not null default 'draft'
    check (status in ('draft', 'saved', 'needs_review', 'archived')),
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);

create table public.travel_intents (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys(id) on delete cascade,
  intent_status text not null default 'pending'
    check (intent_status in ('pending', 'clarified', 'confirmed')),
  destination text,
  duration_days integer check (duration_days is null or duration_days > 0),
  raw_input text,
  clarified_summary text,
  constraints jsonb not null default '{}'::jsonb,
  must_haves jsonb not null default '[]'::jsonb,
  avoidances jsonb not null default '[]'::jsonb,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (journey_id)
);

create table public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys(id) on delete cascade,
  pace text not null default 'balanced'
    check (pace in ('relaxed', 'balanced', 'full', 'intense')),
  budget_level text not null default 'unknown'
    check (budget_level in ('low', 'medium', 'high', 'luxury', 'unknown')),
  interests text[] not null default '{}',
  travel_style_notes text,
  mobility_notes text,
  dietary_notes text,
  accommodation_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (journey_id)
);

create table public.itinerary_days (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys(id) on delete cascade,
  day_number integer not null check (day_number > 0),
  date date,
  title text,
  summary text,
  load_level text not null default 'medium'
    check (load_level in ('light', 'medium', 'medium_high', 'heavy')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (journey_id, day_number),
  unique (id, journey_id)
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys(id) on delete cascade,
  itinerary_day_id uuid not null,
  position integer not null default 1 check (position > 0),
  title text not null,
  description text,
  location_name text,
  start_time time,
  end_time time,
  duration_minutes integer check (duration_minutes is null or duration_minutes > 0),
  estimated_cost numeric(10, 2) check (estimated_cost is null or estimated_cost >= 0),
  booking_required boolean not null default false,
  status text not null default 'planned'
    check (status in ('planned', 'changed', 'removed', 'completed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (itinerary_day_id, position),
  unique (id, journey_id),
  foreign key (itinerary_day_id, journey_id) references public.itinerary_days(id, journey_id) on delete cascade
);

create table public.feasibility_checks (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys(id) on delete cascade,
  overall_status text not null default 'good'
    check (overall_status in ('excellent', 'good', 'risky', 'poor')),
  summary text,
  checked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, journey_id)
);

create table public.feasibility_warnings (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys(id) on delete cascade,
  feasibility_check_id uuid not null,
  itinerary_day_id uuid references public.itinerary_days(id) on delete set null,
  activity_id uuid references public.activities(id) on delete set null,
  severity text not null
    check (severity in ('low', 'medium', 'high')),
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, journey_id),
  foreign key (feasibility_check_id, journey_id) references public.feasibility_checks(id, journey_id) on delete cascade
);

create table public.suggested_fixes (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys(id) on delete cascade,
  feasibility_warning_id uuid not null,
  title text not null,
  description text,
  action_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (feasibility_warning_id, journey_id) references public.feasibility_warnings(id, journey_id) on delete cascade
);

create table public.next_actions (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys(id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high')),
  status text not null default 'open'
    check (status in ('open', 'completed', 'skipped')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.replan_requests (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys(id) on delete cascade,
  request_text text not null,
  status text not null default 'pending'
    check (status in ('pending', 'applied', 'failed', 'cancelled')),
  result_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.journey_snapshots (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys(id) on delete cascade,
  snapshot_type text not null
    check (snapshot_type in ('initial_generation', 'before_replan', 'after_replan', 'manual_save', 'auto_save')),
  snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.ai_runs (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  agent_name text not null,
  action_type text not null,
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  model text,
  prompt_version text,
  status text not null
    check (status in ('success', 'failed')),
  error_message text,
  latency_ms integer check (latency_ms is null or latency_ms >= 0),
  token_input integer check (token_input is null or token_input >= 0),
  token_output integer check (token_output is null or token_output >= 0),
  cost_usd numeric(12, 6) check (cost_usd is null or cost_usd >= 0),
  created_at timestamptz not null default now(),
  foreign key (journey_id, user_id) references public.journeys(id, user_id) on delete cascade
);

create index profiles_created_at_idx on public.profiles(created_at desc);
create index journeys_user_id_created_at_idx on public.journeys(user_id, created_at desc);
create index journeys_user_id_status_idx on public.journeys(user_id, status);
create index travel_intents_journey_id_idx on public.travel_intents(journey_id);
create index user_preferences_journey_id_idx on public.user_preferences(journey_id);
create index itinerary_days_journey_id_day_number_idx on public.itinerary_days(journey_id, day_number);
create index activities_journey_id_idx on public.activities(journey_id);
create index activities_itinerary_day_id_position_idx on public.activities(itinerary_day_id, position);
create index feasibility_checks_journey_id_created_at_idx on public.feasibility_checks(journey_id, created_at desc);
create index feasibility_warnings_journey_id_severity_idx on public.feasibility_warnings(journey_id, severity);
create index suggested_fixes_journey_id_idx on public.suggested_fixes(journey_id);
create index next_actions_journey_id_status_idx on public.next_actions(journey_id, status);
create index replan_requests_journey_id_created_at_idx on public.replan_requests(journey_id, created_at desc);
create index journey_snapshots_journey_id_created_at_idx on public.journey_snapshots(journey_id, created_at desc);
create index ai_runs_journey_id_created_at_idx on public.ai_runs(journey_id, created_at desc);
create index ai_runs_user_id_created_at_idx on public.ai_runs(user_id, created_at desc);

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_journeys_updated_at
before update on public.journeys
for each row execute function public.set_updated_at();

create trigger set_travel_intents_updated_at
before update on public.travel_intents
for each row execute function public.set_updated_at();

create trigger set_user_preferences_updated_at
before update on public.user_preferences
for each row execute function public.set_updated_at();

create trigger set_itinerary_days_updated_at
before update on public.itinerary_days
for each row execute function public.set_updated_at();

create trigger set_activities_updated_at
before update on public.activities
for each row execute function public.set_updated_at();

create trigger set_feasibility_checks_updated_at
before update on public.feasibility_checks
for each row execute function public.set_updated_at();

create trigger set_feasibility_warnings_updated_at
before update on public.feasibility_warnings
for each row execute function public.set_updated_at();

create trigger set_suggested_fixes_updated_at
before update on public.suggested_fixes
for each row execute function public.set_updated_at();

create trigger set_next_actions_updated_at
before update on public.next_actions
for each row execute function public.set_updated_at();

create trigger set_replan_requests_updated_at
before update on public.replan_requests
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.journeys enable row level security;
alter table public.travel_intents enable row level security;
alter table public.user_preferences enable row level security;
alter table public.itinerary_days enable row level security;
alter table public.activities enable row level security;
alter table public.feasibility_checks enable row level security;
alter table public.feasibility_warnings enable row level security;
alter table public.suggested_fixes enable row level security;
alter table public.next_actions enable row level security;
alter table public.replan_requests enable row level security;
alter table public.journey_snapshots enable row level security;
alter table public.ai_runs enable row level security;

create policy "Users can select their own profile"
on public.profiles for select
using (id = auth.uid());

create policy "Users can insert their own profile"
on public.profiles for insert
with check (id = auth.uid());

create policy "Users can update their own profile"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "Users can delete their own profile"
on public.profiles for delete
using (id = auth.uid());

create policy "Users can select their own journeys"
on public.journeys for select
using (user_id = auth.uid());

create policy "Users can insert their own journeys"
on public.journeys for insert
with check (user_id = auth.uid());

create policy "Users can update their own journeys"
on public.journeys for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Users can delete their own journeys"
on public.journeys for delete
using (user_id = auth.uid());

create policy "Users can select their own travel intents"
on public.travel_intents for select
using (
  exists (
    select 1 from public.journeys
    where journeys.id = travel_intents.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can insert their own travel intents"
on public.travel_intents for insert
with check (
  exists (
    select 1 from public.journeys
    where journeys.id = travel_intents.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can update their own travel intents"
on public.travel_intents for update
using (
  exists (
    select 1 from public.journeys
    where journeys.id = travel_intents.journey_id
      and journeys.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.journeys
    where journeys.id = travel_intents.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can delete their own travel intents"
on public.travel_intents for delete
using (
  exists (
    select 1 from public.journeys
    where journeys.id = travel_intents.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can select their own user preferences"
on public.user_preferences for select
using (
  exists (
    select 1 from public.journeys
    where journeys.id = user_preferences.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can insert their own user preferences"
on public.user_preferences for insert
with check (
  exists (
    select 1 from public.journeys
    where journeys.id = user_preferences.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can update their own user preferences"
on public.user_preferences for update
using (
  exists (
    select 1 from public.journeys
    where journeys.id = user_preferences.journey_id
      and journeys.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.journeys
    where journeys.id = user_preferences.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can delete their own user preferences"
on public.user_preferences for delete
using (
  exists (
    select 1 from public.journeys
    where journeys.id = user_preferences.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can select their own itinerary days"
on public.itinerary_days for select
using (
  exists (
    select 1 from public.journeys
    where journeys.id = itinerary_days.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can insert their own itinerary days"
on public.itinerary_days for insert
with check (
  exists (
    select 1 from public.journeys
    where journeys.id = itinerary_days.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can update their own itinerary days"
on public.itinerary_days for update
using (
  exists (
    select 1 from public.journeys
    where journeys.id = itinerary_days.journey_id
      and journeys.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.journeys
    where journeys.id = itinerary_days.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can delete their own itinerary days"
on public.itinerary_days for delete
using (
  exists (
    select 1 from public.journeys
    where journeys.id = itinerary_days.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can select their own activities"
on public.activities for select
using (
  exists (
    select 1 from public.journeys
    where journeys.id = activities.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can insert their own activities"
on public.activities for insert
with check (
  exists (
    select 1 from public.journeys
    where journeys.id = activities.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can update their own activities"
on public.activities for update
using (
  exists (
    select 1 from public.journeys
    where journeys.id = activities.journey_id
      and journeys.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.journeys
    where journeys.id = activities.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can delete their own activities"
on public.activities for delete
using (
  exists (
    select 1 from public.journeys
    where journeys.id = activities.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can select their own feasibility checks"
on public.feasibility_checks for select
using (
  exists (
    select 1 from public.journeys
    where journeys.id = feasibility_checks.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can insert their own feasibility checks"
on public.feasibility_checks for insert
with check (
  exists (
    select 1 from public.journeys
    where journeys.id = feasibility_checks.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can update their own feasibility checks"
on public.feasibility_checks for update
using (
  exists (
    select 1 from public.journeys
    where journeys.id = feasibility_checks.journey_id
      and journeys.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.journeys
    where journeys.id = feasibility_checks.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can delete their own feasibility checks"
on public.feasibility_checks for delete
using (
  exists (
    select 1 from public.journeys
    where journeys.id = feasibility_checks.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can select their own feasibility warnings"
on public.feasibility_warnings for select
using (
  exists (
    select 1 from public.journeys
    where journeys.id = feasibility_warnings.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can insert their own feasibility warnings"
on public.feasibility_warnings for insert
with check (
  exists (
    select 1 from public.journeys
    where journeys.id = feasibility_warnings.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can update their own feasibility warnings"
on public.feasibility_warnings for update
using (
  exists (
    select 1 from public.journeys
    where journeys.id = feasibility_warnings.journey_id
      and journeys.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.journeys
    where journeys.id = feasibility_warnings.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can delete their own feasibility warnings"
on public.feasibility_warnings for delete
using (
  exists (
    select 1 from public.journeys
    where journeys.id = feasibility_warnings.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can select their own suggested fixes"
on public.suggested_fixes for select
using (
  exists (
    select 1 from public.journeys
    where journeys.id = suggested_fixes.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can insert their own suggested fixes"
on public.suggested_fixes for insert
with check (
  exists (
    select 1 from public.journeys
    where journeys.id = suggested_fixes.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can update their own suggested fixes"
on public.suggested_fixes for update
using (
  exists (
    select 1 from public.journeys
    where journeys.id = suggested_fixes.journey_id
      and journeys.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.journeys
    where journeys.id = suggested_fixes.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can delete their own suggested fixes"
on public.suggested_fixes for delete
using (
  exists (
    select 1 from public.journeys
    where journeys.id = suggested_fixes.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can select their own next actions"
on public.next_actions for select
using (
  exists (
    select 1 from public.journeys
    where journeys.id = next_actions.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can insert their own next actions"
on public.next_actions for insert
with check (
  exists (
    select 1 from public.journeys
    where journeys.id = next_actions.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can update their own next actions"
on public.next_actions for update
using (
  exists (
    select 1 from public.journeys
    where journeys.id = next_actions.journey_id
      and journeys.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.journeys
    where journeys.id = next_actions.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can delete their own next actions"
on public.next_actions for delete
using (
  exists (
    select 1 from public.journeys
    where journeys.id = next_actions.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can select their own replan requests"
on public.replan_requests for select
using (
  exists (
    select 1 from public.journeys
    where journeys.id = replan_requests.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can insert their own replan requests"
on public.replan_requests for insert
with check (
  exists (
    select 1 from public.journeys
    where journeys.id = replan_requests.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can update their own replan requests"
on public.replan_requests for update
using (
  exists (
    select 1 from public.journeys
    where journeys.id = replan_requests.journey_id
      and journeys.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.journeys
    where journeys.id = replan_requests.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can delete their own replan requests"
on public.replan_requests for delete
using (
  exists (
    select 1 from public.journeys
    where journeys.id = replan_requests.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can select their own journey snapshots"
on public.journey_snapshots for select
using (
  exists (
    select 1 from public.journeys
    where journeys.id = journey_snapshots.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can insert their own journey snapshots"
on public.journey_snapshots for insert
with check (
  exists (
    select 1 from public.journeys
    where journeys.id = journey_snapshots.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can delete their own journey snapshots"
on public.journey_snapshots for delete
using (
  exists (
    select 1 from public.journeys
    where journeys.id = journey_snapshots.journey_id
      and journeys.user_id = auth.uid()
  )
);

create policy "Users can select their own ai runs"
on public.ai_runs for select
using (user_id = auth.uid());

create policy "Users can insert their own ai runs"
on public.ai_runs for insert
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.journeys
    where journeys.id = ai_runs.journey_id
      and journeys.user_id = auth.uid()
  )
);
