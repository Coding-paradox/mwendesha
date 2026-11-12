# MWENDESHA
## Cahier des charges fonctionnel et technique — Version 3.1

**Statut :** document de cadrage révisé  
**Ville représentée :** Lubumbashi, Haut-Katanga, République démocratique du Congo  
**Plateformes visées :** Android et PC, à partir d’un projet de jeu commun  
**Orientation :** jeu de conduite, de transport et de gestion urbaine en 3D  
**Nom du jeu :** MWENDESHA

---

## 1. Objet du document

Ce cahier des charges définit la vision, le périmètre initial, les exigences fonctionnelles et les orientations techniques de **MWENDESHA**. Il sert de référence à la conception, à la production des contenus et au développement.

La priorité du projet est l’authenticité de Lubumbashi. La ville ne doit pas être une ville générique à laquelle on aurait ajouté un nom congolais. Les rues, les véhicules, les personnes, les commerces, les sons, les dialogues et les situations de jeu doivent être inspirés de réalités observées à Lubumbashi et validés avec des personnes qui connaissent la ville.

Ce document ne constitue pas une autorisation d’utiliser des photos, marques, musiques ou modèles protégés. Chaque ressource intégrée au jeu devra avoir une provenance et des droits d’utilisation vérifiés.

## 2. Vision du jeu

MWENDESHA est un jeu vidéo de simulation de transport urbain et de gestion. Le joueur commence comme chauffeur de taxi à Lubumbashi. Il circule dans la ville, rencontre des clients, discute le prix, conduit jusqu’à destination et gère ses revenus ainsi que les dépenses de son véhicule. À terme, il pourra acheter des véhicules et développer une petite entreprise de transport.

Le jeu vise une immersion dans le quotidien lushois : les déplacements, les arrêts, les marchés et les commerces, les routes de qualité variable, la circulation, les interactions entre chauffeurs et passagers, et les choix économiques du métier.

L’objectif n’est pas de reproduire toute Lubumbashi dès la première version. Il est de créer une zone plus petite mais juste, vivante et reconnaissable, puis de l’étendre après validation.

## 3. Principes non négociables

1. **Lubumbashi est le sujet du jeu.** Les choix de contenu doivent venir de références locales vérifiables.
2. **La population représentée est principalement celle de Lubumbashi et de sa région.** Les personnages ordinaires sont des Congolais noirs, avec diversité d’âges, de silhouettes, de coiffures, de vêtements et de rôles sociaux. Ils ne sont ni des modèles européens recolorés ni des caricatures.
3. **L’authenticité se valide avec des Lushois.** Les personnages, lieux, dialogues, comportements de transport et tarifs fictifs doivent être relus ou testés par des personnes locales avant leur validation.
4. **Android et PC partagent le même jeu.** La simulation, les données et les contenus sont communs ; les commandes, l’interface et les réglages graphiques s’adaptent à l’appareil.
5. **Le jeu de base fonctionne hors ligne.** Une connexion ne doit pas être requise pour conduire, effectuer des courses, gérer l’économie ou sauvegarder localement.
6. **On valide petit avant d’agrandir.** Aucune extension à d’autres communes ni système avancé ne précède la validation de la zone pilote et de la boucle de jeu.
7. **Moto Wewa est une référence d’expérience, pas une source à copier.** Aucun code, modèle, son, interface ou contenu propriétaire ne sera repris.

## 4. Public et plateformes

### Public principal

- Habitants de Lubumbashi et du Haut-Katanga.
- Joueurs congolais et diaspora congolaise.
- Joueurs intéressés par la simulation et les villes africaines.

### Cibles de lancement

| Plateforme | Cible initiale | Mode d’accès envisagé |
|---|---|---|
| Android | Téléphones modestes, cible de référence 2 à 3 Go de RAM, Android 9 ou supérieur à confirmer lors du prototype | PWA installable, avec possibilité d’envisager une enveloppe native ultérieure si les essais l’exigent |
| PC Windows | Ordinateurs équipés d’un navigateur moderne et de WebGL 2 | Navigateur, avec clavier et manette en option |

La cible est de développer **un seul projet multiplateforme**. Les deux plateformes seront prises en compte dès les premiers prototypes : le PC facilitera les itérations et le téléphone de référence imposera les contraintes de performance. Une version n’est déclarée compatible qu’après essai réel sur les appareils et navigateurs retenus.

iOS n’est pas inclus dans le périmètre de la première version. Son ajout devra faire l’objet d’une décision distincte après vérification des performances, du stockage hors ligne et des limites propres à Safari/PWA.

