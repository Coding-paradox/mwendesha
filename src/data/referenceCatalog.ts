export interface PlaceReference {
  key: string;
  name: string;
  latitude: number;
  longitude: number;
  osmUrl: string;
  area: 'pilot' | 'extension';
  precisionNote: string;
}

// Coordinates identify mapped reference features; they are not a surveyed drivable route.
export const placeReferences: PlaceReference[] = [
  {
    key: 'poste_lubumbashi',
    name: 'Poste de Lubumbashi',
    latitude: -11.66637,
    longitude: 27.4858,
    osmUrl: 'https://www.openstreetmap.org/node/4273069990',
    area: 'pilot',
    precisionNote: 'Point de repère OSM, entrée de prise en charge à valider sur place.',
  },
  {
    key: 'gare_lubumbashi',
    name: 'Gare de Lubumbashi (SNCC)',
    latitude: -11.66632,
    longitude: 27.49034,
    osmUrl: 'https://www.openstreetmap.org/node/1308996831',
    area: 'pilot',
    precisionNote: 'Point de repère OSM ; les accès du site ferroviaire restent à relever.',
  },
  {
    key: 'unilu_campus',
    name: 'Université de Lubumbashi (UNILU)',
    latitude: -11.61285,
    longitude: 27.48046,
    osmUrl: 'https://www.openstreetmap.org/way/260751112',
    area: 'extension',
    precisionNote: 'Repère associé au campus, pas une entrée précise.',
  },
];

export interface VehicleReference {
  key: string;
  name: string;
  category: string;
  passengerCapacity: number;
  playability: 'player' | 'traffic';
}

export const vehicleReferences: VehicleReference[] = [
  { key: 'taxi_berline_jaune', name: 'Taxi berline jaune', category: 'taxi_car', passengerCapacity: 3, playability: 'player' },
  { key: 'taxi_bus_minibus', name: 'Taxi-bus minibus', category: 'taxi_bus', passengerCapacity: 12, playability: 'traffic' },
  { key: 'moto_taxi_ambiance', name: 'Moto-taxi', category: 'moto_taxi', passengerCapacity: 1, playability: 'traffic' },
];
