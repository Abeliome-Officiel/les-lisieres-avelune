# Manifeste du dépôt

## État courant

Projet : Les Lisières d'Avelune  
Branche de développement jouable : `develop/proto-0.1-playable`  
Baseline de conception : v0.8.3 + décisions et prototype jouable postérieurs  
Statut : PROTO-0 intégré prêt pour playtest humain.

## Politique d'intégrité

L'ancien manifeste maintenait manuellement un nombre de fichiers et des SHA-256. Cette liste était devenue obsolète à mesure que le prototype évoluait.

À partir de cet audit, **Git est la source d'intégrité fichier par fichier** (objets Git, commits et historique). `MANIFEST.md` devient un manifeste sémantique des ensembles du dépôt et ne duplique plus les empreintes que Git maintient déjà.

## Ensembles principaux

### Application

`app/`

- application SvelteKit ;
- moteurs PROTO-0 ;
- tests ;
- scripts de simulation ;
- Dockerfile.

### Prototype jouable courant

`app/src/lib/proto0/`

Sous-ensembles : `domain`, `config`, `corcite`, `turn`, `tf`, `rpg`, `td`, `wave`, `simulation`, contrôleur navigateur et carnet.

### Documentation PROTO-0

`docs/proto0/`

Documents courants :

- `PROTO0_PLAYABLE_SCOPE.md`
- `PROTO0_PLAYTEST_READY.md`
- `PROTO0_TEST_NOTEBOOK.md`
- `PROTO0_PLAYABLE_BALANCE_REPORT.md`
- `PROTO0_PLAYABLE_REFERENCE_PLAYTHROUGH.md`

Documents P0-P10 conservés comme historiques/régression : spécification, data reference, backlog, simulation report et P9 engine report.

### Documentation architecture/développement

`docs/development/`

- audit du 6 août 2026 ;
- architecture actuelle/cible ;
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

- PostgreSQL ;
- application Node/SvelteKit ;
- réseaux Docker ;
- configuration de déploiement et healthchecks.

## Source de vérité documentaire

Pour l'état courant :

1. `README.md`
2. `ROADMAP.md`
3. `docs/index.md`
4. `docs/proto0/PROTO0_PLAYABLE_SCOPE.md`
5. `docs/development/`

Les documents historiques sont conservés et explicitement étiquetés comme tels dans l'index.
