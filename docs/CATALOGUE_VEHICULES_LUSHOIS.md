# Catalogue des véhicules lushois — MWENDESHA

**Révision :** références visuelles transmises par le porteur du projet. Les photos servent de guide de forme et de composition uniquement : elles ne sont pas utilisées comme textures, images embarquées ni éléments redistribués. Les marques évoquées sont des hypothèses lorsque la photo ne permet pas une identification certaine.

## 1. Taxi joueur — citadine jaune à hayon

| Élément | Statut | Décision de modélisation |
|---|---|---|
| Catégorie et rôle | **Confirmé par photo** | Petite voiture taxi jaune, véhicule conduit par le joueur. |
| Silhouette | **Confirmé par photo** | Citadine compacte à hayon, carrosserie courte, toit arrondi, capot court, pare-brise incliné. Une référence évoque aussi une compacte plus arrondie. |
| Marque/modèle exact | **À VALIDER** | Une Toyota Vitz/Yaris est une piste de silhouette, pas une identification établie par les photos. Aucun logo de constructeur ne sera ajouté. |
| Couleur et bandes | **Confirmé par photo** | Carrosserie entièrement jaune, sans bandes décoratives visibles dans les références. |
| Numéro de taxi | **Confirmé par photo** | Numéro sombre sur autocollant blanc rectangulaire placé sur la portière avant. Numéro temporaire de modèle : « 024 », modifiable après validation locale. |
| Plaque | **Confirmé par photo** | Plaque présente à l’arrière. Numéro et format précis : **À VALIDER**. |
| Détails | **Confirmé par photo** | Vitres sombres, rétroviseurs extérieurs, phares et roues visibles. |
| Usure | **Confirmé par photo** | Usure moyenne : poussière et marques d’usage légères. La fréquence et l’emplacement des bosses restent **À VALIDER**. Pas de carrosserie détruite. |

Le GLB actuellement chargé est `src/assets/models/lushois-yellow-hatchback.glb` (**NON VALIDÉ — modèle provisoire**). Il ne constitue pas encore le modèle final approuvé. Les dimensions et formes sont une interprétation de jeu cohérente avec les vues photographiques, pas le relevé d’un véhicule précis. Les GLB fournis ou validés par le porteur du projet sont à déposer dans `src/assets/models/raw/` avant intégration.

## 2. Autres taxis observés

| Variante | Statut | Notes |
|---|---|---|
| Berline jaune à coffre, génération ancienne | **Confirmé par photo** | Véhicule secondaire de trafic. Marque et modèle exacts : **À VALIDER**. |
| Break jaune avec galerie de toit | **Confirmé par photo** | Variante secondaire de trafic. Modèle exact, fréquence et état précis : **À VALIDER**. |
| Autres compactes/berlines jaunes | **Confirmé par photo** | La flotte de circulation est variée ; ne pas cloner exclusivement le véhicule joueur. |

## 3. Fourgonnette / taxi-bus — trafic secondaire

| Élément | Statut | Notes |
|---|---|---|
| Présence d’une fourgonnette jaune de forme carrée, avec vitrages latéraux | **Confirmé par photo** | À conserver dans le trafic secondaire, jamais comme véhicule principal du joueur dans cette révision. |
| Toyota Hiace | **À VALIDER** | Le type exact n’est pas identifiable avec certitude à partir des références de cette livraison. Le Hiace existant est conservé comme fourgonnette/minibus secondaire provisoire, sans logo ni marque affichée. |
| Porte coulissante, receveur et destination peinte | **À VALIDER** | Éléments à confirmer par des références locales spécifiques avant d’être traités comme détails systématiques. |

## 4. Rue et usagers visibles dans les références

| Élément | Statut | Usage dans la direction artistique |
|---|---|---|
| Embouteillages mêlant taxis et piétons | **Confirmé par photo** | Composer des carrefours denses, avec véhicules arrêtés et piétons à proximité. Les situations ne représentent pas un comportement universel de la population. |
| Motos, casques et gilets réfléchissants | **Confirmé par photo** | Variantes d’usagers motorisés. Leur fréquence et les zones de circulation sont **À VALIDER** localement. |
| Poncho de pluie jaune, pagne, uniformes scolaires | **Confirmé par photo** | Variété de silhouettes et de vêtements observés ; ne pas réduire les habitants à un seul costume ou stéréotype. |
| Panneaux publicitaires et feux | **Confirmé par photo** | Repères visuels de carrefour ; contenu des publicités, emplacement et signalisation exacte **À VALIDER**. |
| Rond-point avec monument et drapeaux congolais | **Confirmé par photo** | Référence de composition ; identifier le rond-point et le monument exacts avant une reproduction nommée (**À VALIDER**). |

## 5. Vues de validation du modèle

- [Vue arrière — caméra de jeu](captures/taxi-citadine-arriere.png)
- [Vue côté](captures/taxi-citadine-cote.png)
- [Vue trois quarts](captures/taxi-citadine-trois-quarts.png)

## 6. Sources, droits et limites

- **Références primaires :** cinq photos fournies par le porteur du projet dans la conversation. Le dossier `docs/references/` est préparé pour les originaux, mais ne contient pas actuellement les fichiers photo. Les observations ci-dessus sont transcrites des images jointes à la conversation. Aucun pixel des photos n’a été incorporé au GLB ni utilisé comme texture.
- **Droits des photos :** auteur, licence et autorisation de reproduction **À VALIDER**. Usage de référence interne seulement. Ne pas redistribuer ni publier les photos dans le jeu sans autorisation explicite.
- **Registre connexe :** `docs/REFERENCES_LOCALES_LUBUMBASHI.md` consigne la provenance et les limites d’usage.
- **Sources locales de contexte :** le portail du Haut-Katanga décrit les taxis/bus réglementés comme généralement jaunes ; Radio Okapi décrit des taxis et taxi-bus majoritairement jaunes ainsi que les lieux de stationnement. Ces sources ne permettent pas à elles seules de déterminer la marque des citadines visibles dans les photos.
  - [Gouvernement provincial du Haut-Katanga — transports et couleurs](https://gouvhautkatanga.org/explorer/)
  - [Radio Okapi — taxis, taxi-bus, lieux de stationnement et circulation à Lubumbashi](https://www.radiookapi.net/2020/02/24/actualite/societe/lubumbashi-les-taximen-accuses-de-non-respect-du-code-de-la-route)

## 7. Validation attendue

Confirmer la silhouette, le jaune, le format de l’autocollant/numéro, l’usure moyenne et les vues du modèle joueur. Les éléments **À VALIDER** restent provisoires. La prochaine étape après cette validation est la collecte de données géographiques OSM, sans nouvelle modélisation et sans modification du rendu.
