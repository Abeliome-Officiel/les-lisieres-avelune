# P5B — MUSIQUE / UNIVERS SONORE — fondations offline v0.1

> Date : 19 août 2026  
> Statut : **P5B OFFLINE GLOBAL PASS · MUS-0 PASS/FROZEN · MUS-1 PASS/FROZEN · MUS-2 PASS/FROZEN · MUS-2R PASS · MUS-3 PASS · LIVE BLOCKED**

## Mission

P5B construit le sous-système musical réutilisable par la Fenêtre puis par le futur jeu. Il interprète exclusivement une projection sémantique autorisée d’Avelune ; il ne lit pas directement le Cœur et ne devient jamais une seconde autorité canonique ou de continuité live.

Chaîne qualifiée :

```text
P1 / Lecteur du Cœur
        ↓
WorldReadEnvelope + MusicPayload
        ↓
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
        ↓
renderer témoin remplaçable
```

## Résultat de fermeture P0 / P5B offline

Gate finale exécutée sur la baseline locale :

`15705f298a16e4795b782cb3b6a158d37fe03795`

Résultat : **376/376 tests PASS**, `compileall` PASS, `diff --check` PASS, frontières d’autorité PASS, restart temporel PASS, renderer boundary PASS, corpus audible comparatif PASS, witness de performance PASS et aucun artefact audio/private/secret suivi par Git.

Le statut **P5B OFFLINE GLOBAL = PASS** couvre le périmètre offline demandé avant intégration P6. Il ne signifie pas que le live, le moteur audio final ou le budget cumulé Fenêtre sont qualifiés.

## Principes invariants

- direction artistique : **satisfaisante · contemplative · onirique · féerique** ;
- le Cœur reste exclusivement l’autorité du vivant et de l’état canonique ;
- P1 reste seul propriétaire de la qualification live des publications, gaps, changements de stream/monde et resynchronisations ;
- la mémoire musicale est aval, non canonique, reconstructible et strictement isolée par `world_instance_id` ;
- `world_instance_id`, `region_id` et `representation_id` sont des identités/adresses opaques, jamais des seeds ou des données créatives ;
- `history_digest` et `semantic_fingerprint` servent à l’intégrité/provenance, jamais à la composition ;
- les compteurs de publications/observations ne deviennent jamais une durée musicale ;
- les métadonnées de provenance, recovery ou incomplétude contrôlent la connaissance, pas le caractère musical du monde ;
- thème esthétique et accessibilité restent deux couches distinctes ;
- aucun « mode neuroA » unique n’est créé ; les contrôles d’accessibilité sont indépendants ;
- renderer et technologie audio restent remplaçables.

## Frontière P1

P5B dépend uniquement du contrat de lecture P1. P2 Observabilité, P3 Orchestrateur et P4 Tableaux ne sont pas des sources perceptives pour la musique.

La consommation P1 distingue explicitement :

- `publication_seq` : continuité de publication dans une session ;
- `state_revision` : révision canonique représentée ;
- `canonical_age` : coordonnée temporelle canonique.

Un saut de `state_revision` n’est pas un gap lorsque `publication_seq` reste contigu. `event_history_exhaustive=false` reste respecté : P5B n’invente aucun événement intermédiaire absent.

La projection événementielle et la déduplication `event_id` restent différées jusqu’à l’existence d’un contrat P1 qualifié correspondant.

## MusicPayload v0.1-exp

Le payload expérimental reste volontairement minimal avec cinq axes perceptifs ordinaux `0..4` : `presence`, `activity`, `variation`, `continuity`, `transformation`.

Ces axes ne sont ni des métriques biologiques, ni des paramètres musicaux, ni des commandes audio.

La qualification MUS-2 a exploré les **3 125 combinaisons** du profil monde : 5/5 axes ont un effet structurel mesurable, 5/5 produisent des signatures structurelles distinctes, le saut local maximal du plan pour un voisin ordinal est de 1 et 1 574 vecteurs de plan courant distincts sont obtenus.

Conclusion : `MusicPayload v0.1-exp` est **provisoirement suffisant**. Aucune extension P1/P0 n’est demandée sans insuffisance perceptive concrète et reproductible.

