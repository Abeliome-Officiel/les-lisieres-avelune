# PROTO-0.2 — Rapport d’implémentation courant

**Statut : REVIEW_REQUIRED**

Dernière mise à jour : 2026-08-08, après revue visuelle humaine et correction du lot P02-002.

## État Git

- Branche : `develop/proto-0.2-ux-rules`
- Baseline technique précédemment validée : `proto-0.2.0-tech`
- Ouverture du lot UX P02-002 : `4cfd602708ffff63ab4a7d24824f167acaec52dd`
- Correctif principal interface : `2a09eabccf8f085945f9648af9d2a085202e8632`
- Précision documentaire des critères UX : `0b1bee6683ef3f18043c61298a2584f7c5d2d45f`
- Vocabulaire de fabrication clarifié dans le moteur : `25508e35184cb156736afae8684f6533aa6e9081`
- Push / merge / déploiement public : aucun demandé dans ce lot.

Le statut n’est volontairement plus `REVIEW_READY` : les contrôles techniques de la baseline étaient verts, mais les nouveaux changements UX du 8 août doivent repasser `check`, tests et build puis être observés dans un navigateur avant validation.

## Baseline mécanique conservée

Le lot actuel ne rééquilibre pas le jeu. Les règles P02 existantes restent inchangées :

- plateau économique de 19 cellules ;
- aucune mécanique de réseau/ports/câbles ;
- stockage mécanique uniquement par bâtiments de stockage ;
- ressources initiales primaires uniquement ;
- Atelier de construction pour les bâtiments économiques ;
- Fabrique défensive pour les tours ;
- une seule famille défensive active, Affaiblissement ;
- onde active à une seule caractéristique, `Puissance` ;
- Puissance résiduelle `0` = victoire immédiate du testeur ;
- Intégrité `0` = victoire du jeu ;
- quatre niveaux répétables au total partagé pour la recherche ;
- aucune matière issue des ondes dans l’économie P02.

Les tests de gameplay/équilibrage humain sont volontairement remis à plus tard par l’utilisateur. Ce lot corrige d’abord la représentation et la manipulation.

## Corrections UX réalisées après les captures du 8 août

### Structure hexagonale

La géométrie CSS a été remplacée par une vraie tessellation axiale cohérente avec la forme dessinée des hexagones.

Règle désormais explicitement documentée :

> Deux cellules voisines partagent une arête commune complète, sans espace, gouttière ni triangle décoratif entre elles, comme pour la représentation des anneaux.

Cette contiguïté est uniquement visuelle/spatiale ; elle n’ajoute aucune mécanique d’adjacence.

La taille et la position d’une cellule ne changent plus selon son état. Sélection, prévisualisation et implantation ne modifient que son rendu, pas sa géométrie.

Le plateau a été agrandi pour occuper réellement la zone centrale.

### Gisements et bâtiments

- bâtiment posé = information visuelle principale ;
- gisement = petit marqueur secondaire fixe ;
- le marqueur de gisement est réduit et atténué lorsque la case est occupée ;
- le gisement reste néanmoins identifiable.

### Densité et occupation de l’écran

- HUD légèrement compacté ;
- colonnes latérales resserrées ;
- zone centrale renforcée ;
- cartes du kit initial réduites ;
- le kit complet n’est plus affiché en permanence dans Évolution/Défenses pendant le déploiement ; un rappel compact renvoie vers Structure ;
- une fois le déploiement terminé, le kit disparaît comme auparavant.

### Évolution

- cartes densifiées ;
- `Transformation` devient visuellement la racine ;
- les relations affichées utilisent seulement les vrais prérequis du moteur ;
- connecteurs plus visibles ;
- chaque descendant indique explicitement `depuis Transformation` ;
- aucun prérequis fictif ajouté.

### Fabrication et extracteurs

Le moteur contenait déjà les recettes permettant à l’Atelier de fabriquer de nouveaux extracteurs. L’impression qu’ils étaient impossibles à reconstruire était donc un problème de lisibilité, pas une règle manquante.

Corrections :

- description de l’Atelier explicite ;
- indication contextuelle qu’un nouvel extracteur fabriqué rejoint l’inventaire puis peut être implanté ;
- `Façonner 1 composant` devient `Fabriquer 1 composant` dans la donnée source, l’interface et les Échos associés ;
- la Fabrique défensive utilise également le verbe explicite `Fabrique`.

### Défenses

La vue tactique représente désormais explicitement la séquence :

`Fracture → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → Corcite`

Les positions ne sont plus présentées comme huit grandes zones indépendantes. L’ordre et le sens de parcours de la Puissance sont visibles graphiquement.

### Rapport de cycle

Le petit feedback en bas de page n’est plus le seul retour après résolution.

Une surcouche de cycle affiche désormais :

- cycle résolu et cycle suivant ;
- variations nettes de ressources ;
- variations nettes d’objets fabriqués ;
- recherches terminées pendant le cycle ;
- si une onde a été résolue : Puissance initiale/résiduelle et Intégrité avant/après.

Le rapport d’onde détaillé reste séparé du journal technique/Échos.

### Responsive et mouvement

Les trois tailles de tessellation utilisent la même géométrie contiguë. Les animations de prévisualisation sont neutralisées sous `prefers-reduced-motion`.

## Contrôles techniques

### Baseline avant le correctif UX

La baseline technique précédente avait passé :

- `npm run check` ;
- `npm run test:proto0` — 366 tests ;
- `npm run simulate:proto02` ;
- `npm run build` ;
- image Docker et `/api/health`.

### Correctif UX du 8 août

À rejouer avant de taguer ou déployer :

```bash
cd app
PATH=/SSD-Sata/CONTainers-Data/Codex_CLI/tools/node-v24.19.0-linux-x64/bin:$PATH npm run check
PATH=/SSD-Sata/CONTainers-Data/Codex_CLI/tools/node-v24.19.0-linux-x64/bin:$PATH npm run test:proto0
PATH=/SSD-Sata/CONTainers-Data/Codex_CLI/tools/node-v24.19.0-linux-x64/bin:$PATH npm run build
cd ..
git diff --check
```

GitHub ne rapporte actuellement aucun workflow CI attaché à ces commits ; l’absence de statut GitHub ne vaut donc pas validation.

## Contrôle visuel humain requis

Avant de considérer P02.1 validé :

1. ouvrir Structure à zoom navigateur 100 % ;
2. vérifier qu’aucun interstice n’existe entre deux hexagones voisins ;
3. lancer plusieurs implantations sans confirmer et vérifier que le plateau ne bouge jamais ;
4. poser un bâtiment sur un gisement et vérifier la hiérarchie bâtiment/gisement ;
5. ouvrir Évolution et vérifier la lecture immédiate de la racine et de ses descendants ;
6. vérifier la fabrication de nouveaux extracteurs dans l’Atelier ;
7. terminer un cycle et contrôler la nouvelle surcouche ;
8. ouvrir Défenses et vérifier la lecture Fracture → 1…8 → Corcite ;
9. contrôler une largeur mobile représentative sans perte de fonction ni rupture de la tessellation.

## Prochaine décision

Aucune nouvelle décision de game design n’est demandée pour cette passe. Après validation visuelle de ces corrections, l’utilisateur pourra reprendre les tests de jeu et d’équilibrage proprement dits.
