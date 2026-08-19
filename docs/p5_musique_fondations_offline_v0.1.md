# P5B — MUSIQUE / UNIVERS SONORE — fondations offline v0.1

> Date : 19 août 2026  
> Statut : **architecture PASS · MUS-0 OFFLINE PASS/FROZEN · MUS-1 OFFLINE PASS/FROZEN · P5B OFFLINE GLOBAL NON · LIVE BLOCKED OUI**

## Mission

P5B construit le sous-système musical réutilisable par la Fenêtre puis par le futur jeu. Il interprète une projection sémantique autorisée d’Avelune sans lire directement le Cœur ni devenir une seconde autorité.

Chaîne cible :

```text
P1 / Lecteur du Cœur
        ↓
WorldReadEnvelope + MusicPayload
        ↓
état perceptif musical
        ↓
mémoire historique aval
        ↓
preuves compositionnelles allowlistées
        ↓
structure musicale
        ↓
thème choisi par l’observateur
        ↓
préférences sensorielles
        ↓
renderer audio remplaçable
```

## Reconstruction propre

P5B n’a aucune obligation de compatibilité avec l’ancien LAB MUSIQUE-0. Les anciens schémas, fixtures, noms de classes et formats intermédiaires restent des jalons historiques. Une brique n’est reprise que si elle s’intègre naturellement à la frontière P1 qualifiée et repasse les gates P5B.

Sont conservés comme invariants de conception :

- direction **satisfaisante · contemplative · onirique · féerique** ;
- Cœur strictement indépendant du sonore ;
- mémoire musicale de l’histoire ;
- adaptation aux goûts de l’observateur ;
- thème musical sélectionnable/modifiable localement ;
- accessibilité paramétrique indépendante du thème ;
- moteur audio remplaçable ;
- corpus scientifique et artistique sourcé ;
- séparation `[RÉFÉRENCE] / [HYPOTHÈSE AVELUNE] / [TESTÉ] / [ACTÉ]`.

## Frontière P1

P5B dépend uniquement du contrat de lecture P1. Les responsabilités P2 Observabilité, P3 Orchestrateur et P4 Tableaux ne constituent pas des sources perceptives pour la musique.

La forme P1 qualifiée distingue :

- `publication_seq` : continuité de publication dans une session ;
- `state_revision` : révision de l’état canonique représenté ;
- `canonical_age` : position dans le temps canonique.

Un saut de `state_revision` ne constitue donc pas à lui seul un trou de flux lorsque les snapshots publiés restent contigus. P5B ne suppose pas non plus que l’historique événementiel est exhaustif et n’invente jamais des événements absents.

Le schéma partageable commun doit être synchronisé par le propriétaire de P1. P5B ne crée pas de fork amont ; ce gap documentaire ne bloque pas les baselines offline P5B déjà qualifiées.

## MusicPayload expérimental qualifié

MUS-0 qualifie côté consommation un `MusicPayload v0.1-exp` fondé sur cinq axes perceptifs ordinaux `0..4` :

- `presence` ;
- `activity` ;
- `variation` ;
- `continuity` ;
- `transformation`.

Ces axes ne sont ni des métriques biologiques, ni des paramètres musicaux, ni des paramètres audio. Aucun mapping Cœur → MusicPayload n’est publié ou défini dans P5B.

Les scopes admis sont le monde, des régions opaques et des représentations opaques. Les identifiants ne codent aucune race, généalogie, recette ou information biologique privée.

## Qualification MUS-0 — PASS / FROZEN

La fondation contractuelle offline MUS-0 est fermée avec **80/80 tests PASS**. La qualification couvre notamment :

- séparation `publication_seq` / `state_revision` / `canonical_age` ;
- resynchronisation et redémarrage de stream ;
- doublons idempotents et doublons contradictoires ;
- isolation stricte par `world_instance_id` ;
- JSON strict et allowlist ;
- contrôles explicites de confidentialité ;
- semantic replay `manifest.json` + `frames.ndjson` + `checksums.sha256` ;
- contrôle SHA-256 ;
- lecture streaming ligne par ligne ;
- politique de compatibilité de versions injectée et fail-closed ;
- équivalence sémantique fixture/replay hors métadonnées de transport ;
- historique partiel respecté sans invention d’événements ;
- absence d’import du Cœur, P2, P3 ou P4 ;
- absence de dépendance runtime tierce ;
- absence de dépendance réseau et d’artefact audio.

Baseline locale : `5835597c9dbdc1a4f20ed3778a6ff2fc2c518d10`, tag `p5b-mus0-offline-pass-20260819`.

La projection événementielle et la déduplication `event_id` sont volontairement différées jusqu’à l’existence d’un contrat événementiel P1 qualifié. P5B n’invente pas ce contrat pour satisfaire une checklist locale.

## Qualification MUS-1 — PASS / FROZEN

MUS-1 ferme l’état perceptif et la mémoire aval avec **148/148 tests PASS** lors de la gate finale MUS-1D.

Baseline locale de qualification : `7557f001b56cb252da6a0e2ec8fe0e559c9c3342`, tag `p5b-mus1-offline-pass-20260819`.

MUS-1 qualifie les tranches suivantes :

