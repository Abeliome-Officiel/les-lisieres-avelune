# Roadmap — PROTO-0

Baseline de conception : **v0.8.3**

Spécification expérimentale : **proto-0-spec.1**

Branche : **develop/proto-0**

## Objectif

Valider :

**TF → RPG minimal → préparation TD → vague → conséquences**

Le challenge final, l'équilibrage définitif et les systèmes sociaux ne font pas
partie de PROTO-0.

## Phases

### P0 — Fondation headless
- configuration ;
- graine ;
- sessions indépendantes ;
- snapshots ;
- tests de reproductibilité.

### P1 — État du Corcite
- stocks ;
- unités ;
- capacités ;
- réservations ;
- sauvegarde.

### P2 — Résolution de tour
- pas de quota arbitraire par axe ;
- fin de tour explicite ;
- conflits ;
- arbitrages ;
- ordre de résolution déterministe.

### P3 — TF minimal
- extraction ;
- transformation ;
- fabrication ;
- stockage individuel ;
- buffers N → N+1 ;
- bifurcations.

### P4 — RPG minimal
- modificateurs ;
- recherche ;
- déblocages ;
- impact mécanique réel sur TF ou TD.

### P5 — TD interne
- 8 positions ;
- ordre mécanique ;
- Atténuation ;
- Déstructuration ;
- Captation ;
- Stabilisation.

### P6 — Vague
- pression ;
- structure ;
- charge ;
- matière capturable ;
- variation seedée ;
- prévision progressive.

### P7 — Conséquences
- résultat ;
- état persistant ;
- consommations ;
- matière captée ;
- connaissance.

### P8 — Observabilité
- logs ;
- télémétrie ;
- sauvegarde ;
- rapport joueur distinct.

### P9 — Simulations
- nominal ;
- aléatoire borné ;
- stress ;
- comparaison d'ordonnancements ;
- régression.

### P10 — Interface
Seulement après validation suffisante du moteur headless.

## Critère de sortie

PROTO-0 doit démontrer de manière reproductible :

- que le TF conditionne réellement le TD ;
- que le RPG change au moins un choix utile ;
- que l'ordre des tours TD change le résultat ;
- que la vague est explicable ;
- qu'une défense imparfaite produit des conséquences ;
- que le joueur dispose d'un rapport lisible ;
- que les calculs peuvent être reconstruits techniquement.

<!-- PROTO0_PLAYABLE_FINAL_20260806 -->
## PROTO-0 jouable — état actuel

- [x] Lots 1 à 11 — boucle miniature et interface.
- [x] Lot 12 — carnet de test contextualisé.
- [x] Lot 13 — simulations multi-graines et rapport.
- [x] Lot 14 technique — parcours intégral automatisé.
- [ ] Lot 14 expérientiel — playtest humain et conclusions.

Référence temporelle actuelle : première vague au tour 6 ; ensuite minimum cinq tours plus zéro à deux tours de retard déterministe.