## 5. Références locales et méthode d’authenticité

### 5.1 Photographies déjà fournies

Les photographies jointes au cadrage montrent notamment des taxis jaunes et des minibus, une circulation mêlant véhicules de transport et voitures privées, des commerces directement ouverts sur la rue, des étals et marchandises, des enseignes, des parasols, des trottoirs irréguliers et des chaussées poussiéreuses. Elles montrent également des bâtiments de plusieurs époques et états, des poteaux et câbles, ainsi que des passants dans des situations quotidiennes.

Ces images constituent un premier guide de direction visuelle pour des rues commerçantes. Elles ne suffisent pas à représenter toutes les communes, saisons, classes sociales ou formes d’habitat de Lubumbashi. Elles ne doivent pas être utilisées comme textures du jeu sans autorisation explicite.

### 5.2 Dossier de références à constituer

Avant de produire une zone complète, l’équipe constituera un dossier organisé par sujet :

- rues, intersections, chaussées, nids-de-poule, poussière et drainage ;
- taxis, minibus, motos, véhicules privés, couleurs et usages observés ;
- façades, commerces, marchés, garages, stations-service et lieux publics ;
- personnes, silhouettes, vêtements, coiffures, accessoires et activités quotidiennes ;
- signalétique, panneaux, noms de lieux et ambiance sonore ;
- conditions de saison sèche et de saison des pluies.

Chaque référence utilisée sera accompagnée de sa source, de sa date si connue, de sa zone géographique et de son statut de droits. Les photos documentaires servent à observer et à créer des ressources originales ; elles ne sont pas automatiquement réutilisables dans le jeu.

### 5.3 Validation locale

Des habitants, chauffeurs, commerçants et locuteurs de Lubumbashi pourront relire les propositions. Les validations porteront sur des questions concrètes : « cette rue paraît-elle plausible ? », « ce véhicule est-il courant dans ce contexte ? », « cette tenue ou cette interaction sonne-t-elle juste ? » Les retours seront enregistrés avec les corrections effectuées.

## 6. Direction artistique et population

### 6.1 Style visuel

La cible est une 3D **semi-réaliste stylisée** : formes, couleurs, circulation et détails locaux lisibles, avec un coût graphique compatible avec les appareils modestes. Le projet ne vise pas le photoréalisme.

La stylisation ne doit pas effacer les particularités de Lubumbashi. La reconnaissance locale dépendra surtout de la composition des rues, des véhicules, des devantures, des usages de l’espace public, des matériaux et des signes visuels observés.

### 6.2 Personnages

La population comprend des femmes et des hommes de plusieurs âges et métiers : chauffeurs, étudiants, élèves, vendeurs, vendeuses, commerçants, fonctionnaires, employés, mécaniciens, parents, enfants, personnes âgées et agents de circulation.

Les personnages doivent varier par le visage, la morphologie, la coiffure, les vêtements, les accessoires, la posture et les animations. Les vêtements s’inspirent du quotidien observé : jeans, chemises, robes, pagnes, uniformes scolaires, tenues professionnelles et vêtements de travail. Les choix seront respectueux et validés localement ; aucun groupe ne sera réduit à un rôle ou à un costume.

### 6.3 Véhicules, architecture et commerces

Les catégories de véhicules et leurs apparences seront établies à partir de références prises à Lubumbashi. Les marques et modèles précis ne seront utilisés qu’après vérification des droits applicables. Les bâtiments et commerces seront créés à partir d’observations, de relevés et de références autorisées. Les enseignes commerciales réelles ne seront pas copiées sans autorisation.

## 7. Langues, dialogues et son

Le français et le swahili katangais sont les langues prévues pour la première version. Le lingala pourra être ajouté plus tard. Les expressions, traductions et dialogues doivent être relus par des locuteurs locaux ; aucune traduction littérale artificielle ne sera considérée comme validée.

Les échanges de passagers pourront inclure salutations, demandes de destination, négociation, indications de route, commentaires et humour adaptés au contexte. Le ton reste respectueux.

L’ambiance sonore peut inclure moteurs, klaxons, circulation, marché, voix, pluie et sons de rue. La musique sera originale, libre de droits ou utilisée sous licence. Une radio musicale pourra être envisagée après sécurisation des droits.

## 8. Boucle de jeu et fonctionnalités

### 8.1 Boucle principale

