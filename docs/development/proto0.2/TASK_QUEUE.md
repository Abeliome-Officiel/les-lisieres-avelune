# PROTO-0.2 — File de tâches

La priorité **P02-003 — PROTO-0.2.2 pack de playtest distribué** est maintenant terminée fonctionnellement et validée.

## P02-003 — Pack de playtest distribué

Statut : `VALIDATED_AND_PUSHED`

Branche : `develop/proto-0.2.2-playtest`

Commit fonctionnel de référence : `d3b080c`.

Gates :

1. Gate A — UX/economie/rapport de cycle : **PASS**.
2. Gate B — sessions anonymes + persistance PostgreSQL : **PASS**.
3. Gate C — télémétrie + feedback + SMTP facultatif : **PASS**.
4. Gate D — intro/notice/build visible/responsive/validations : **PASS**.

Validation finale connue : 380/380 tests, 0 erreur/0 warning Svelte, build vert, PostgreSQL réel vert, smoke HTTP vert, SMTP réel bout en bout vert, revue desktop/mobile acceptée.

## Périmètre gelé pendant la collecte

Ne pas ajouter pendant le playtest distribué :

- nouvelle mécanique destinée à remplir les cycles vides ;
- nouveaux types de tours ;
- nouvelles ressources ;
- nouveau RPG ;
- multijoueur ;
- monde persistant partagé complet ;
- comptes utilisateurs ;
- réseau Factorio/ports ;
- refonte de la vague ou des conditions de victoire.

Le taux de cycles contraints à l'attente doit être mesuré par télémétrie avant arbitrage.

## Prochaine séquence

1. **Déployer P02.2 publiquement uniquement sur instruction humaine explicite.**
2. Laisser le playtest actif plusieurs semaines en limitant les changements aux bugs bloquants.
3. Collecter sessions, `forced_wait`, retours libres, incompréhensions et désaccords.
4. En parallèle, poursuivre les travaux qui ne contaminent pas les résultats mécaniques du playtest : documentation, exploration visuelle, préparation du jalon suivant.
5. Après accumulation suffisante, analyser les données et retours avant de décider du prochain lot mécanique.

## Exploration visuelle immédiate

Travail autorisé hors gel mécanique :

- produire plusieurs propositions réellement distinctes pour la représentation graphique du Corcite ;
- comparer silhouettes, rapports organique/minéral, lecture à petite taille, caractère onirique/féerique et cohérence avec l’interface ;
- ne pas intégrer une nouvelle direction dans le prototype distribué avant choix explicite.

## Dette UI reportée

À réexaminer après le playtest, sauf blocage réel :

- doubles bordures/superpositions légères entre hexagones ;
- meilleure exploitation de l’espace autour du plateau ;
- panneau droit actuellement sous-exploité ;
- éventuel déplacement futur de certaines ressources/actions globales vers la périphérie du plateau ou le panneau droit.

Les données de playtest servent de preuve et d’aide au jugement, pas de remplacement du jugement de design.
