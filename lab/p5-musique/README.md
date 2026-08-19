# P5B MUSIQUE — terrain offline

Ce répertoire décrit uniquement le **terrain partageable** du chantier P5B. Il ne contient ni recettes musicales propriétaires, ni replay privé, ni données brutes du Cœur.

L’ancien `lab/musique0/` reste historique. La fondation P5B actuelle a été reconstruite proprement contre la frontière P1 qualifiée.

## Statut

- architecture : **PASS** ;
- MUS-0 fondation contractuelle : **PASS / FROZEN** ;
- MUS-1 état perceptif + mémoire : **PASS / FROZEN** ;
- MUS-2 grammaire abstraite + temporalité + motifs + thème + accessibilité : **PASS / FROZEN** ;
- MUS-3 renderer témoin + qualification perceptive : **NEXT** ;
- P5B offline global : **NON** tant que MUS-3 n’est pas qualifié ;
- live : **BLOCKED** ;
- accès O1 : **NO** ;
- renderer/audio : **NONE** dans la baseline MUS-2.

Qualification MUS-2 : **294/294 tests PASS**.

Baseline locale de qualification :

`314f4b4218e136f109deb8d0999a7b555ca4e141`

Tag :

`p5b-mus2-offline-pass-20260819`

## Entrée autorisée

```text
P1 / WorldReadEnvelope + MusicPayload
        ↓
P1 ReadSession / ContinuityGuard
        ↓
observation P1 qualifiée
        ↓
P5B
```

P5B ne lit jamais directement le Cœur, sa base, P2, P3 ou P4.

P1 reste seul propriétaire de la qualification live des gaps, changements de stream/monde et resynchronisations. Les mécanismes de session locaux P5B ne servent que de harnais offline.

## MusicPayload v0.1-exp

Les cinq axes expérimentaux restent :

- `presence` ;
- `activity` ;
- `variation` ;
- `continuity` ;
- `transformation`.

Ils sont ordinaux `0..4` et ne sont ni biologiques, ni des paramètres audio.

Le structural probe MUS-2 a parcouru les **3 125 profils monde possibles** et obtenu :

- 5/5 axes structurellement effectifs ;
- 5/5 signatures distinctes ;
- saut local maximal = 1 ;
- 1 574 vecteurs de plan courant distincts.

Aucune extension du payload n’est donc demandée à ce stade. Cette suffisance reste provisoire jusqu’aux essais perceptifs.

## Chaîne qualifiée MUS-0→2

```text
MusicSemanticObservation
        ↓
MusicPerceptionState
        ↓
MusicMemoryState
        ↓
CompositionEvidenceProjector
        ↓
StructuralMemoryEvidence
        +
TemporalStructuralEvidence
        ↓
StructuralCompositionPlan
        ├── StructuralMusicalPlan
        └── StructuralMotifPlan
        ↓
ThemeProfile
        ↓
StyledMusicalPlan
        ↓
AccessibilityProfile
        ↓
AccessibleMusicalPlan
```

## Garde-fous

- `history_digest` et `semantic_fingerprint` ne deviennent jamais des seeds ou des entrées compositionnelles ;
- cadence/nombre de publications ≠ durée musicale ;
- temporalité fondée sur `canonical_age` ;
- `RESYNC` ne crée aucune transition fictive ;
- le présent garde la priorité sur l’histoire longue ;
- `region_id` / `representation_id` servent à la continuité, jamais à créer une variante musicale depuis leur valeur ;
- aucun motif fantôme n’est produit depuis les caches d’entités absentes ;
- thème et accessibilité sont des couches séparées ;
- l’accessibilité utilise des contrôles indépendants, pas un profil diagnostique unique ;
- aucune structure privée, seed, RNG, paramètre biologique ou CODEX ne traverse la frontière partageable.

## MUS-2 — résultat

MUS-2 qualifie une composition **abstraite** uniquement :

- evidence compositionnelle allowlistée ;
- mémoire temporelle de changements réellement observés ;
- fenêtres recent/intermediate en temps canonique ;
- macro-plan structurel ;
- motifs abstraits ;
- thème esthétique post-structure ;
- accessibilité post-thème ;
- déterminisme du pipeline.

Il ne contient encore aucune note concrète, aucun BPM, instrument, preset, MIDI, sample ou moteur audio.

## Prochaine étape : MUS-3

MUS-3 doit introduire une frontière de rendu remplaçable :

```text
AccessibleMusicalPlan
        ↓
RendererPort
        ↓
renderer témoin
```

Objectifs immédiats : fake renderer de contrôle, premier renderer audio témoin isolé, protocole d’écoute comparative et mesures locales de coût. Le choix du moteur audio final reste ouvert.

## Baselines gelées

- MUS-0 : `5835597c9dbdc1a4f20ed3778a6ff2fc2c518d10` — `p5b-mus0-offline-pass-20260819` ;
- MUS-1 : `7557f001b56cb252da6a0e2ec8fe0e559c9c3342` — `p5b-mus1-offline-pass-20260819` ;
- MUS-2 : `314f4b4218e136f109deb8d0999a7b555ca4e141` — `p5b-mus2-offline-pass-20260819`.

Ne pas rouvrir ces baselines hors défaut démontré.

## Séparation public / privé

Partageable ici : architecture aval, interfaces, invariants, gates, résultats agrégés, méthodologie et références.

Privé/Coffre : recettes exactes de pondération et traduction, règles propriétaires de motifs/temporalité, causalités, replays sensibles, paramètres révélateurs et toute information permettant d’inférer le Cœur.

Référentiels principaux :

- `docs/p5_musique_fondations_offline_v0.1.md` ;
- `docs/26_univers_sonore_references_methode.md`.