1. Circuler dans la zone accessible.
2. Repérer un client à proximité d’un lieu fréquenté.
3. S’arrêter et recevoir sa demande.
4. Examiner la proposition de prix et la destination.
5. Accepter, refuser ou faire une contre-proposition.
6. Conduire le client jusqu’à destination.
7. Recevoir le paiement et une éventuelle évaluation.
8. Payer les dépenses de carburant, d’entretien ou de location.
9. Recommencer et progresser.

### 8.2 Conduite

Le joueur peut accélérer, freiner, reculer, tourner, klaxonner, utiliser les phares et clignotants, et arrêter le moteur. La sortie du véhicule est hors périmètre initial et pourra être étudiée plus tard.

Le véhicule aura une conduite accessible avec accélération progressive, inertie, freinage, direction, adhérence, collisions et différences de comportement selon le modèle. Nids-de-poule et surfaces dégradées pourront influencer la conduite de manière lisible sans transformer la V1 en simulation professionnelle.

Les réglages de conduite comprendront sensibilité de direction et disposition des commandes. Les aides à la conduite pourront être ajustées pour les nouveaux joueurs.

### 8.3 Commandes multiplateformes

**Android :** commandes tactiles configurables, volant ou boutons de direction, accélérateur, frein/marche arrière, klaxon et interaction. La taille et la position des commandes doivent convenir à un écran de téléphone.

**PC :** clavier et souris pour les menus ; clavier pour conduire. La manette est une option à ajouter si elle est prise en charge correctement.

Les deux plateformes utilisent la même logique de jeu et la même progression locale lorsque le format de distribution le permet. Les menus et commandes s’adaptent à la taille de l’écran et au moyen d’entrée.

### 8.4 Caméra

La caméra principale suit le taxi à la troisième personne. Une vue arrière rapprochée pourra être proposée. Une vue intérieure est reportée tant qu’elle ne compromet pas le budget de performance ou la lisibilité.

### 8.5 Clients et courses

Les clients apparaissent dans des zones désignées : commerces, marchés, écoles, arrêts et lieux de passage. Les profils initiaux peuvent inclure étudiant, commerçant, fonctionnaire, parent, voyageur et client pressé. Chaque profil influence le budget ou la négociation sans réduire les personnes à des stéréotypes.

Pour la V1, le taxi individuel sera prioritaire. Le taxi collectif, avec plusieurs passagers et paiements séparés, est une extension après validation du premier système de course.

La négociation prend en compte la distance, le profil, l’heure et la demande. Les tarifs seront des valeurs de jeu, à calibrer par consultation locale ; ils ne seront pas présentés comme une grille tarifaire réelle officielle.

### 8.6 Économie et progression

La monnaie principale est le franc congolais (CDF/FC). Une valeur en USD pourra apparaître pour des scénarios de jeu, sans taux dépendant d’Internet. Le taux simulé sera défini dans les données du jeu.

Revenus possibles : courses, pourboires et missions. Dépenses possibles : carburant, réparations, pneus, entretien, amendes fictives et versement au propriétaire du véhicule.

La progression envisagée est : chauffeur utilisant un taxi loué, épargne, achat de son taxi, améliorations, puis achat de véhicules supplémentaires et gestion d’une flotte. La flotte et le recrutement de chauffeurs sont hors périmètre V1.

### 8.7 Circulation et événements

Le monde pourra accueillir taxis, minibus, motos, véhicules privés, utilitaires et piétons. Pour la première zone, la circulation sera limitée et organisée autour de routes et carrefours définis. Les comportements seront simplifiés pour tenir les performances.

Embouteillages, stationnement, travaux, accidents, pluie intense, panne et coupure d’éclairage sont des événements possibles pour des versions ultérieures. Les contrôles de police, s’ils sont inclus, resteront fictifs, non ciblés sur des personnes réelles et traités avec respect.

## 9. Lubumbashi en 3D

### 9.1 Sources et géographie

OpenStreetMap servira de base géographique pour les routes, intersections, bâtiments et points d’intérêt disponibles. Les données seront vérifiées et complétées par références locales. Elles ne fournissent pas automatiquement des bâtiments 3D détaillés ni la vérité complète du terrain.

Les données cartographiques seront converties en ressources de jeu, par exemple routes, nœuds de circulation, empreintes de bâtiments et points d’intérêt. Une attribution OpenStreetMap conforme à la licence devra accompagner la distribution si ses données sont utilisées. Les améliorations de base de données dérivées devront respecter l’ODbL.

### 9.2 Zone pilote et extensions

