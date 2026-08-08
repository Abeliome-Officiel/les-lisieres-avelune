# PROTO-0.2 — File de tâches

La priorité unique actuelle est **P02-003 — PROTO-0.2.2 pack de playtest distribué**, définie dans `CURRENT_TASK.md` et détaillée dans `10_P02_2_DISTRIBUTED_PLAYTEST_SPEC.md`.

## P02-003 — Pack de playtest distribué

Statut : `READY_FOR_LONG_CODEX_RUN`

Ordre recommandé :

1. Gate A — corrections UX de playtest : mobile hexagones, Production impossible explicitée, rapport de cycle exhaustif, instrumentation cycles vides.
2. Gate B — sessions anonymes code 4 chiffres + persistance PostgreSQL.
3. Gate C — télémétrie structurée + formulaire feedback + stockage DB + notification SMTP facultative.
4. Gate D — intro/notice, version build, responsive, validations complètes, rapport d'implémentation.

Chaque gate doit rester fonctionnelle et testée avant de poursuivre. Codex peut enchaîner les gates sans validation humaine lorsqu'aucune décision de game design n'est requise.

## Périmètre gelé pendant P02-003

Ne pas ajouter :

- nouvelle mécanique destinée à remplir les cycles vides ;
- nouveaux types de tours ;
- nouvelles ressources ;
- nouveau RPG ;
- multijoueur ;
- monde persistant partagé ;
- comptes utilisateurs ;
- réseau Factorio/ports ;
- refonte de la vague ou des conditions de victoire.

Le taux de cycles contraints à l'attente doit être mesuré par télémétrie avant arbitrage.

## Après P02-003

Une fois la version de playtest distribuée et laissée active :

- geler les changements importants de conception de PROTO-0.2 ;
- collecter les sessions et retours pendant plusieurs semaines ;
- basculer le travail principal vers le cahier des charges/verrouillage du jalon suivant ;
- utiliser les données de playtest comme preuve, pas comme remplacement du jugement de design.
