# MWENDESHA database foundation

The game is offline-first. IndexedDB in the game client is the source of the active local save for V1. This PostgreSQL schema is for optional cloud accounts and save synchronization in a later phase; gameplay must not require a database connection.

## Target

- PostgreSQL, with Supabase as the planned hosted option.
- Apply `migrations/001_initial_schema.sql` only to a Supabase project configured with its standard `auth` schema.
- Row Level Security is enabled for all player-owned tables.
- Never put a Supabase service-role key or database password in the browser client.

## Initial entities

- `player_profiles`: optional account profile linked to Supabase Auth.
- `game_saves`: up to three save slots, balances, active zone and versioned extension state.
- `owned_vehicles`: vehicles owned in a save slot.
- `rides`: completed course history.
- `expenses`: fuel, repairs, upkeep and other costs.

Amounts use whole CDF units or USD cents, and every amount row stores its currency. Vehicle and zone keys refer to game content identifiers, not translated display strings.

## Before connecting a client

1. Decide the local IndexedDB model and migration/versioning strategy.
2. Define cloud sync conflict rules and whether saves are uploaded as full snapshots or domain records.
3. Add server-side validation for any rankings, rewards or other competitive values.
4. Test the migration against a disposable Supabase development project and verify RLS as two different users.

This repository currently has no application code or database credentials, so the migration is a reviewed starting schema and has not been applied to a live database.
