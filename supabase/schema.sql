-- Bamboo Forest Martial Arts — student portal schema
-- Run this in the Supabase SQL editor after creating a project.
-- Every table has Row Level Security enabled so a student's queries can
-- only ever return their own rows; only the service role (used from
-- Supabase Studio, not from the app) can manage other students' data.
--
-- This assumes the project was created with "Automatically expose new
-- tables" turned OFF (the more secure option, recommended over the old
-- default) — so each table below gets an explicit `grant` to the
-- `authenticated` role. RLS then narrows which *rows* that access actually
-- returns; the grant alone would expose nothing without it. Nothing here
-- grants to `anon` since every Supabase-backed page in this app sits behind
-- the portal's login wall already.
--
-- Table-level GRANTs and RLS are two independent permission layers in
-- Postgres: `service_role` bypassing RLS (it has the BYPASSRLS role
-- attribute) does NOT by itself give it SELECT/INSERT/etc. on a table —
-- with "automatically expose new tables" off, that base grant isn't
-- automatic for service_role either on this project, so it's granted
-- explicitly at the end of this file (used by lib/supabase/admin.ts — the
-- subscription webhook and the video player's signed-URL generation).

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  emergency_contact text,
  -- Single flag everything paid-tier gates on. Flipped either by hand in
  -- Studio for now, or later by an external system (the separate booking
  -- app, or Stripe) via POST /api/webhooks/subscription.
  subscription_status text not null default 'free'
    check (subscription_status in ('free', 'active', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

grant select, update on public.profiles to authenticated;

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  address text
);

alter table public.venues enable row level security;

create policy "Venues are readable by any authenticated user"
  on public.venues for select
  using (auth.role() = 'authenticated');

grant select on public.venues to authenticated;

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null
);

alter table public.programs enable row level security;

create policy "Programs are readable by any authenticated user"
  on public.programs for select
  using (auth.role() = 'authenticated');

grant select on public.programs to authenticated;

create table if not exists public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs (id) on delete cascade,
  venue_id uuid not null references public.venues (id) on delete cascade,
  day_of_week text not null,
  start_time time not null,
  end_time time not null
);

alter table public.class_sessions enable row level security;

create policy "Class sessions are readable by any authenticated user"
  on public.class_sessions for select
  using (auth.role() = 'authenticated');

grant select on public.class_sessions to authenticated;

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  class_session_id uuid not null references public.class_sessions (id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'paused', 'ended', 'trial')),
  created_at timestamptz not null default now()
);

alter table public.enrollments enable row level security;

create policy "Users can view their own enrollments"
  on public.enrollments for select
  using (auth.uid() = user_id);

-- Regular enrollments are admin-managed for MVP (via Supabase Studio, using
-- the service role, which bypasses RLS) — students cannot insert/update
-- those. The one exception is self-serve trial booking below.

-- One trial enrollment per student, enforced at the DB level regardless of
-- app-layer checks/race conditions.
create unique index if not exists enrollments_one_trial_per_user
  on public.enrollments (user_id)
  where (status = 'trial');

create policy "Users can book their own trial enrollment"
  on public.enrollments for insert
  with check (auth.uid() = user_id and status = 'trial');

grant select, insert on public.enrollments to authenticated;

create table if not exists public.consent_forms (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  version integer not null default 1,
  created_at timestamptz not null default now()
);

alter table public.consent_forms enable row level security;

create policy "Consent form definitions are readable by any authenticated user"
  on public.consent_forms for select
  using (auth.role() = 'authenticated');

grant select on public.consent_forms to authenticated;

create table if not exists public.consent_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  consent_form_id uuid not null references public.consent_forms (id) on delete cascade,
  signed_at timestamptz not null default now(),
  ip_address text,
  unique (user_id, consent_form_id)
);

alter table public.consent_records enable row level security;

create policy "Users can view their own consent records"
  on public.consent_records for select
  using (auth.uid() = user_id);

create policy "Users can sign a consent form for themselves"
  on public.consent_records for insert
  with check (auth.uid() = user_id);

grant select, insert on public.consent_records to authenticated;

-- Paid-tier video collections. Metadata (titles/descriptions) is readable
-- by any authenticated user — that's what lets free-tier students see
-- locked/blurred cards at all. The actual files live in a private Storage
-- bucket with no client-facing read policy: access is only ever granted by
-- the server minting a short-lived signed URL after checking
-- profiles.subscription_status = 'active' (see app/(portal)/portal/videos).

create table if not exists public.video_collections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  sort_order integer not null default 0
);

alter table public.video_collections enable row level security;

create policy "Video collections are readable by any authenticated user"
  on public.video_collections for select
  using (auth.role() = 'authenticated');

grant select on public.video_collections to authenticated;

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.video_collections (id) on delete cascade,
  title text not null,
  description text,
  storage_path text not null,
  sort_order integer not null default 0
);

alter table public.videos enable row level security;

create policy "Video metadata is readable by any authenticated user"
  on public.videos for select
  using (auth.role() = 'authenticated');

grant select on public.videos to authenticated;

-- Private bucket for the actual video files. No storage.objects policy is
-- added — with no policy, only the service role (used server-side to mint
-- signed URLs) can read from it. Upload videos via the Studio's Storage
-- browser, matching the path stored in videos.storage_path.
insert into storage.buckets (id, name, public)
values ('videos', 'videos', false)
on conflict (id) do nothing;

-- Placed last so it covers every table defined above, regardless of run
-- order — see the note near the top of this file for why this is needed
-- even though service_role already bypasses RLS.
grant usage on schema public to service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
