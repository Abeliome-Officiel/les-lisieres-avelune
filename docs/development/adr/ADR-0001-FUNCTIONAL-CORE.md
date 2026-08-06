# ADR-0001 - Conserver un coeur métier indépendant de l'interface

Statut : accepté pour la poursuite du prototype.

## Contexte

Les moteurs du PROTO-0 sont utilisés par les tests, les simulations et le navigateur. La logique principale ne doit pas dépendre de Svelte.

## Décision

Conserver la direction :

`UI/API -> application/orchestration -> domaine/règles`

Les règles TF/RPG/TD/vague restent testables hors navigateur et déterministes lorsque leur seed/ruleset l'est.

## Conséquences

- simulation et jeu utilisent les mêmes règles ;
- moins de divergences entre UI et moteur ;
- future API serveur possible sans réécrire le domaine ;
- l'UI doit éviter de recalculer des règles métier elle-même.