## Baselines qualifiées

### MUS-0 — fondation contractuelle — PASS / FROZEN

- qualification : **80/80 tests PASS** ;
- baseline : `5835597c9dbdc1a4f20ed3778a6ff2fc2c518d10` ;
- tag : `p5b-mus0-offline-pass-20260819`.

### MUS-1 — état perceptif et mémoire — PASS / FROZEN

- qualification : **148/148 tests PASS** ;
- baseline : `7557f001b56cb252da6a0e2ec8fe0e559c9c3342` ;
- tag : `p5b-mus1-offline-pass-20260819`.

MUS-1 qualifie `MusicPerceptionState`, mémoire monde bornée et reconstructible, continuité bornée des régions/représentations opaques, snapshot mémoire local déterministe, restart/restore exact et recovery sans invention du passé.

### MUS-2 — grammaire abstraite — PASS / FROZEN

- qualification : **294/294 tests PASS** ;
- baseline : `314f4b4218e136f109deb8d0999a7b555ca4e141` ;
- tag : `p5b-mus2-offline-pass-20260819`.

MUS-2 qualifie evidence compositionnelle allowlistée, temporalité fondée sur `canonical_age`, macro-plan, motifs abstraits, thème post-structure et accessibilité post-thème.

### MUS-2R — restart de la mémoire temporelle — PASS

- baseline corrective : `15705f298a16e4795b782cb3b6a158d37fe03795` ;
- tag : `p5b-mus2r-temporal-restart-pass-20260819`.

Le round-trip de la mémoire temporelle est exact. Après restart, evidence temporelle, plan structurel, plan stylisé/accessible et WAV témoin restent équivalents. Corruption et mauvais monde échouent explicitement ; `RESYNC` ouvre un nouveau segment sans être confondu avec une troncature de capacité.

### MUS-3 — renderer témoin et qualification offline — PASS

MUS-3 qualifie :

- `RendererPort` consommant uniquement `AccessibleMusicalPlan` ;
- `FakeRenderer` de contrôle ;
- premier renderer audio témoin remplaçable ;
- durée de présentation humaine explicite et indépendante de `canonical_age` ;
- corpus audible apparié ;
- différences mesurables de structure, histoire, temporalité, thème et accessibilité ;
- mesures locales de temps CPU/wall, RAM et taille audio ;
- absence d’utilisation des IDs, hashes ou temps canonique comme matériau sonore ;
- aucune sélection définitive du moteur audio.

Le protocole d’écoute est disponible. Une revue humaine aveugle plus poussée peut être utilisée ultérieurement pour l’arbitrage artistique, mais **n’est pas une précondition de la gate P0 offline**.

## Ce que le PASS ne ferme pas

Restent volontairement ouverts :

- **LIVE** : bloqué jusqu’aux primitives P0 puis à CREAD-LIVE ;
- **premier semantic replay réel P1** : différé, non bloquant pour la fermeture MUS-0→3 ;
- **moteur audio final** : non sélectionné ;
- **budget cumulé P5A + P5B + P6** : gate d’intégration ultérieure ;
- **sons du jeu et signaux d’information** : distincts de la musique du monde et dépendants de contrats gameplay futurs ;
- **persistance utilisateur des thèmes/préférences** : responsabilité P8 ultérieure.

## Préparation P6

P6 peut maintenant considérer P5B comme **baseline offline intégrable**. L’intégration doit préserver la frontière :

```text
P1 → P5B → renderer audio remplaçable → P6
```

P6 ne doit pas contourner P5B pour relire le Cœur ou transformer directement `canonical_age`, les identifiants ou les hashes en paramètres audio.

## Critère anti-réécriture

La future livraison d’un semantic replay réel P1 doit traverser le même pipeline que les fixtures et produire les mêmes types de plans sans accès aux internes du Cœur et sans refonte conceptuelle des couches qualifiées.

Le corpus de références scientifiques et artistiques reste documenté dans `docs/26_univers_sonore_references_methode.md`. Les références informent les hypothèses et protocoles ; elles ne prescrivent pas directement les recettes d’Avelune.