La V1 commence par un **secteur compact du centre-ville**, choisi après vérification des données et des références visuelles. Son périmètre précis sera fixé avant la production de contenu. Il comprendra un trajet jouable, plusieurs intersections et quelques lieux qui aident les habitants à reconnaître le secteur.

Extensions envisagées après validation : autres secteurs du centre, puis Kamalondo, Kenya, Katuba, Kampemba, Ruashi et Annexe. L’ordre dépendra de la qualité des références, de la cohérence des itinéraires et des retours de joueurs locaux.

### 9.3 Décors et ambiance

Le décor doit montrer des différences crédibles entre rues, façades, commerces et espaces publics, plutôt qu’un seul ensemble répété. La saison sèche pourra inclure poussière et sols secs. La saison des pluies pourra apporter flaques, boue, glissance et visibilité réduite. La météo avancée, le cycle jour/nuit et les coupures d’électricité sont des extensions après le prototype.

## 10. Architecture technique proposée

### 10.1 Décision de départ

Pour une première version accessible sur Android et PC dans le navigateur, la proposition est :

| Domaine | Proposition de départ |
|---|---|
| Éditeur et environnement de travail | Visual Studio Code (VS Code) |
| Langage principal du jeu | TypeScript strict |
| Runtime et outils JavaScript | Node.js (outils de développement, build et éventuel serveur) |
| Moteur | Babylon.js |
| Rendu de référence | WebGL 2, avec fallback/diagnostic selon appareils ; WebGPU ne sera pas obligatoire |
| Physique | Contrôleur de véhicule arcade spécifique ; moteur de collision/physique choisi après prototype |
| Modèles | Blender, export glTF/GLB optimisé |
| Build | Vite |
| Mode installable | PWA et service worker |
| Sauvegarde | IndexedDB avec versionnement et migrations locales |
| Données géographiques | OpenStreetMap, GeoJSON et format de scène optimisé pour le jeu |
| Backend | Aucun backend requis pour la boucle hors ligne V1 |
| Base de données future | PostgreSQL, accessible via Supabase si les fonctions cloud sont retenues |
| Cloud futur | Supabase facultatif pour compte et synchronisation, après la V1 locale |

Le choix du moteur est une hypothèse de travail à confirmer par un prototype sur les appareils cibles. La performance dépendra surtout du contenu, du nombre d’objets visibles, des textures, des effets et des navigateurs, pas seulement du moteur.

### 10.2 Séparation des responsabilités

Le code sera organisé autour de modules séparés : cœur de simulation, conduite, circulation, passagers, courses, économie, carte, rendu 3D, interface/commandes, audio et stockage. Les règles métier et données de progression ne doivent pas dépendre directement d’un objet de rendu 3D.

### 10.3 Structure indicative

```text
lushi-taxi/
├── apps/
│   └── game/
│       ├── src/
│       │   ├── app/           # démarrage et configuration plateforme
│       │   ├── game/          # simulation et boucle de jeu
│       │   ├── vehicle/       # conduite et réglages
│       │   ├── world/         # zones, routes, streaming local
│       │   ├── traffic/       # véhicules et règles de circulation
│       │   ├── people/        # piétons, clients et profils
│       │   ├── missions/      # courses et objectifs
│       │   ├── economy/       # revenus, dépenses et progression
│       │   ├── controls/      # tactile, clavier et manette
│       │   ├── ui/            # menus et interface de conduite
│       │   ├── audio/
│       │   └── storage/       # sauvegardes locales
│       └── public/
├── packages/
│   └── shared/                # types et données communes
├── assets/
│   ├── vehicles/ buildings/ roads/ characters/ sounds/
├── tools/
│   └── map-converter/
└── docs/                      # décisions, références et licences
```

La structure exacte sera ajustée au prototype ; elle ne justifie pas de créer d’emblée plusieurs applications ou services inutiles.

## 11. Sauvegarde et fonctionnement hors ligne

Le joueur peut commencer sans compte. La sauvegarde locale conserve l’argent, le véhicule, l’état du véhicule, les options, les missions et l’historique utile. Les données seront versionnées afin de permettre les évolutions du format.

La PWA mettra en cache l’application et les ressources nécessaires à la zone installée. Les contenus de zones additionnelles, s’ils sont ajoutés, devront indiquer clairement leur téléchargement et leur disponibilité hors ligne. La première version ne promet pas que toute la ville et tous ses contenus sont inclus dans un téléchargement minuscule.

