# P5B MUSIQUE — terrain offline

Ce répertoire décrit uniquement le **terrain partageable** du chantier P5B. Il ne contient ni recettes musicales propriétaires, ni replay privé, ni données brutes du Cœur.

L’ancien `lab/musique0/` reste historique. La fondation P5B actuelle a été reconstruite proprement contre la frontière P1 qualifiée.

## Statut

- architecture : **PASS** ;
- MUS-0 fondation contractuelle : **PASS / FROZEN** ;
- MUS-1 état perceptif + mémoire : **PASS / FROZEN** ;
- MUS-2 grammaire abstraite + temporalité + motifs + thème + accessibilité : **PASS / FROZEN** ;
- MUS-2R restart temporel : **PASS** ;
- MUS-3 renderer témoin + qualification audible offline : **PASS** ;
- P5B offline global : **PASS** ;
- live : **BLOCKED** ;
- accès O1 : **NO** ;
- moteur audio final : **NON SÉLECTIONNÉ**.

Gate P0 de fermeture : **376/376 tests PASS**, `compileall` PASS, `diff --check` PASS, frontières d’autorité PASS, restart temporel PASS, renderer boundary PASS et witness de performance PASS.

Baseline locale de fermeture :

`15705f298a16e4795b782cb3b6a158d37fe03795`

Tag correctif temporel :

`p5b-mus2r-temporal-restart-pass-20260819`

## Entrée autorisée

```text
P1 / WorldReadEnvelope + MusicPayload
        ↓
observation P1 qualifiée
        ↓
P5B
        ↓
AccessibleMusicalPlan
        ↓
RendererPort
        ↓
renderer audio remplaçable
```

P5B ne lit jamais directement le Cœur, sa base, P2, P3 ou P4.

P1 reste seul propriétaire de la qualification live des gaps, changements de stream/monde et resynchronisations. Les mécanismes de session locaux P5B ne servent que de harnais offline.

## MusicPayload v0.1-exp

Les cinq axes expérimentaux restent `presence`, `activity`, `variation`, `continuity`, `transformation`, ordinaux `0..4`.

Ils ne sont ni biologiques, ni des paramètres audio. Le structural probe MUS-2 a parcouru les **3 125 profils monde possibles** et obtenu 5/5 axes structurellement effectifs, 5/5 signatures distinctes, un saut local maximal de 1 et 1 574 vecteurs de plan courant distincts.

Aucune extension du payload n’est demandée à ce stade.

## Chaîne qualifiée

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
        ↓
RendererPort
```

## Garde-fous

- `history_digest` et `semantic_fingerprint` ne deviennent jamais des seeds ou des entrées compositionnelles ;
- cadence/nombre de publications ≠ durée musicale ;
- temporalité fondée sur `canonical_age` ;
- `RESYNC` ne crée aucune transition fictive ;
- `region_id` / `representation_id` servent à la continuité, jamais à créer une variante musicale depuis leur valeur ;
- thème et accessibilité sont des couches séparées ;
- le renderer consomme uniquement le plan aval accessible ;
- durée de présentation audio et temps canonique restent séparés ;
- aucune structure privée, seed, RNG, paramètre biologique ou CODEX ne traverse la frontière partageable.

## MUS-3 — résultat

Le renderer témoin offline est qualifié comme **preuve de frontière et de perceptibilité**, pas comme moteur audio final.

Sont qualifiés :

- `RendererPort` et `FakeRenderer` ;
- premier renderer audio témoin remplaçable ;
- corpus audible apparié ;
- différences techniques mesurables sur structure, histoire, temporalité, thème et accessibilité ;
- mesures CPU/wall, RAM et stockage locales ;
- aucun clipping sur le corpus de qualification ;
- aucun ID, hash ou âge canonique utilisé comme matériau sonore.

Le protocole d’écoute est disponible pour des arbitrages artistiques ultérieurs. Une revue humaine aveugle approfondie n’est pas requise pour le PASS offline P0.

## Baselines gelées

- MUS-0 : `5835597c9dbdc1a4f20ed3778a6ff2fc2c518d10` — `p5b-mus0-offline-pass-20260819` ;
- MUS-1 : `7557f001b56cb252da6a0e2ec8fe0e559c9c3342` — `p5b-mus1-offline-pass-20260819` ;
- MUS-2 : `314f4b4218e136f109deb8d0999a7b555ca4e141` — `p5b-mus2-offline-pass-20260819` ;
- MUS-2R / fermeture technique courante : `15705f298a16e4795b782cb3b6a158d37fe03795` — `p5b-mus2r-temporal-restart-pass-20260819`.

Ne pas rouvrir ces baselines hors défaut démontré.

## Ce qui reste ouvert

- live P5B, après primitives P0 puis CREAD-LIVE ;
- premier semantic replay réel P1 ;
- moteur audio final ;
- budget cumulé Visuel + Musique + Fenêtre ;
- persistance utilisateur des thèmes/préférences ;
- sons du jeu et signaux fonctionnels dépendant des futurs contrats gameplay.

Ces éléments ne remettent pas en cause **P5B OFFLINE GLOBAL = PASS**.

## Séparation public / privé

Partageable ici : architecture aval, interfaces, invariants, gates, résultats agrégés, méthodologie et références.

Privé/Coffre : recettes exactes de pondération et traduction, règles propriétaires de motifs/temporalité, causalités, replays sensibles, paramètres révélateurs et toute information permettant d’inférer le Cœur.

Référentiels principaux :

- `docs/p5_musique_fondations_offline_v0.1.md` ;
- `docs/26_univers_sonore_references_methode.md`.
