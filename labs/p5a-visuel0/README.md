# LAB P5A VISUEL-0

Baseline offline neuve pour P5A VISUEL.

## Principes

- aucune dépendance vers `labs/visuel0`, `labs/visuel1` ou `labs/visuel2` ;
- aucune dépendance runtime tierce au démarrage ;
- aucun accès au Cœur, au SQLite actif ou au soak O1 ;
- aucun schéma P1 recopié localement avant publication de sa forme qualifiée ;
- les anciens LAB servent seulement de références comparatives.

## État

Le LAB est volontairement **scaffold-only** tant que P1 n’a pas synchronisé la forme partageable incluant `publication_seq`.

Une fois cette autorité disponible, l’ordre d’implémentation sera :

1. loader strict de la frontière P1 ;
2. session `publication_seq` / `stream_id` / resync ;
3. `VisualPayload v0.1` expérimental ;
4. fixtures offline ;
5. semantic replay loader ;
6. mémoire visuelle namespacée par monde ;
7. grammaire minimale ;
8. renderer factice ;
9. seulement ensuite comparaison avec les anciens prototypes.

Les préférences utilisateur de P5A sont exclusivement **visuelles/sensorielles** et restent aval du canon.
