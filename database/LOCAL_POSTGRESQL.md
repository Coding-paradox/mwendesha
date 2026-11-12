# MWENDESHA local PostgreSQL 18 development database

Create a dedicated database named `mwendesha` in pgAdmin, then run `migrations/001_local_postgresql18.sql` against that database. Do not run it against the unrelated `pharmacy_erp`, `pharmacyerp_db`, or built-in `postgres` databases.

This schema is for local backend/database development. The browser game must never connect directly to PostgreSQL. V1 gameplay and offline progress belong in IndexedDB; a Node.js backend can use PostgreSQL for optional connected features later.

For a hosted Supabase environment, use the separate Supabase migration in `migrations/001_initial_schema.sql`; it depends on Supabase Auth and Row Level Security and is not intended for vanilla local PostgreSQL.

## Données de référence locales

`migrations/002_local_reference_catalog.sql` ajoute les tables `place_catalog` et `vehicle_catalog`, puis insère trois repères (Poste, Gare SNCC, campus UNILU) et trois catégories de véhicules (taxi berline jaune, taxi-bus/minibus et moto-taxi d'ambiance).

Les coordonnées proviennent d'objets OpenStreetMap. Elles restent des références à vérifier sur place, en particulier pour les entrées de la gare et de l'UNILU. Les capacités des véhicules sont des valeurs provisoires de gameplay, à faire relire par des chauffeurs locaux. Les photos fournies guident la direction artistique mais ne sont pas intégrées comme textures.

Source géographique : © OpenStreetMap contributors, ODbL. Les URL des objets sont conservées dans `place_catalog` pour la traçabilité.
