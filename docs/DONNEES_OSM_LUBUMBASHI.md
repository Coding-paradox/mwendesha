# Données OSM — Avenue Lumumba (tronçon V1)

Extraction consultée le 10 novembre 2026 depuis l’API OSM `way/52253705/full`.
La voie est identifiée comme `Avenue Lumumba`, `highway=trunk`, `ref=RN1` et
`lanes=4`. Le nœud méridional `664607363` se trouve à la sortie du rond-point
associé à `way/52253710` (`junction=roundabout`).

## Tronçon retenu — coordonnées de début et de fin

Tronçon nord d’Avenue Lumumba, d’environ **642,17 m** en projection métrique
locale (jeu : 1 unité = 1 m), du nœud OSM `664607363` à `664607359`.

- **Départ :** sortie du rond-point associé à OSM way `52253710`, nœud
  `664607363`, latitude `-11.6617395`, longitude `27.4878289`.
- **Arrivée :** nœud `664607359`, latitude `-11.6559603`, longitude
  `27.4872365`, toujours sur way `52253705` (Avenue Lumumba / RN1). Le nom
  de l’axe transversal n’est pas présent dans les données conservées : le jeu
  n’affiche donc aucun nom de carrefour à cet endroit.
- **Intersections traversées :** l’extraction locale contient les 8 nœuds de
  la géométrie du way, mais ne conserve pas les ways transversaux connectés à
  chacun d’eux. Les six nœuds intermédiaires ci-dessous sont donc des sommets
  OSM de la ligne ; leur statut d’intersection et tout nom d’avenue croisée
  restent **À VALIDER**. Aucun carrefour intermédiaire n’est inventé.

| Ordre | Nœud OSM | Latitude | Longitude | Statut d’intersection |
|---:|---:|---:|---:|---|
| 1 | 664607363 | -11.6617395 | 27.4878289 | Départ, sortie du rond-point associé |
| 2 | 5604124731 | -11.6617103 | 27.4878265 | Sommet de way ; croisement non vérifié |
| 3 | 664608332 | -11.6613199 | 27.4878024 | Sommet de way ; croisement non vérifié |
| 4 | 1015803514 | -11.6605479 | 27.4877156 | Sommet de way ; croisement non vérifié |
| 5 | 664607364 | -11.6589827 | 27.4875624 | Sommet de way ; croisement non vérifié |
| 6 | 2795906459 | -11.6585774 | 27.4875154 | Sommet de way ; croisement non vérifié |
| 7 | 5522084840 | -11.6573326 | 27.4874027 | Sommet de way ; croisement non vérifié |
| 8 | 664607359 | -11.6559603 | 27.4872365 | Arrivée ; axe transversal non nommé |

Les nœuds et leurs coordonnées sont conservés dans
[`avenueLumumba.ts`](../src/data/routes/avenueLumumba.ts). La scène projette
ces coordonnées dans le plan local du jeu ; elle ne fabrique pas le tracé à la
main.

## Contrôle qualité

- Nœuds de la géométrie retenue : **8/8** ont une latitude et une longitude.
- Intersections confirmées par les données conservées : départ au rond-point
  associé ; le point d’arrivée et les 6 sommets intermédiaires n’ont pas de
  way transversal conservé ici. Ils ne sont pas étiquetés comme carrefours
  nommés dans le jeu.
- Voie porteuse de la géométrie : nommée **Avenue Lumumba** et référencée
  **RN1**.
- Carrefour d’arrivée : le nom de l’axe croisé manque dans cette extraction ;
  à confirmer à Lubumbashi.
- Arrêts, commerces et bâtiments nommés : pas inclus dans ce relevé ciblé du
  tronçon ; aucune conclusion sur leur complétude n’est tirée ici.
- La géométrie OSM décrit l’axe de rue, pas les voies d’embarquement taxi, le
  sens réellement praticable au moment du jeu, le marquage ou les arrêts locaux.
  Ces éléments restent à vérifier avec des habitants.

## Sources et attribution

- [Géométrie OSM — way 52253705 (Avenue Lumumba)](https://api.openstreetmap.org/api/0.6/way/52253705/full)
- [Carte OSM — way 52253705](https://www.openstreetmap.org/way/52253705)
- [OSM — way 52253710 (rond-point associé)](https://www.openstreetmap.org/way/52253710)
- Données © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), disponibles sous licence ODbL 1.0.
