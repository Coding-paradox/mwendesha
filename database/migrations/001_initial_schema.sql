-- MWENDESHA | PostgreSQL / Supabase initial schema
-- This cloud schema is optional. The V1 game must remain playable with local IndexedDB alone.

create extension if not exists pgcrypto;

create table if not exists public.player_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 40),
  preferred_language text not null default 'fr' check (preferred_language in ('fr', 'sw Katanga')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.game_saves (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.player_profiles (id) on delete cascade,
  slot_number smallint not null default 1 check (slot_number between 1 and 3),
  schema_version integer not null default 1 check (schema_version > 0),
  current_zone text not null default 'lubumbashi_centre',
  current_vehicle_key text,
  balance_cdf bigint not null default 0 check (balance_cdf >= 0),
  balance_usd_cents bigint not null default 0 check (balance_usd_cents >= 0),
  reputation integer not null default 0 check (reputation >= 0),
  save_state jsonb not null default '{}'::jsonb check (jsonb_typeof(save_state) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (player_id, slot_number)
);

create table if not exists public.owned_vehicles (
  id uuid primary key default gen_random_uuid(),
  save_id uuid not null references public.game_saves (id) on delete cascade,
  vehicle_key text not null,
  display_name text,
  condition_percent smallint not null default 100 check (condition_percent between 0 and 100),
  fuel_percent smallint not null default 100 check (fuel_percent between 0 and 100),
  is_current boolean not null default false,
  acquired_at timestamptz not null default now(),
  unique (save_id, id)
);

create unique index if not exists owned_vehicles_one_current_per_save
  on public.owned_vehicles (save_id)
  where is_current;

create table if not exists public.rides (
  id uuid primary key default gen_random_uuid(),
  save_id uuid not null references public.game_saves (id) on delete cascade,
  vehicle_id uuid,
  origin_key text not null,
  destination_key text not null,
  transport_mode text not null default 'individual'
    check (transport_mode in ('individual', 'collective')),
  fare_amount bigint not null check (fare_amount >= 0),
  currency text not null default 'CDF' check (currency in ('CDF', 'USD')),
  passenger_profile text,
  rating smallint check (rating between 1 and 5),
  completed_at timestamptz not null default now(),
  foreign key (save_id, vehicle_id)
    references public.owned_vehicles (save_id, id)
    on delete set null (vehicle_id)
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  save_id uuid not null references public.game_saves (id) on delete cascade,
  vehicle_id uuid,
  expense_type text not null
    check (expense_type in ('fuel', 'repair', 'maintenance', 'tire', 'fine', 'owner_payment', 'other')),
  amount bigint not null check (amount > 0),
  currency text not null default 'CDF' check (currency in ('CDF', 'USD')),
  note text,
  recorded_at timestamptz not null default now(),
  foreign key (save_id, vehicle_id)
    references public.owned_vehicles (save_id, id)
    on delete set null (vehicle_id)
);

create index if not exists game_saves_player_updated_idx
  on public.game_saves (player_id, updated_at desc);
create index if not exists rides_save_completed_idx
  on public.rides (save_id, completed_at desc);
create index if not exists expenses_save_recorded_idx
  on public.expenses (save_id, recorded_at desc);

-- Keep updated_at current for profile and save rows.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists player_profiles_set_updated_at on public.player_profiles;
create trigger player_profiles_set_updated_at
before update on public.player_profiles
for each row execute function public.set_updated_at();

drop trigger if exists game_saves_set_updated_at on public.game_saves;
create trigger game_saves_set_updated_at
before update on public.game_saves
for each row execute function public.set_updated_at();

-- Supabase Row Level Security: a signed-in player can only access their own data.
alter table public.player_profiles enable row level security;
alter table public.game_saves enable row level security;
alter table public.owned_vehicles enable row level security;
alter table public.rides enable row level security;
alter table public.expenses enable row level security;

create policy "players manage own profile"
  on public.player_profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "players manage own saves"
  on public.game_saves for all
  using (auth.uid() = player_id)
  with check (auth.uid() = player_id);

create policy "players manage vehicles in own saves"
  on public.owned_vehicles for all
  using (exists (
    select 1 from public.game_saves s
    where s.id = save_id and s.player_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.game_saves s
    where s.id = save_id and s.player_id = auth.uid()
  ));

create policy "players manage rides in own saves"
  on public.rides for all
  using (exists (
    select 1 from public.game_saves s
    where s.id = save_id and s.player_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.game_saves s
    where s.id = save_id and s.player_id = auth.uid()
  ));

create policy "players manage expenses in own saves"
  on public.expenses for all
  using (exists (
    select 1 from public.game_saves s
    where s.id = save_id and s.player_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.game_saves s
    where s.id = save_id and s.player_id = auth.uid()
  ));
