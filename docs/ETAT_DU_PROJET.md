# MWENDESHA — état du projet 0.4

## Intention de jeu

MWENDESHA est un jeu de conduite et de taxi ancré à Lubumbashi. Les références de jeu servent à cadrer les missions, les itinéraires et l’interface ; le jeu conserve ses propres véhicules, lieux et ressources. Le joueur conduit une citadine compacte jaune à hayon. Son GLB actuel est un modèle provisoire **NON VALIDÉ**. Le minibus jaune inspiré d’un Hiace reste dans le trafic secondaire.

La cible artistique du premier niveau est un réalisme stylisé, construit à partir de photos et de parcours locaux. Les captures de Moto Wewa servent à comprendre le cadrage et les boucles de jeu ; elles ne sont pas des ressources à réutiliser.

## Démonstration en place

- Scène 3D Babylon.js. Le joueur conduit une citadine compacte jaune à hayon ; son GLB actuel est provisoire **NON VALIDÉ**. Une fourgonnette/minibus jaune inspirée d’un Hiace est conservée dans le trafic secondaire.
- Tronçon OSM de l’Avenue Lumumba (RN1), environ 642 m, de la sortie du rond-point vers le nœud OSM 664607359. La mini-carte et la conduite utilisent maintenant ces huit points GPS ; le nom de la rue au carrefour d’arrivée reste **À VALIDER**.
- Les dalles de route Kenney `road-straight.glb` font 1 × 1 dans leur GLB et sont répétées avec un pas identique à leur échelle. Les bâtiments commerciaux et deux arbres sont chargés depuis des GLB Kenney CC0.
- Le sol latéritique utilise une texture périodique légère générée en mémoire. Le kit Roads fourni n’a pas de texture dédiée au sol ; ses images sont des palettes de couleurs.
- Les façades et la végétation restent des ressources génériques stylisées ; leur présence n’est pas un relevé géospatial ou architectural de Lubumbashi.
- Tableau de destination et panneaux d’avenues pour matérialiser une course urbaine.
- Suivi de la voie et de la distance restante dans l’interface de course.
- Contrôles clavier PC et tactiles, carburant, solde en FC, pause et sauvegarde IndexedDB.
- Progression sauvegardée localement dans IndexedDB. PostgreSQL est hors périmètre de la V1 jouable ; le navigateur ne s’y connecte pas.

Le GLB provisoire est chargé par le chargeur glTF standard de Babylon.js (`@babylonjs/loaders`). Le dossier `src/assets/models/raw/` est réservé aux modèles source reçus avant leur validation et intégration.

## Précision géographique et limites

La géométrie active vient de l’API OSM `way/52253705/full`, identifiée Avenue Lumumba, highway=trunk, ref=RN1, lanes=4. Le premier nœud sélectionné est à la sortie du rond-point associé à `way/52253710`. La distance calculée sur la polyline retenue est d’environ 642 m. Le nœud OSM 664607359 marque l’arrivée ; le nom de la voie transversale n’est pas établi dans cet extrait et reste **À VALIDER**. Attribution : © OpenStreetMap contributors, ODbL 1.0. Le relevé et les coordonnées détaillées sont dans [DONNEES_OSM_LUBUMBASHI.md](DONNEES_OSM_LUBUMBASHI.md).

La chaussée modulaire suit l’axe GPS de la polyline. Les modules sont espacés selon leur empreinte GLB de 1 × 1 mise à l’échelle ; la géométrie du tronçon étant presque droite, les orientations restent cohérentes. Les bâtiments, les arbres, les positions de passants, les files aux arrêts et le trafic restent stylisés ; ils ne constituent pas un relevé géospatial ou une reproduction d’un quartier réel. Le nom du carrefour d’arrivée et les accès doivent être vérifiés sur place avant de qualifier le trajet de fidèle.

Les silhouettes de passants et les bâtiments sont des volumes provisoires. Leur apparence ne prétend pas documenter toute la diversité lushoise. Les tarifs et capacités de jeu sont temporaires. Une synthèse sourcée des véhicules, du réseau, des arrêts et des comportements rapportés est consignée dans [REFERENCES_LOCALES_LUBUMBASHI.md](REFERENCES_LOCALES_LUBUMBASHI.md).

## Prochaine étape de production

Faire valider le modèle provisoire de la citadine, la ligne et les vrais arrêts de la mission avec des Lushois ; relever les carrefours et façades réels ; remplacer les volumes provisoires par des modèles détaillés et variés ; ajouter les sons et mesurer les performances sur Android d’entrée de gamme.

## Captures de comparaison — Partie 1

- [Avant le refactoring](captures/partie-1-avant.png)
- [Après le refactoring](captures/partie-1-apres.png)

## Lancer

Depuis le dossier du projet : `npm install`, puis `npm run dev` pour le PC. Pour jouer depuis un téléphone connecté au même Wi-Fi que le PC, lancer `npm run dev:phone`, puis ouvrir l’adresse réseau indiquée par Vite (sur le poste de développement actuel : `http://192.168.0.108:5175/`). Vérifier `npm run build` avant une distribution.
