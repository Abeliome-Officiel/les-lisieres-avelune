# Les Lisières d'Avelune

Dépôt officiel de conception et de développement des **Lisières d'Avelune**.

## État courant

La dernière baseline de conception publiée est **v0.8.3**.

Le premier prototype expérimental réellement aligné sur cette baseline est
développé sur :

`develop/proto-0`

Le jalon courant de spécification est :

`proto-0-spec.1`

Le prototype historique `v0.9-dev.3`, fondé sur l'ancienne contrainte
« 1 TD + 1 TF + 1 RPG », est conservé comme historique et n'est pas la base de
PROTO-0.

## PROTO-0

PROTO-0 vise uniquement à valider la boucle :

**TF → RPG minimal → préparation TD → vague → conséquences**

Références :

- [Spécification PROTO-0](docs/proto0/PROTO0_SPECIFICATION.md)
- [Référence de données PROTO-0](docs/proto0/PROTO0_DATA_REFERENCE.json)
- [Backlog PROTO-0](docs/proto0/PROTO0_IMPLEMENTATION_BACKLOG.md)
- [Rapport de simulations](docs/proto0/PROTO0_SIMULATION_REPORT.md)

Principes principaux :

- 10 tours ;
- 1 vague ;
- 1 Corcite piloté + 4 Corcites simulés ;
- aucune limite artificielle « un ordre par axe » ;
- moteur déterministe à graine fixe ;
- TD interne à 8 positions ordonnées ;
- anneaux visuels sans effet mécanique dans PROTO-0 ;
- moteur headless avant interface.

## Baseline de conception

Documents de consolidation :

- [Index de consolidation](docs/conception/00_index.md)
- [v0.8.1 — TD / TF / RPG](docs/conception/01_v0.8.1_consolidation_td_tf_rpg.md)
- [v0.8.2 — progression et monde](docs/conception/02_v0.8.2_progression_monde.md)
- [v0.8.3 — baseline pré-prototype](docs/conception/03_v0.8.3_baseline_preprototype.md)

## Book historique

- [Book Markdown](docs/book/BOOK_Les_Lisieres_Avelune.md)
- [Book PDF](docs/book/BOOK_Les_Lisieres_Avelune.pdf)
- [Book DOCX](docs/book/BOOK_Les_Lisieres_Avelune.docx)

## Données de conception

- `csv/` : données tabulaires historiques ;
- `data/design_data.json` : données structurées de conception ;
- `design-data/` : classeurs ;
- `docs/` : documentation ;
- `logs/` : historiques et décisions ;
- `app/` : application SvelteKit ;
- `infra/` : infrastructure Docker.

## Historique des versions

Principaux jalons :

- `v0.4`
- `v0.5`
- `v0.6`
- `v0.7`
- `v0.8`
- `v0.8.1`
- `v0.8.2`
- `v0.8.3`
- `v0.9-dev.1`
- `v0.9-dev.3` — historique/legacy
- `proto-0-spec.1`

## Pilotage

- [Roadmap](ROADMAP.md)
- [Changelog](CHANGELOG.md)
- [Index documentaire](docs/index.md)
- [Journal complet des décisions](logs/JOURNAL_DECISIONS_COMPLET.md)
- [Journal de delta v0.8.x](logs/JOURNAL_DELTA_v0.8x.md)
- [Manifeste](MANIFEST.md)

Aucune licence n'est actuellement attribuée au projet.
Tous droits réservés par défaut.
