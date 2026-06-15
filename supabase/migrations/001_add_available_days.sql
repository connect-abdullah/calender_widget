-- Run once in Supabase SQL editor

create table hosts (
  id uuid primary key default gen_random_uuid(),

  -- basic identity
  name text not null,

  -- scheduling config
  timezone text not null,
  meeting_duration_minutes int not null default 30,
  working_hours_start time not null,
  working_hours_end time not null,

  -- google integration
  google_refresh_token text not null,
  google_calendar_id text default 'primary',

  -- metadata
  created_at timestamp default now()
);

alter table hosts
  add column if not exists available_days smallint[] not null default '{1,2,3,4,5}';
