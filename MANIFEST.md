# Manifeste du dépôt

## État courant — 13 août 2026

Projet : **Les Lisières d’Avelune**  
Baseline d’intégration : `main`  
Candidat jouable : `develop/proto-0.2.2-playtest`  
Chantiers parallèles actuels : **Cœur vivant** et **Tableau Réel (TA3)**.  
Conceptions de représentation cadrées : **MUSIQUE-0 / univers sonore** et **visuel du Cœur / LAB VISUEL**.

Le dépôt GitHub contient uniquement les éléments destinés au développement partagé. Les informations classées dans les espaces internes ne sont pas inventoriées ici. La frontière de publication porte sur le contenu comme sur la structure documentaire.

## Politique d’intégrité

Git est la source d’intégrité fichier par fichier. `MANIFEST.md` décrit les ensembles sémantiques du dépôt et ne duplique pas les SHA que Git maintient déjà.

Le nettoyage contrôlé de l’ancien historique GitHub est clos. Les références actuelles sont la source de vérité. Un ancien clone ou worktree doit être vérifié avant réutilisation afin de ne pas réintroduire un historique antérieur.

## Ensembles principaux

### Application

`app/`

Application SvelteKit, règles du prototype intégré, tests, simulations et Dockerfile.

### Prototype intégré à `main`

`app/src/lib/proto0/`

Baseline PROTO-0.1 conservée comme jalon stable tant qu’une intégration explicite plus récente n’est pas décidée.

### Candidat PROTO-0.2.2

Branche `develop/proto-0.2.2-playtest`.

Elle porte le mini-jeu distribué validé et son dossier `docs/development/proto0.2/`. Cette branche n’est pas automatiquement fusionnée dans `main`.

### Cœur vivant

Documentation partageable :

- `docs/21_coeur_vivant_genese_canonique.md`
- `docs/22_coeur_vivant_validation_2026-08-12.md`
- `docs/25_coeur_vivant_references_methode.md`

Le moteur de laboratoire détaillé reste dans son dépôt propriétaire séparé. Les documents GitHub n’en publient que le contrat, la méthode autorisée et les résultats suffisamment agrégés nécessaires au pilotage.

Le Cœur ne dépend d’aucun interpréteur. Les futurs visuel et sonore s’y raccordent par adaptateurs et contrats sémantiques versionnés ; ils ne prennent pas les structures internes du laboratoire comme API durable.

### Univers sonore / MUSIQUE-0

Documentation et terrain partageables :

- `docs/23_univers_sonore_contrat_public.md`
- `docs/26_univers_sonore_references_methode.md`
- `docs/27_musique0_cahier_integration.md`
- `docs/contracts/representation-semantic-v0.schema.json`
- `docs/contracts/musique0-fixtures/`
- `lab/musique0/README.md`
- `lab/musique0/GATE0_READY.md`
- `lab/musique0/.gitignore`
- `tools/musique0/check_public_fixtures.py`

MUSIQUE-0 est autorisé comme laboratoire hors ligne et réversible. Le **Gate 0 est VERT** : le contrat expérimental 0.2.0, les trois fixtures synthétiques neutres, leur manifeste et le contrôleur autonome forment un socle reproductible qui ne dépend ni du jeu ni du Cœur.

Les futurs replays, entrées classées, sorties intermédiaires et rendus de travail restent hors GitHub par défaut dans les zones locales protégées du laboratoire. Le prochain Gate concerne l'inspection d'un export Cœur clos et la conception d'un adaptateur privé à partir de son format réellement constaté.

Aucun moteur audio final et aucune intégration live au Cœur canonique ne sont actés.

### Visuel du Cœur / LAB VISUEL

Documentation partageable :

- `docs/24_visuel_coeur_contrat_public.md`

Le visuel est une couche de représentation en aval. Le LAB peut être développé avant l’achèvement du Cœur uniquement contre un sous-ensemble sémantique suffisamment stable, sous forme de contrat versionné alimentable par fixtures, replays et futurs états canoniques.

Le contrat public documente la séparation anti-réécriture, la continuité visuelle, la qualité adaptative, le rendu client par défaut, les cadences découplées, les gates de ressources et les références de recherche.

### Frontière de publication

GitHub est traité comme une surface de publication même lorsque le dépôt est privé. Les documents partageables décrivent uniquement les garanties, interfaces, méthodes, références et résultats autorisés. Ils ne cartographient pas l’organisation du savoir classé sous prétexte d’indiquer ce qui reste confidentiel.

### Tableau Réel

`docs/real/`

- `README.md`
- `SPECIFICATION.md`
- `EXECUTION_PLAN.md`

TA3 est une brique persistante autonome. Le Gate 0 exclut une migration TA3 dans la base du PROTO et impose un runtime/stockage propres.

### Documentation architecture/développement

`docs/development/`

Contient notamment :

- état courant au 12 août 2026 ;
- audit du 6 août ;
- architecture actuelle/cible ;
- arbitrage transversal de pérennité et ressources ;
- politique de données ;
- méthode de développement ;
- dette technique ;
- stratégie tests/sécurité/persistance ;
- ADR structurants.

### Conception et historique

- `docs/conception/`
- documents numérotés de conception sous `docs/`
- `logs/`
- `csv/`
- `data/`
- `design-data/`

Plusieurs générations de conception sont volontairement conservées. Leur présence n’en fait pas toutes des références runtime actuelles.

### Infrastructure

`infra/`

Infrastructure du prototype intégré. Toute infrastructure persistante propre à TA3 doit être introduite seulement après son audit Phase B et ne doit pas être confondue avec la base du PROTO.

## Source de vérité documentaire

Pour l’état courant :

1. `README.md`
2. `ROADMAP.md`
3. `docs/index.md`
4. `docs/development/PROJECT_STATUS_2026-08-12.md`
5. `docs/21_coeur_vivant_genese_canonique.md`, `docs/22_coeur_vivant_validation_2026-08-12.md` et `docs/25_coeur_vivant_references_methode.md`
6. `docs/23_univers_sonore_contrat_public.md`, `docs/26_univers_sonore_references_methode.md`, `docs/27_musique0_cahier_integration.md` et `lab/musique0/GATE0_READY.md`
7. `docs/24_visuel_coeur_contrat_public.md` pour le visuel du Cœur et le LAB VISUEL
8. `docs/real/` pour TA3
9. le dossier `docs/development/proto0.2/` de `develop/proto-0.2.2-playtest` pour le candidat jouable courant.

Les documents historiques restent disponibles pour la traçabilité mais ne reprennent pas autorité sur ces référentiels.
