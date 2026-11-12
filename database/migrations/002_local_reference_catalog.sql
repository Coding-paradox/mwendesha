-- MWENDESHA | Local place and vehicle reference catalog
-- Coordinates are map references, not approved gameplay entrances or route nodes.
-- Review with local contributors before using them as final navigation targets.

create table if not exists public.place_catalog (
  place_key text primary key,
  name_fr text not null,
  category text not null check (category in ('post_office', 'railway_station', 'university', 'market', 'fuel_station', 'garage', 'landmark')),
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  osm_type text not null check (osm_type in ('node', 'way', 'relation')),
  osm_id bigint not null,
  osm_url text not null,
  zone_key text not null default 'lubumbashi_centre',
  validation_status text not null default 'needs_local_review'
    check (validation_status in ('needs_local_review', 'validated_locally')),
  reference_note text not null,
  created_at timestamptz not null default now(),
  unique (osm_type, osm_id)
);

create table if not exists public.vehicle_catalog (
  vehicle_key text primary key,
  name_fr text not null,
  category text not null check (category in ('taxi_car', 'taxi_bus', 'moto_taxi')),
  passenger_capacity smallint not null check (passenger_capacity between 1 and 30),
  player_available boolean not null default false,
  traffic_available boolean not null default true,
  visual_description text not null,
  reference_note text not null,
  created_at timestamptz not null default now()
);

insert into public.place_catalog (
  place_key, name_fr, category, latitude, longitude, osm_type, osm_id, osm_url,
  zone_key, validation_status, reference_note
) values
  (
    'poste_lubumbashi', 'Poste de Lubumbashi', 'post_office',
    -11.66637, 27.48580, 'node', 4273069990,
    'https://www.openstreetmap.org/node/4273069990',
    'lubumbashi_centre', 'needs_local_review',
    'Point OSM du bureau de poste ; à vérifier sur place avant de le définir comme point de prise en charge ou destination.'
  ),
  (
    'gare_lubumbashi', 'Gare de Lubumbashi (SNCC)', 'railway_station',
    -11.66632, 27.49034, 'node', 1308996831,
    'https://www.openstreetmap.org/node/1308996831',
    'lubumbashi_centre', 'needs_local_review',
    'Point OSM de la gare ; le site ferroviaire est plus vaste que ce point cartographique. Entrées et accès de circulation à relever localement.'
  ),
  (
    'unilu_campus', 'Université de Lubumbashi (UNILU)', 'university',
    -11.61285, 27.48046, 'way', 260751112,
    'https://www.openstreetmap.org/way/260751112',
    'extension_unilu', 'needs_local_review',
    'Point cartographique associé au campus OSM, pas une entrée précise. À conserver comme repère d’extension et à valider avec des Lushois.'
  )
on conflict (place_key) do update set
  name_fr = excluded.name_fr,
  category = excluded.category,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  osm_type = excluded.osm_type,
  osm_id = excluded.osm_id,
  osm_url = excluded.osm_url,
  zone_key = excluded.zone_key,
  validation_status = excluded.validation_status,
  reference_note = excluded.reference_note;

insert into public.vehicle_catalog (
  vehicle_key, name_fr, category, passenger_capacity, player_available,
  traffic_available, visual_description, reference_note
) values
  (
    'taxi_berline_jaune', 'Taxi berline jaune', 'taxi_car', 3, true, true,
    'Berline de taxi à carrosserie jaune ; silhouette et détails à modéliser depuis les photos locales autorisées.',
    'La photo fournie pour MWENDESHA montre plusieurs berlines jaunes. Capacité de jeu provisoire, à confirmer avec des chauffeurs locaux.'
  ),
  (
    'taxi_bus_minibus', 'Taxi-bus minibus', 'taxi_bus', 12, false, true,
    'Minibus de transport collectif ; couleurs, marquages et forme exacte à relever dans les rues de Lubumbashi.',
    'Catégorie observée dans les photos fournies et documentée dans des sources sur les taxis et taxi-bus lushois. Capacité de jeu provisoire, sans prétendre fixer la capacité légale.'
  ),
  (
    'moto_taxi_ambiance', 'Moto-taxi', 'moto_taxi', 1, false, true,
    'Moto utilisée comme véhicule de circulation ambiante ; modèle précis non fixé.',
    'Moto visible dans les références de rue fournies. Véhicule de trafic pour la première version, pas véhicule jouable prévu au lancement.'
  )
on conflict (vehicle_key) do update set
  name_fr = excluded.name_fr,
  category = excluded.category,
  passenger_capacity = excluded.passenger_capacity,
  player_available = excluded.player_available,
  traffic_available = excluded.traffic_available,
  visual_description = excluded.visual_description,
  reference_note = excluded.reference_note;
