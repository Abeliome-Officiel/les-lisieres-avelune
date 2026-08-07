# PROTO-0.2 — Plan d’exécution

Le plan actif est volontairement simple. `CURRENT_TASK.md` fait foi pour le détail.

## Phase 1 — audit et migration
- état Git/worktree ;
- moteurs/types/tests existants ;
- identifier les dépendances historiques devenues incompatibles ;
- préparer la migration sans dupliquer l’état.

## Phase 2 — socle de jeu
- plateau hexagonal ;
- déploiement initial ;
- stockage par bâtiments ;
- extraction/transformation/fabrication ;
- fabrication des bâtiments et défenses ;
- réservations/sorties bloquées ;
- démontage/remontage ;
- énergie/population/entretien.

## Phase 3 — progression et défense
- arbre de recherche global ;
- unlock Transformation ;
- améliorations utiles dont Stockage amélioré ;
- défense Affaiblissement ;
- inventaire → placement tactique.

## Phase 4 — challenge
- onde à Puissance unique ;
- croissance stricte ;
- résolution séquentielle ;
- dégâts d’Intégrité ;
- victoire testeur à résidu 0 ;
- victoire jeu à Intégrité 0 ;
- simulations et réglages de laboratoire.

## Phase 5 — UX/visuel
- composition Gen3 corrigée ;
- HUD ;
- fiche Corcite ;
- contexte ;
- inventaire ;
- vue défense ;
- rapports ;
- passe Avelune violet/prune/lavande/opaline, organique/minérale ;
- responsive et accessibilité.

## Phase 6 — robustesse
- persistance locale versionnée ;
- tests ciblés ;
- suite complète ;
- build ;
- smoke/E2E si disponible ;
- corrections ;
- rapport final.

Codex peut réordonner techniquement les sous-étapes, mais ne doit pas abandonner les phases visuelles, simulation ou robustesse une fois le cœur fonctionnel atteint.