Les fonctions dépendantes du réseau — synchronisation, comptes ou classements — seront facultatives et postérieures au jeu hors ligne. Si un compte cloud est ajouté, les conflits de sauvegarde devront être gérés explicitement et les scores validés côté serveur. Aucun secret serveur ne sera placé dans le client.

## 12. Performance, qualité et compatibilité

### Objectifs à mesurer

- Cible de 30 images/seconde sur le téléphone Android de référence, dans la zone pilote et avec une densité définie.
- Cible de 60 images/seconde sur un PC de référence à définir.
- Temps d’ouverture et de chargement compatibles avec une connexion instable, puis lancement sans réseau après installation/mise en cache.
- Réglages graphiques permettant de réduire résolution, ombres, distance d’affichage et densité de trafic.

Le budget initial de ressources sera mesuré plutôt que fixé à l’aveugle. L’objectif de téléchargement inférieur à 10 Mo ne concerne éventuellement que le shell initial de la PWA, pas la ville 3D complète. Les modèles, textures et sons devront être compressés et chargés par zone lorsque cela est possible.

Les appareils de référence et versions de navigateurs devront être choisis avant la validation de performance. Les essais doivent couvrir au minimum un Android modeste réel et un PC Windows réel ; un émulateur ne suffit pas à conclure sur le téléphone.

## 13. Interface

Écrans prévus à terme : menu, nouvelle partie, continuer, garage, véhicule, carte/GPS, économie, statistiques, options et profil. Les classements nécessitent une connexion et sont hors ligne par définition.

Pendant la conduite, l’interface peut afficher vitesse, carburant, état du véhicule, argent, GPS, distance et commandes. Sur Android, les éléments doivent rester lisibles et ne pas masquer les zones de circulation nécessaires. Sur PC, l’interface peut utiliser l’espace disponible et accepter les commandes clavier/manette.

Français et swahili katangais sont prévus. Les textes seront séparés des scripts afin de faciliter leur relecture et leur traduction.

## 14. Périmètre de la première version jouable

La V1 vise une expérience complète mais limitée :

- un secteur compact du centre de Lubumbashi documenté et validé ;
- un taxi principal, avec variantes seulement si le budget le permet ;
- commandes tactiles Android et clavier PC ;
- caméra troisième personne ;
- conduite, collisions et routes de qualité différente ;
- circulation et piétons en nombre limité ;
- clients, négociation simple, course individuelle, destination et paiement ;
- carburant, dépenses de base et réparation simple ;
- sauvegarde locale ;
- application installable et fonctionnement hors ligne pour le contenu installé ;
- français, puis swahili katangais lorsque les textes sont validés.

La V1 ne comprend pas nécessairement : toutes les communes, taxi collectif complet, sortie du véhicule, flotte d’entreprise, multijoueur, classements en ligne, météo avancée, cycle jour/nuit détaillé, radio commerciale ou synchronisation cloud.

## 15. Étapes et livrables

### Lot 0 — Cadrage et références

Confirmer zone pilote, plateformes/navigateurs et appareils de référence. Organiser références locales, sources et droits. Définir avec des personnes locales les critères de reconnaissance.

**Livrable :** dossier de références et fiche de critères de validation de la zone.

### Lot 1 — Prototype multiplateforme de conduite

Créer une scène temporaire, un véhicule, la caméra et les commandes tactiles/clavier. Vérifier le chargement sur Android et PC, la maniabilité et les premières mesures de performance.

**Livrable :** taxi conduisible sur les deux plateformes cibles.

### Lot 2 — Zone pilote de Lubumbashi

Convertir les données géographiques nécessaires, créer routes, carrefours, façades et premiers repères à partir du dossier local.

**Livrable :** secteur explorable et soumis à une première validation locale.

### Lot 3 — Personnes et circulation

Ajouter un petit ensemble de personnages lushois originaux, piétons et trafic simplifié. Vérifier leur apparence, leurs vêtements, leurs rôles et la densité avec des relecteurs locaux.

**Livrable :** zone vivante et culturellement relue.

### Lot 4 — Première boucle de transport

Ajouter clients, négociation, course, destination, paiement et évaluation.

**Livrable :** une course complète jouable.

### Lot 5 — Économie et sauvegarde

Ajouter revenus/dépenses, carburant, entretien de base, progression et sauvegarde locale.

**Livrable :** progression persistante hors ligne.

### Lot 6 — Stabilisation Android et PC

Adapter interface, réglages graphiques et mise en cache. Mesurer sur les appareils réels, corriger les problèmes et valider la reprise hors ligne.

