/**
 * Tronçon rectiligne de l'Avenue Lumumba (RN1), de la sortie du rond-point
 * au nœud OSM 664607359. Les intersections et l'accès taxi restent à valider.
 * Géométrie source : OpenStreetMap way 52253705, extrait le 2026-11-10.
 * © OpenStreetMap contributors, ODbL 1.0.
 */
export const avenueLumumbaRoute = {
  key: 'avenue-lumumba-rn1-roundabout-segment',
  start: 'Sortie du rond-point · Avenue Lumumba',
  finish: 'Carrefour non nommé · à valider',
  distanceMeters: 642,
  attribution: '© OpenStreetMap contributors · ODbL 1.0',
  routeSource: 'https://www.openstreetmap.org/way/52253705',
  osmApiSource: 'https://api.openstreetmap.org/api/0.6/way/52253705/full',
  osmWayId: 52253705,
  roundaboutWayId: 52253710,
  points: [
    [27.4878289, -11.6617395],
    [27.4878265, -11.6617103],
    [27.4878024, -11.6613199],
    [27.4877156, -11.6605479],
    [27.4875624, -11.6589827],
    [27.4875154, -11.6585774],
    [27.4874027, -11.6573326],
    [27.4872365, -11.6559603],
  ] as const,
  streets: [
    { name: 'Avenue Lumumba · RN1', startMeters: 0, endMeters: 642 },
  ] as const,
} as const;
