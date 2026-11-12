-- MWENDESHA | Local PostgreSQL 18 schema
-- Run this only after creating the dedicated database named mwendesha.
-- This local development schema has no Supabase auth/RLS dependencies.
-- The shipped game's offline save remains in IndexedDB.

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  nickname text not null check (char_length(nickname) between 1 and 40),
  preferred_language text not null default 'fr' check (preferred_language in ('fr', 'sw-KAT')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.game_saves (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players (id) on delete cascade,
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

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists players_set_updated_at on public.players;
create trigger players_set_updated_at
before update on public.players
for each row execute function public.set_updated_at();

drop trigger if exists game_saves_set_updated_at on public.game_saves;
create trigger game_saves_set_updated_at
before update on public.game_saves
for each row execute function public.set_updated_at();
