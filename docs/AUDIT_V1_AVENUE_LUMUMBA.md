# Audit prototype et tronçon urbain V1

Date de l'audit : 13 novembre 2026

## État du prototype observé

- Le jeu utilise Babylon.js dans une scène Vite; le HUD, les contrôles tactiles/clavier et la sauvegarde locale existaient déjà.
- La scène de conduite ne créait pas le monde (`createWorld` n'était pas appelé dans le démarrage). Le taxi, le sol et les acteurs du monde n'étaient donc pas présents de manière fiable dans la page active.
- La progression de conduite déplaçait la caméra et calculait une distance à partir de `camera.target.z`; elle n'était pas attachée au tracé OSM.
- La route en mémoire comporte 8 coordonnées d'OpenStreetMap, pour une projection locale d'environ 642,17 m. L'axe est étiqueté Avenue Lumumba / RN1. Le nom du carrefour terminal et les conditions d'accès taxi sont explicitement non confirmés.
- Le commentaire de projection indiquait auparavant 1 unité = 8 m, alors que les coordonnées sont projetées à environ 1 unité = 1 m.

## Changements de cette étape

- Le démarrage crée maintenant le monde 3D, puis charge le corridor d'assets existants une seule fois.
- Le taxi joueur se déplace le long de la polyligne OSM; la distance restante et le repère de la mini-carte suivent cette progression.
- La caméra suit le véhicule et une brume chaude masque progressivement l'horizon.
- Le sol de latérite est présent, le kit MidCity est placé en blocs cohérents le long de la route et la palette de couleur du modèle de chaussée Kenney est liée explicitement.
- Le HUD et son balisage visuel n'ont pas été modifiés.
- Les tests ciblés valident les métadonnées de l'axe, la longueur projetée, les limites de parcours et la projection du progrès sur la route.

## Données géographiques disponibles et limites

La géométrie locale actuellement embarquée cite OSM way `52253705`, associé au rond-point OSM `52253710`, et le relevé existant date du 10 novembre 2026. Elle fournit 8 nœuds avec coordonnées. Le dernier point est nommé « Carrefour non nommé · à valider » : aucun croisement précis n'est inventé dans le jeu.

La connexion réseau à l'API OSM n'a pas pu être résolue pendant cet audit (échec DNS). Le relevé déjà stocké dans le projet a donc été contrôlé localement et par tests, mais n'a pas pu être rafraîchi en direct. Avant de figer le point de départ/arrivée comme lieux d'embarquement, il faudra confirmer les accès et noms sur OSM ou auprès d'un relevé local.

## Limites visuelles restantes constatées

- Le modèle de route Kenney est un petit module répétable; les joints/bandes restent visibles et donnent encore un aspect modulaire. La largeur et l'alignement sont cohérents, mais ce matériau n'est pas encore une chaussée continue convaincante.
- MidCity et Kenney sont des kits génériques. Ils remplissent la scène avec des silhouettes 3D, mais ne prouvent pas à eux seuls l'architecture propre à Lubumbashi.
- Le trafic, les piétons et les éléments de rue ne constituent pas encore une simulation urbaine complète. Leur densité et leurs comportements doivent être travaillés après la validation de cette portion.
- L'OSM décrit la géométrie cartographique; il ne fournit pas automatiquement le sens praticable, la voie d'arrêt taxi, la signalisation visible ou l'état de la chaussée.

## Passe de correction chaussée et abords — 13 novembre 2026

- Les pièces Kenney répétées ont été retirées du tracé jouable. La chaussée est maintenant une surface continue unique générée en suivant la polyline OSM, prolongée de 55 m avant le départ et de 28 m après l'arrivée afin d'éviter les bouts de route visibles dans la caméra.
- Deux trottoirs et deux bordures suivent le même axe et utilisent une géométrie commune échantillonnée tous les 2,5 m. L'asphalte possède un grain procédural discret sans joint de tuile. Trois marquages en pointillés sont construits en petites surfaces, assez larges pour rester visibles depuis la caméra du jeu.
- Le sol latéritique préexistant et les arbres Kenney sont conservés. Le kit MidCity fourni par le porteur est rapproché du corridor ; il reste désigné comme bloc commercial générique, pas comme architecture documentée de Lubumbashi.
- La recherche a relevé l'export de bâtiments OSM d'OSM2CDR : il propose des volumes issus des contours cartographiques et des hauteurs parfois estimées par défaut, sans texture photographique de façade. Cette géométrie peut servir à positionner des masses bâties, pas à certifier leur aspect local. Aucun nouvel export payant ou modèle tiers n'a été téléchargé ni intégré dans cette passe.
- La documentation OSM donne maintenant départ, arrivée et tous les nœuds de la polyline. Le seul raccord de départ associé au rond-point est documenté ; les six sommets internes n'ont pas leurs ways transversaux dans l'extrait conservé, donc leur statut de carrefour reste explicitement à vérifier. Le nom de l'intersection d'arrivée reste inconnu.
- HUD, conduite, caméra et progression n'ont pas été édités pendant cette correction. Vérification : `npm test` (5 tests passés), `npm run build` (réussi, avertissement existant sur le bundle Babylon.js d'environ 6 Mo).

## Sources et attribution

- Géométrie enregistrée : [OSM way 52253705](https://www.openstreetmap.org/way/52253705), [rond-point way 52253710](https://www.openstreetmap.org/way/52253710).
- Attribution des données : © OpenStreetMap contributors, licence ODbL 1.0.
- Les ressources Kenney et MidCity conservent leurs attributions dans le registre des sources du projet.
