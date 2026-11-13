# MWENDESHA — prototype de conduite

Premier prototype de conduite en 3D pour Android et PC, construit avec TypeScript, Babylon.js et Vite.

## Démarrer dans VS Code
1. Ouvre ce dossier dans VS Code.
2. Dans le terminal intégré : `npm install`
3. Puis : `npm run dev`
4. Ouvre `http://127.0.0.1:5173`.

### Essayer sur un téléphone du même Wi-Fi
1. Arrête le serveur déjà lancé avec `Ctrl+C`.
2. Lance `npm run dev:phone` dans le terminal du projet.
3. Ouvre sur le téléphone l’adresse réseau affichée par Vite. Sur le PC de développement actuel, elle est `http://192.168.0.108:5175/`.

`127.0.0.1` désigne l’appareil lui-même : sur le téléphone, cette adresse pointerait vers le téléphone, pas vers le PC. Si le navigateur du téléphone ne rejoint toujours pas le PC, vérifie qu’ils utilisent le même Wi-Fi et que Windows autorise Node.js sur le réseau privé.

Pour préparer la PWA : `npm run build`, puis `npm run preview`.

## Commandes
- PC : `W`/`↑` accélérer, `S`/`↓` freiner, `A`/`←` et `D`/`→` tourner, `Espace` klaxon.
- Android : boutons tactiles à l’écran.

## Portée actuelle
La V1 suit un tronçon d’environ 642 m de l’Avenue Lumumba (RN1), depuis la sortie du rond-point vers le nœud OSM 664607359 ; le nom du carrefour d’arrivée reste **À VALIDER**. Les coordonnées viennent de l’API OSM. La chaussée et les arbres sont des GLB Kenney CC0. Les bâtiments de bord de route viennent du modèle fourni `public/assets/models/midcity_buildings.glb`, crédité à Daniel Zhabotinsky (CC BY 4.0) ; ce kit générique n’est pas un relevé de l’architecture de Lubumbashi. Le véhicule joueur est une citadine jaune compacte à hayon : le GLB actuellement chargé reste provisoire, **NON VALIDÉ**. Une fourgonnette/minibus jaune inspirée d’un Hiace reste un véhicule secondaire de trafic. Attribution cartographique : © OpenStreetMap contributors, ODbL 1.0. Voir [le relevé OSM du tronçon](docs/DONNEES_OSM_LUBUMBASHI.md) et [les références locales de transport et de ville](docs/REFERENCES_LOCALES_LUBUMBASHI.md).

Le navigateur conserve la progression hors ligne dans IndexedDB. PostgreSQL est **hors périmètre de la V1 jouable** ; aucun backend de jeu n’en dépend actuellement.