- **MUS-1A** — `MusicPerceptionState` déterministe, sans métadonnées de transport ;
- **MUS-1B** — mémoire monde reconstructible, historiquement informative et structurellement bornée ;
- **MUS-1C** — continuité bornée des `region_id` / `representation_id`, avec rétention fixe et sans inférence biologique sur absence/réapparition ;
- **MUS-1P** — snapshot mémoire canonique côté P5B, restart/restore exact et recovery fail-closed ;
- **MUS-1D** — requalification finale des tests, dépendances, frontières d’autorité, persistance, recovery, isolation et garde-fous pré-MUS-2.

La mémoire reste :

- aval et non canonique ;
- strictement partitionnée par `world_instance_id` ;
- reconstructible depuis replay qualifié ;
- persistable localement sans devenir une sauvegarde du monde ;
- bornée par l’état courant et des capacités de rétention fixes, pas par l’historique brut complet.

Snapshot valide → restore exact. Snapshot invalide + replay qualifié → rebuild exact. Preuve insuffisante → aucune mémoire historique fabriquée.

P1 reste seul arbitre de continuité live. Les gardes de publication P5B restent des harnais offline ; P5B ne redécide pas en production les gaps, changements de stream/monde ou la nécessité de `RESYNC`.

## Frontière obligatoire avant la composition

MUS-2 ne permet pas au futur interpréteur musical de parcourir librement l’objet technique `MusicMemoryState`.

La frontière actée est :

```text
MusicMemoryState
        ↓
CompositionEvidenceProjector
        ↓
StructuralMemoryEvidence
        ↓
StructuralMusicInterpreter
        ↓
StructuralMusicalPlan
```

`StructuralMemoryEvidence` doit être une projection allowlistée des seules preuves interprétables autorisées pour la composition.

Sont explicitement **non compositionnels** :

- `history_digest` ;
- `semantic_fingerprint` ;
- statuts/diagnostics de recovery ;
- `source_kind`, `stream_id`, `publication_seq` ;
- `frame_kind`, `event_history_exhaustive`, `RESYNC` en tant que caractères musicaux ;
- compteurs d’observation pris à tort comme durée canonique.

Les compteurs `samples`, `observation_count` ou `linked_transitions` décrivent la quantité d’observation, pas une durée vécue. Toute politique de durée musicale future doit partir de `canonical_age` avec une sémantique temporelle explicite.

## Thème et adaptation à l’observateur

Le thème est une couche de présentation musicale située après la structure/mémoire et avant le renderer. Il peut modifier fortement l’orchestration, les familles timbrales, la couleur harmonique, le registre, l’espace, la densité et d’autres dimensions esthétiques sans modifier les faits ni l’histoire musicale structurelle.

Changer de thème ne remet pas la mémoire à zéro. Une même histoire doit pouvoir être rendue par au moins deux thèmes nettement différents tout en restant la même histoire d’Avelune.

Le goût et l’accessibilité restent séparés : un même thème doit pouvoir être utilisé avec des réglages sensoriels très différents.

## Phases

### MUS-0 — fondation contractuelle offline — **PASS / CLOSED / FROZEN**

Entrée P1, `MusicPayload` expérimental, loader/session, replay loader, replay clock, resynchronisation, isolation multi-Avelune, allowlist, fixtures, streaming, compatibilité et tests de frontière.

### MUS-1 — état perceptif et mémoire — **PASS / CLOSED / FROZEN**

`MusicPerceptionState`, mémoire monde bornée, continuité d’identités opaques, snapshot/restart/recovery et gate finale sont qualifiés. La déduplication `event_id` reste différée jusqu’à l’existence d’une projection événementielle P1 qualifiée.

### MUS-2 — grammaire abstraite — **NEXT**

Première tranche : `CompositionEvidenceProjector` → `StructuralMemoryEvidence`. Puis seulement `StructuralMusicInterpreter` → `StructuralMusicalPlan`, temporalité musicale, continuité, motifs, transformations et silence. Thèmes et accessibilité restent des couches aval séparées.

### MUS-3 — renderer témoin et qualification perceptive

Port de rendu, fake renderer, premier renderer audio témoin remplaçable, protocole d’écoute comparative et mesures locales.

### MUS-4 — premier semantic replay réel clos

Même pipeline sur une projection réelle produite offline par P1 depuis un artefact clos, sans accès aux internes du Cœur et sans refonte conceptuelle.

### MUS-5 — paquet de préparation P6 / futur live

Ports stables, reprise/resync, préférences, budget cumulé, intégration offline et readiness replay → live.

## Statut des dépendances

- P0/O1 : **intouchable** ; ne bloque pas MUS-2→3 offline.
- P1 : frontière amont ; gap documentaire `publication_seq` encore ouvert côté forme partageable, non bloquant pour les baselines offline qualifiées.
- P0 live + P1 live : bloquants pour le futur branchement live.
- premier replay réel MUSIQUE : encore ouvert, non bloquant pour MUS-2→3 offline.
- P2/P3/P4 : non bloquants pour P5B offline.
- P6 : intégrateur futur, non bloquant.
- P8 : persistance future des préférences, non bloquante pour les profils locaux.
- moteur audio final, races et TF/TD/RPG : non requis à ce stade.

## Critère anti-réécriture

La future livraison d’un semantic replay réel P1 doit traverser le même pipeline que les fixtures et produire le même type de plan musical sans accès aux internes du Cœur et sans refonte conceptuelle de la grammaire ou du renderer.

Le corpus de références scientifiques et artistiques existant est conservé et reste référencé dans `docs/26_univers_sonore_references_methode.md`.
