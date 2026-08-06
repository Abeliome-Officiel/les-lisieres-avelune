# PROTO-0.2 — File de travail

Ce fichier décrit les lots prévus après `P02-001`. Il sert à éviter qu’un agent reste sans travail utile pendant un créneau long.

**Règle :** ne pas commencer automatiquement un lot dépendant d’un playtest ou d’une décision humaine non encore disponible. Dans ce cas, utiliser les travaux de remplissage autorisés par `05_EXECUTION_PLAN.md`.

## P02-001 — Mini-jeu PROTO-0.2 alpha

Statut : READY

Référence : `CURRENT_TASK.md`

Objectif : produire le premier parcours jouable avec nouvelle ergonomie, règles énergie/population mises à jour, réseau visuel, RPG visible, défenses et onde.

## P02-002 — Consolidation après premier playtest

Statut : WAITING_PLAYTEST

Entrées attendues :
- retours dans `PLAYTEST_FEEDBACK.md` ;
- arbitrages associés ;
- diff P02-001 stabilisé.

Travail probable :
- corriger les incompréhensions observées ;
- simplifier ou renforcer les gestes de manipulation ;
- corriger les règles révélées comme ambiguës ;
- conserver les composants déjà bons ;
- ne pas refaire l’ensemble de l’interface sans preuve que le modèle est encore mauvais.

## P02-003 — Boucle de run et fin de prototype

Statut : BLOCKED_BY_P02_001

Objectif :
- assurer une boucle courte cohérente ;
- cible de 3 ondes pour le test ;
- fin explicite ;
- statistiques simples déjà présentes ;
- recommencer proprement.

À ne pas faire si le cœur UX n’est pas encore stable.

## P02-004 — Robustesse interactions

Statut : BLOCKED_BY_P02_001

Objectif :
- Pointer Events robustes ;
- fallback clic/tap ;
- clavier ;
- tailles de cibles tactiles ;
- mobile étroit ;
- annulation de geste ;
- interactions sans état partiellement corrompu.

Peut être traité en autonomie une fois les interactions de P02-001 stabilisées.

## P02-005 — E2E du parcours critique

Statut : OPTIONAL_AFTER_CORE

Objectif : créer une petite suite E2E si le coût d’installation reste raisonnable.

Parcours prioritaires :
1. nouvelle partie ;
2. affectation population ;
3. activation fonction ;
4. production ;
5. connexion compatible ;
6. recherche et effet visible ;
7. défense placée ;
8. résolution d’une onde ;
9. restauration de sauvegarde.

Ne pas transformer ce lot en chantier CI complet si l’environnement n’est pas prêt.

## P02-006 — Briques réutilisables et documentation

Statut : OPTIONAL_BACKGROUND

Objectif : durcir les primitives validées :
- API claires ;
- props/types cohérents ;
- tests ciblés ;
- documentation courte ;
- suppression de duplication née pendant le prototype.

Ce lot est particulièrement adapté à une longue fenêtre autonome si le playtest a déjà confirmé les primitives concernées.

## P02-007 — Ergonomie qualitative supplémentaire

Statut : REQUIRES_SPEC

Uniquement après discussion et spécification :
- amélioration visuelle de la vue Corcite ;
- hiérarchie typographique ;
- densité ;
- états interactifs ;
- cohérence des formes ;
- ambiance Avelune légère.

Ce n’est pas une direction artistique finale.

## P02-008 — Données / vocabulaire

Statut : REQUIRES_SPEC

Uniquement après validation humaine des données ou du vocabulaire à intégrer. Convient aux créneaux longs une fois la structure de données stabilisée.

## Règle de choix automatique

Si le lot courant est terminé plus tôt :

- choisir d’abord un lot `OPTIONAL_BACKGROUND` compatible ;
- sinon renforcer tests/accessibilité/documentation du travail déjà validé ;
- ne jamais prendre un lot `WAITING_PLAYTEST` ou `REQUIRES_SPEC` sans son entrée humaine.