**Livrable :** version jouable installable pour Android et accessible sur PC.

### Lots ultérieurs

Étendre la ville, ajouter taxi collectif, missions, météo et cycle temporel, plus de véhicules, compte cloud, flotte, puis éventuellement multijoueur. Chaque lot dépend de la validation du précédent.

## 16. Critères d’acceptation de la V1

La V1 est acceptée lorsque :

- elle s’exécute sur le téléphone Android et le PC de référence définis ;
- elle utilise le même projet, les mêmes règles de simulation et les mêmes données de jeu sur les deux plateformes ;
- les commandes tactiles fonctionnent sur Android et le clavier fonctionne sur PC ;
- le joueur peut conduire dans un secteur documenté de Lubumbashi ;
- les lieux, taxis, commerces et personnages ont été examinés par des personnes connaissant la ville et les retours majeurs ont été traités ;
- le joueur peut prendre un client, négocier, effectuer une course, recevoir un paiement et sauvegarder sa progression ;
- carburant et dépenses de base fonctionnent ;
- la zone installée peut être rejouée hors ligne après le téléchargement initial ;
- les performances sont mesurées sur les appareils retenus et les limites connues sont documentées ;
- les sources et licences des données et ressources sont consignées.

## 17. Risques et réponses

| Risque | Réponse prévue |
|---|---|
| Périmètre trop large | Limiter la V1 à un secteur, un véhicule et une boucle de course complète |
| Ville reconnaissable seulement par son nom | Références locales, lieux géographiques vérifiés et validation par des Lushois à chaque lot de contenu |
| Population générique ou caricaturale | Création originale, diversité crédible, revue culturelle et retours ciblés |
| Performances insuffisantes sur Android | Prototype précoce sur téléphone réel, budgets mesurés, réglages de qualité et densité adaptée |
| OSM incomplet ou inexact | Vérification, correction et enrichissement à partir de références locales autorisées |
| Difficultés PWA/hors ligne | Tester cache, stockage et reprise hors réseau dès les premiers lots, sur Android et PC |
| Problèmes de droits | Registre des sources, licences et autorisations pour cartes, photos, marques, sons et modèles |
| Dialogues ou tarifs artificiels | Relecture par locuteurs et consultation de personnes connaissant le transport local |

## 18. Outils et qualité du développement

Les outils proposés comprennent TypeScript strict, Vite, Babylon.js, Blender, glTF/GLB, IndexedDB et un service worker PWA. Vitest, ESLint, Prettier et l’intégration continue peuvent être introduits au rythme des besoins du projet. Ils servent à sécuriser les règles et la qualité, mais ne remplacent pas les essais visuels et de performance sur appareils réels.

VS Code sera l’éditeur de travail du projet. TypeScript sera utilisé pour le jeu et ses outils. Node.js servira à l’environnement de développement, aux commandes de build et, si nécessaire plus tard, à un serveur applicatif. PostgreSQL est prévu pour les fonctions connectées futures, par exemple via Supabase ; il n’est pas nécessaire à la boucle hors ligne de la V1. Supabase, un serveur dédié et Colyseus ne seront ajoutés que lorsqu’une fonctionnalité les justifie.

## 19. Décisions restant à confirmer avant le prototype

Ces points sont à trancher pendant le lot 0 ou le lot 1, à partir d’informations concrètes :

- le périmètre exact de la première zone et les lieux pilotes ;
- les modèles/catégories de taxi à représenter en premier ;
- le téléphone Android modeste de référence et le PC de référence ;
- l’accès PWA uniquement au lancement ou la nécessité ultérieure d’un paquet Android natif ;
- le nom final du jeu et les règles de représentation des commerces réels ;
- les expressions et tarifs de jeu à faire relire localement.

## Conclusion

**MWENDESHA doit d’abord réussir une petite partie de Lubumbashi avec justesse.** Le projet développera simultanément ses usages Android et PC à partir d’un jeu commun, en adaptant les commandes et l’affichage à chaque appareil. La ville et ses habitants guideront les décisions de contenu, tandis que les mesures sur téléphones modestes guideront les décisions techniques.

La première preuve de réussite sera simple à vérifier : un joueur reconnaît le secteur représenté, conduit un taxi adapté au contexte, prend un client, négocie une course et retrouve sa progression après avoir fermé le jeu — même sans connexion.

**MWENDESHA — Lubumbashi, notre ville, notre circulation, notre quotidien, notre jeu.**

