# Manifeste du dépôt

## État courant

Projet : Les Lisières d'Avelune  
Branche de développement/playtest : `develop/proto-0.2.2-playtest`  
Baseline stable : PROTO-0.1 sur `main`  
Jalon courant : PROTO-0.2.2 validé et poussé  
Commit fonctionnel de référence : `d3b080c`  
Statut : candidat de playtest distribué prêt à être déployé sur instruction explicite.

## Politique d'intégrité

Git reste la source d'intégrité fichier par fichier : objets Git, commits et historique. `MANIFEST.md` est un manifeste sémantique des ensembles du dépôt et ne duplique pas manuellement des SHA-256 de fichiers.

## Ensembles principaux

### Application

`app/`

- application SvelteKit ;
- moteurs historiques PROTO-0 et moteur actif P02.2 ;
- tests ;
- scripts de simulation ;
- Dockerfile multi-stage Node 24.

### Cœur fonctionnel P02.2

`app/src/lib/proto02/`

- état et règles du mini-jeu P02.2 ;
- économie, temporalités, recherche, défense et rapports structurés ;
- cœur indépendant de la persistance serveur.

### Couche playtest distribué

`app/src/lib/playtest/`

- version publique du playtest.

`app/src/lib/server/playtest/`

- accès PostgreSQL ;
- repositories PostgreSQL et mémoire ;
- service de sessions ;
- télémétrie ;
- feedback ;
- validation d’entrée ;
- SMTP.

`app/src/routes/api/playtest/`

- création de session ;
- reprise ;
- sauvegarde ;
- événement de télémétrie ;
- feedback.

### Migration PostgreSQL

`app/migrations/001_playtest_distributed.sql`

Migration additive créant les tables de sessions, événements et feedback du playtest distribué.

### Tests P02.2

`app/tests/proto0/`

La suite historique de régression reste conservée et est complétée notamment par :

- `p02-distributed-economy.test.ts` ;
- `p02-playtest-sessions.test.ts` ;
- `p02-feedback.test.ts`.

Validation finale connue du lot : **380/380 tests réussis**.

### Documentation PROTO-0.2

`docs/development/proto0.2/`

Sources prioritaires du lot final :

- `11_P02_2_FINAL_PLAYTEST_ARBITRATIONS.md` ;
- `10_P02_2_DISTRIBUTED_PLAYTEST_SPEC.md` ;
- `CURRENT_TASK.md` ;
- `TASK_QUEUE.md` ;
- `IMPLEMENTATION_REPORT.md` ;
- documents de règles, UX et garde-fous associés.

### Documentation historique PROTO-0

`docs/proto0/`

Les documents PROTO-0.1 et P0-P10 sont conservés comme baseline et traçabilité. Ils ne reprennent pas autorité sur les arbitrages plus récents de P02.2.

### Documentation architecture/développement

`docs/development/`

- audit architecture ;
- politique données/configuration ;
- méthode de développement ;
- dette technique ;
- tests/sécurité/persistance ;
- ADR structurants.

### Conception et historique

- `docs/conception/`
- `docs/00_vision.md` à `docs/16_proto_minimal.md`
- `logs/`
- `csv/`
- `data/`
- `design-data/`

Ces ensembles contiennent plusieurs générations de conception. Leur présence ne signifie pas qu'ils constituent tous une source runtime courante.

### Infrastructure

`infra/`

- PostgreSQL 17 ;
- application Node/SvelteKit ;
- réseaux Docker ;
- healthchecks ;
- variables SMTP/feedback ;
- `.env.example` versionné ;
- `infra/.env` réel exclu de Git.

## Source de vérité documentaire

Pour l'état courant P02.2 :

1. `README.md`
2. `ROADMAP.md`
3. `docs/index.md`
4. `docs/development/proto0.2/11_P02_2_FINAL_PLAYTEST_ARBITRATIONS.md`
5. `docs/development/proto0.2/10_P02_2_DISTRIBUTED_PLAYTEST_SPEC.md`
6. `docs/development/proto0.2/CURRENT_TASK.md`
7. `docs/development/proto0.2/IMPLEMENTATION_REPORT.md`

Les documents historiques sont conservés et explicitement reclassés comme tels dans l’index.

## État de publication

PROTO-0.2.2 est validé et poussé sur sa branche de playtest. Ce manifeste ne déclare ni merge vers `main`, ni tag de release, ni déploiement public.
