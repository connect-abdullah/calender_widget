-- Run once in Supabase SQL editor (MVP demo — open policies, no admin auth)

alter table hosts enable row level security;

create policy "Allow public read hosts"
  on hosts for select using (true);

create policy "Allow public insert hosts"
  on hosts for insert with check (true);

create policy "Allow public update hosts"
  on hosts for update using (true);
