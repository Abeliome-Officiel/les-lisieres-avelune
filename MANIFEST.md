# Manifeste du dépôt

## État courant — 18 août 2026

Projet : **Les Lisières d’Avelune**  
Baseline d’intégration : `main`  
Candidat jouable : `develop/proto-0.2.2-playtest`  
Chantiers techniques structurants : **Cœur permanent / qualification opérationnelle**, **Tableau Réel (TA3)**, **Fenêtre / VISUEL** et **MUSIQUE-0**.

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

### Cœur vivant et contrat de lecture

Documentation partageable :

- `docs/21_coeur_vivant_genese_canonique.md`
- `docs/22_coeur_vivant_validation_2026-08-12.md`
- `docs/25_coeur_vivant_references_methode.md`
- `docs/29_coeur_vivant_gate_suffisance.md`
- `docs/31_temporalite_canonique_genese.md`
- `docs/32_coeur_contrat_lecture_modules.md`
- `docs/33_multi_monde_capacite_et_tableau_univers.md`

La recherche biologique ouverte de CŒUR-0 est considérée suffisamment close ; le chantier actif est l’ingénierie/qualification du Cœur permanent.

Le moteur de laboratoire détaillé reste dans son dépôt propriétaire séparé. Les documents GitHub n’en publient que les contrats, méthodes autorisées et résultats suffisamment agrégés nécessaires au pilotage.

`docs/32_coeur_contrat_lecture_modules.md` est l’autorité partageable de la frontière **Cœur → modules**.

Architecture :

```text
Cœur privé
   ↓
CœurReadAdapter commun / normalisation privée
   ↓
noyau WorldReadEnvelope
   ↓
projections allowlistées spécialisées
   ├─ VisualPayload
   └─ MusicPayload
```

Il n’existe ni adaptateurs VISUEL/MUSIQUE indépendants relisant chacun les internes, ni super-contrat public réunissant toutes les données de tous les clients.

### Contrats de lecture et replays

Baseline contractuelle partageable :

- `docs/contracts/world-read-envelope-v0.1.schema.json`
- `docs/contracts/avelune-semantic-replay-v0.1.md`

Le `WorldReadEnvelope` porte uniquement les primitives communes d’identité, source, session, canonicalité, révision, âge canonique, nature de frame et payload spécialisé.

Le replay de laboratoire v0.1 utilise :

```text
manifest.json
frames.ndjson
checksums.sha256
```

avec snapshots complets en première version. Les deltas sont différés.

Raw observer replay, dumps de persistance et diagnostics scientifiques ne deviennent pas les formats durables consommés par les renderers.

### Univers sonore / MUSIQUE-0

Documentation et terrain partageables :

- `docs/23_univers_sonore_contrat_public.md`
- `docs/26_univers_sonore_references_methode.md`
- `docs/27_musique0_cahier_integration.md`
- `lab/musique0/README.md`
- `lab/musique0/GATE0_READY.md`
- `lab/musique0/MUSIQUE0_1_BASELINE_20260818.md`
- `lab/musique0/.gitignore`
- `tools/musique0/check_public_fixtures.py`
- `tools/musique0/bootstrap_local_lab.sh`

Jalon historique conservé :

- `docs/contracts/representation-semantic-v0.schema.json`
- `docs/contracts/musique0-fixtures/`

Le **Gate 0 du 13 août reste VERT et historique**. Son enveloppe 0.2.0 et les fixtures neutres A/B/C ont prouvé le découplage initial ; elles ne sont pas supprimées mais ne constituent plus la baseline active de la frontière Cœur → modules.

La baseline active du 18 août place MUSIQUE derrière `WorldReadEnvelope + MusicPayload`. MUSIQUE ne lit pas directement le Cœur et ne possède pas `CœurReadAdapter`.

Le chantier exploratoire privé R2.10 a permis de constater qu’un résultat scientifique réduit n’est pas un replay sémantique temporel approprié. Le clone privé correspondant reste un artefact de recherche figé et n’est pas poursuivi comme adaptateur MUSIQUE.

MUSIQUE-0.1 peut maintenant avancer offline sur loader de semantic replay, état perceptif musical, mémoire reconstructible, `musical_plan` déterministe, thème esthétique sélectionnable par le joueur, accessibilité indépendante et renderer factice.

Le thème joueur reste entièrement aval : il réorchestre une histoire musicale et sa mémoire sans modifier le canon. Une gate vérifiera que des thèmes différents conservent la reconnaissance de la même histoire structurelle.

Aucun moteur audio final et aucune intégration live au Cœur canonique ne sont actés.

Pendant une qualification opérationnelle du Cœur déjà démarrée, MUSIQUE n’ajoute aucun observer, consommateur live, accès SQLite, service de publication ou benchmark concurrent.

### Visuel du Cœur / Fenêtre

Documentation partageable :

- `docs/24_visuel_coeur_contrat_public.md`

Le visuel est une projection en aval de la même normalisation Cœur, avec son propre `VisualPayload`. Il ne dépend pas de MUSIQUE et MUSIQUE ne dépend pas de lui.

La Fenêtre sur la Lisière est destinée à devenir le premier consommateur permanent privilégié du contrat de lecture une fois les gates Cœur correspondantes validées.

### Frontière de publication

GitHub est traité comme une surface de publication même lorsque le dépôt est privé. Les documents partageables décrivent uniquement les garanties, interfaces, méthodes, références et résultats autorisés. Ils ne cartographient pas l’organisation du savoir classé sous prétexte d’indiquer ce qui reste confidentiel.

Un artefact de replay possède une classification homogène. Une version SHAREABLE est générée explicitement par allowlist à partir d’une source appropriée ; elle n’est pas une version PRIVATE contenant des secrets simplement masqués.

### Tableau Réel

`docs/real/`

- `README.md`
- `SPECIFICATION.md`
- `EXECUTION_PLAN.md`

TA3 est une brique persistante autonome. Le Gate 0 exclut une migration TA3 dans la base du PROTO et impose un runtime/stockage propres.

### Documentation architecture/développement

`docs/development/`

Contient notamment : état courant, audits, architecture actuelle/cible, arbitrage transversal de pérennité et ressources, politique de données, méthode de développement, dette technique, stratégie tests/sécurité/persistance et ADR structurants.

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
5. documentation Cœur : `docs/21_*`, `docs/25_*`, `docs/29_*`, `docs/31_*`, `docs/32_*`, `docs/33_*`
6. contrat de lecture : `docs/32_coeur_contrat_lecture_modules.md`, `docs/contracts/world-read-envelope-v0.1.schema.json`, `docs/contracts/avelune-semantic-replay-v0.1.md`
7. MUSIQUE : `docs/23_univers_sonore_contrat_public.md`, `docs/26_univers_sonore_references_methode.md`, `docs/27_musique0_cahier_integration.md`, `lab/musique0/GATE0_READY.md`, `lab/musique0/MUSIQUE0_1_BASELINE_20260818.md`
8. VISUEL : `docs/24_visuel_coeur_contrat_public.md`
9. `docs/real/` pour TA3
10. `docs/development/proto0.2/` sur `develop/proto-0.2.2-playtest` pour le candidat jouable courant.

Les documents historiques restent disponibles pour la traçabilité mais ne reprennent pas autorité sur ces référentiels.
