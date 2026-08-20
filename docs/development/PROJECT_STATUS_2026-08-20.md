# État du projet — 20 août 2026

Ce document est un **snapshot partageable daté**. Il complète `README.md`, `ROADMAP.md` et `docs/index.md` sans exposer les informations réservées du Cœur, les secrets techniques ou les détails d’exploitation privés.

## Verdict global

Avelune a désormais des frontières beaucoup plus nettes :

- le **PROTO est clos** et devient historique ;
- la qualification biologique ouverte du **Cœur** est suffisamment close ;
- la priorité est sa **qualification opérationnelle durable** ;
- les modules P1 à P6 disposent de baselines offline qualifiées à différents niveaux ;
- les phases live restent ordonnées derrière les gates du Cœur ;
- TA3 est autonome du PROTO ;
- le nettoyage historique sensible de GitHub est clos, mais l’hygiène courante du dépôt reste à terminer.

## 1. PROTO

**Statut : CLOS / HISTORIQUE.**

La lignée PROTO-0 → PROTO-0.2.2 ne doit plus être présentée comme candidat actif, playtest à poursuivre ou runtime à moderniser.

Une expérience locale de durcissement par secrets-fichiers a été testée avec succès mais n’a été ni intégrée ni publiée. Elle est abandonnée avec le prototype et ne constitue pas une dette active.

Une éventuelle instance encore déployée n’est qu’en maintien transitoire jusqu’à décommissionnement.

Voir `docs/development/PROTO_CLOSURE_2026-08-20.md`.

## 2. Cœur vivant

La recherche biologique ouverte est considérée **suffisamment close** au sens de la gate de suffisance. Le chantier actif est la qualification opérationnelle du Cœur permanent.

Le protocole d’endurance actuellement en cours reste prioritaire et ne doit pas être perturbé par les travaux documentaires ou par l’ajout opportuniste de consommateurs live.

La séquence post-protocole reste : analyse → freeze/archive si autorisé → primitives autoritatives P0 → neutralité biologique/RNG → arrêt/reprise → crash/atomicité → politique de temps → CREAD-LIVE → OBS/ORCH live → migration réelle → modules aval live → isolation des pannes → endurance intégrée longue → décision CŒUR-1.

## 3. P1 — Lecteur du Cœur

Baseline offline qualifiée.

Acquis partageables :

- `WorldReadEnvelope` versionné ;
- séparation entre `publication_seq`, `state_revision` et `canonical_age` ;
- continuité et resynchronisation portées par P1 ;
- mêmes contrats pour fixtures, replays et futures sources live ;
- convergence de frontière avec P5A et P5B qualifiée offline.

CREAD-LIVE reste bloqué jusqu’aux gates autoritatives/opérationnelles prévues.

## 4. P2 — Observabilité

OBS-0 offline est qualifié et gelé.

L’observabilité reste non autoritative : elle mesure, détecte et conserve des traces bornées sans muter le canon ni piloter automatiquement l’exploitation.

## 5. P3 — Orchestrateur

ORCH-0 offline est qualifié et gelé.

Le control plane porte identité des mondes, hosts, placements, opérations idempotentes, locks, confirmations et recovery, sans devenir autorité biologique.

Les opérations réelles de backup/restore/migration restent à qualifier sur des instances LAB dédiées selon la séquence prévue.

## 6. P4 — Tableaux Monde / Univers

La baseline offline est qualifiée et gelée.

Les tableaux lisent les surfaces P1/P2/P3 et ne deviennent ni une API privée du Cœur ni une autorité de contrôle implicite.

## 7. P5A — Visuel

La baseline VISUEL offline propre est qualifiée. La convergence contractuelle avec P1 est qualifiée offline.

Le visuel reste renderer-neutral, déterministe là où requis, isolé par `world_instance_id` et sans seconde logique de continuité.

Le travail live attend CREAD-LIVE.

## 8. P5B — Musique / Sonore

P5B OFFLINE GLOBAL est qualifié. La convergence avec P1 est également qualifiée offline.

La mémoire musicale est bornée et reconstructible ; le renderer reste remplaçable ; thèmes et préférences restent présentationnels et ne modifient pas le canon.

Le travail live attend CREAD-LIVE.

## 9. P6 — Fenêtre sur les Avelunes

P6-0 OFFLINE est qualifié.

La Fenêtre assemble P1 + P5A + P5B avec isolation multi-monde, dégradation contrôlée des modalités et préférences locales non canoniques.

La phase suivante est explicitement en attente du verdict du protocole Cœur en cours.

## 10. Tableau Réel — TA3

TA3 est autonome du PROTO et dispose de son propre domaine de persistance.

La surface publique reste en lecture seule. La surface privée est séparée et les écritures demeurent interdites tant que les gates d’authentification et de sécurité ne sont pas fermées.

TA3 n’est ni le Tableau Univers ni une console d’administration du Cœur.

## 11. GitHub — nettoyage historique et hygiène courante

### Nettoyage historique : CLOS

Le nettoyage contrôlé de l’ancien historique sensible a été mené à son terme. Les références réécrites sont la source de vérité et les anciennes copies issues du graphe antérieur doivent être contrôlées avant réutilisation.

Aucun nouveau rewrite global de l’historique n’est justifié par défaut.

### Identités GitHub

Les procédures d’exploitation séparent l’identité Avelune de l’identité personnelle/générique. Les clés privées restent locales et ne sont jamais documentées dans le dépôt.

### Secrets

GitHub reste une surface partageable. Aucun credential, secret runtime, clé privée, recovery code, seed privée, recette Cœur ou CODEX ne doit y être stocké sous prétexte que le dépôt est privé.

### Hygiène encore ouverte

Au moment de ce snapshot :

- plusieurs branches historiques doivent encore être classifiées ;
- les PR draft VISUEL anciennes doivent être fermées ou reclassées selon leur valeur historique ;
- `tmp-unused` doit être vérifiée ;
- la branche `security/sentinel-baseline-2026-08-20` doit être revue ;
- `main` doit recevoir une protection/ruleset adaptée ;
- CI, audits de dépendances/images et politique de sécurité `.github` doivent être renforcés.

Ces sujets restent actifs mais sont **indépendants du PROTO**.

## 12. Frontière de publication

Source de vérité :

- **GitHub** : code et documentation partageables ;
- **espaces privés/Coffre** : matière propriétaire, secrets de conception et détails Cœur non publiables ;
- **gestion des secrets techniques** : séparée du dépôt et de la documentation partageable.

La documentation publique peut décrire les frontières et garanties d’un système sans cartographier ses secrets internes.
