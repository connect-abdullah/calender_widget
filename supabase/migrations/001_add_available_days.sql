-- Add per-day availability (ISO weekday: 1=Mon … 7=Sun)
-- Run once in Supabase SQL editor

alter table hosts
  add column if not exists available_days smallint[] not null default '{1,2,3,4,5}';
