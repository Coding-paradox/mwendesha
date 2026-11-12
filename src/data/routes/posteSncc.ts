/**
 * Route de démonstration calculée depuis les deux repères OSM Poste–Gare SNCC.
 * Les voies et accès restent à vérifier sur place avec des Lushois.
 * Source des géométries : OpenStreetMap via OSRM, 2026-11-07.
 * Données OSM © OpenStreetMap contributors, disponibles sous ODbL 1.0.
 */
export const posteSnccRoute = {
  key: 'poste-sncc-centre',
  start: 'Poste de Lubumbashi',
  finish: 'Gare de Lubumbashi (SNCC)',
  distanceMeters: 689,
  metersPerWorldUnit: 8,
  attribution: '© OpenStreetMap contributors · ODbL 1.0',
  routeSource: 'https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=-11.66637%2C27.4858%3B-11.66632%2C27.49034',
  points: [
    [27.485621, -11.666459], [27.486340, -11.667850], [27.486430, -11.667778],
    [27.486501, -11.667667], [27.486901, -11.666733], [27.486923, -11.666601],
    [27.486960, -11.666605], [27.486996, -11.666595], [27.487020, -11.666576],
    [27.487037, -11.666550], [27.487044, -11.666521], [27.487042, -11.666491],
    [27.487843, -11.666388], [27.487972, -11.666416], [27.488075, -11.666450],
    [27.488147, -11.666474], [27.488196, -11.666497], [27.488231, -11.666520],
    [27.488270, -11.666536], [27.488312, -11.666544], [27.488355, -11.666543],
    [27.488391, -11.666536], [27.488426, -11.666523], [27.488457, -11.666504],
    [27.488485, -11.666481], [27.489581, -11.666358], [27.489556, -11.666062],
    [27.489639, -11.666038], [27.489685, -11.666015], [27.489716, -11.665985],
    [27.489743, -11.665956],
  ] as const,
  streets: [
    { name: 'Avenue Jason Sendwe', startMeters: 0, endMeters: 173 },
    { name: 'Avenue Moero', startMeters: 173, endMeters: 327 },
    { name: 'Avenue Mwepu', startMeters: 327, endMeters: 477 },
    { name: 'Voirie locale · nom à vérifier', startMeters: 477, endMeters: 689 },
  ] as const,
};
