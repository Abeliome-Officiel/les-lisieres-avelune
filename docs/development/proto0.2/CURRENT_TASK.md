# CURRENT TASK — P02-003 — PROTO-0.2.2 pack de playtest distribué

**Status : VALIDATED_AND_PUSHED — AWAITING_EXPLICIT_PUBLIC_DEPLOYMENT**

**Branche : `develop/proto-0.2.2-playtest`**

**Commit fonctionnel de référence : `d3b080ca913839b71e7a04f281f80d2b0da6c8ac`**

## Mission

Transformer PROTO-0.2.1 en une version **diffusable pendant quelques semaines**, sans ouvrir la prochaine grande phase de conception.

Cette mission est **fonctionnellement terminée et validée**.

Le lot permet désormais à un testeur anonyme de :

1. comprendre immédiatement ce qu'il teste ;
2. créer une partie avec un code numérique à 4 chiffres ;
3. reprendre cette partie plus tard ou depuis un autre appareil ;
4. jouer le même PROTO-0.2 sans réinvention mécanique ;
5. signaler à tout moment bug, incompréhension, idée, désaccord, optimisation ou proposition ;
6. produire une télémétrie minimale permettant d'analyser rythme, blocages et cycles vides ;
7. conserver ses données côté serveur.

Aucun quota artificiel de sessions n'est introduit.

## Sources normatives principales

1. `docs/development/proto0.2/11_P02_2_FINAL_PLAYTEST_ARBITRATIONS.md`
2. `docs/development/proto0.2/10_P02_2_DISTRIBUTED_PLAYTEST_SPEC.md`
3. `docs/development/proto0.2/IMPLEMENTATION_REPORT.md`

Le document `11` prévaut lorsqu'il précise ou remplace le document `10`.

## Gates — état final

### Gate A — corrections UX et économie de laboratoire

**VALIDÉE**

- Stock global contextualisé ;
- cellule vide → implantation ;
- Production avec coûts, durées et causes d’impossibilité ;
- asymétrie Organique / Minéral ;
- rapport de cycle structuré ;
- instrumentation `forced_wait` / `voluntary_wait` ;
- simulations de non-soft-lock ;
- première défense accessible avec les matières primaires.

### Gate B — sessions serveur

**VALIDÉE**

- PostgreSQL minimal sans ORM lourd ;
- migration additive ;
- UUID interne distinct du code public ;
- code public 4 chiffres ;
- collisions gérées sans quota global ;
- sauvegarde/reprise ;
- versionnement de sauvegarde ;
- conflits LWW journalisés ;
- repositories testables avec fakes mémoire.

### Gate C — télémétrie et feedback

**VALIDÉE**

- journalisation serveur structurée ;
- métriques de cycles vides ;
- formulaire permanent `Signaler / proposer` ;
- stockage feedback en DB avant notification ;
- SMTP facultatif ;
- échec SMTP non destructif ;
- envoi SMTP réel validé de bout en bout.

### Gate D — notice, intégration, qualité

**VALIDÉE**

- introduction avant partie ;
- notice/règles consultables ;
- ressources compactes `icône + nom + quantité` ;
- version/commit visible ;
- responsive desktop, 390×844 et 360×800 revu humainement ;
- rapport d’implémentation mis à jour ;
- commit/push effectué.

## Validation finale acquise

- `npm run check` / `svelte-check` : **0 erreur, 0 warning** ;
- `npm run test:proto0` : **380/380 tests réussis** ;
- simulations P02.2 : **PASS** ;
- `npm run build` / build Docker : **PASS** ;
- `git diff --check` : **PASS** ;
- PostgreSQL 17 réel + migration : **PASS** ;
- création/reprise/sauvegarde/conflit : **PASS** ;
- HTTP réel : **PASS** ;
- garde-fous `turn >= 0` et `stateVersion >= 1` : **PASS** ;
- feedback API → PostgreSQL → SMTP : **PASS** ;
- réception du mail de test : **confirmée** ;
- revue humaine desktop/mobile : **acceptable pour diffusion**.

## Défauts connus acceptés pour P02.2

- superpositions/doubles bordures légères entre certains hexagones ;
- léger potentiel d’optimisation de l’espace autour du plateau ;
- panneau droit encore sous-exploité ;
- direction graphique du Corcite non figée.

Ces points ne doivent pas déclencher de refonte pendant la collecte, sauf s’ils deviennent réellement bloquants pour les testeurs.

## Règle de gel après distribution

Après déploiement :

- ne corriger que les bugs bloquants ou les problèmes empêchant la collecte ;
- ne pas recalibrer les mécaniques à chaud sur quelques retours isolés ;
- laisser la télémétrie et les retours s’accumuler pendant plusieurs semaines ;
- déplacer le travail principal vers la préparation du jalon suivant et l’exploration visuelle.

## Actions encore séparées de P02-003

- déploiement public : **non effectué par cette tâche sans instruction humaine explicite** ;
- merge vers `main` : non effectué ;
- tag de release : non effectué ;
- choix final de direction graphique du Corcite : ouvert.

## Interdictions maintenues

Ne pas :

- créer un compte utilisateur ;
- créer du vrai multijoueur ;
- ajouter une nouvelle famille de tour ;
- ajouter une ressource ;
- changer les conditions de victoire ;
- refaire le rythme des vagues pendant la collecte ;
- créer un système analytics générique ;
- merger `main` ou taguer sans décision explicite.
