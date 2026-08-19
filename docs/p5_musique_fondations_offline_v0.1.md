# P5B — MUSIQUE / UNIVERS SONORE — fondations offline v0.1

> Date : 19 août 2026  
> Statut : **architecture PASS · MUS-0 PASS/FROZEN · MUS-1 PASS/FROZEN · MUS-2 PASS/FROZEN · MUS-3 NEXT · P5B OFFLINE GLOBAL NON · LIVE BLOCKED**

## Mission

P5B construit le sous-système musical réutilisable par la Fenêtre puis par le futur jeu. Il interprète exclusivement une projection sémantique autorisée d’Avelune ; il ne lit pas directement le Cœur et ne devient jamais une seconde autorité canonique ou de continuité live.

Chaîne qualifiée à la fermeture de MUS-2 :

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
```

Aucun renderer audio ne fait encore partie de cette chaîne qualifiée.

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

Un saut de `state_revision` n’est donc pas un gap lorsque `publication_seq` reste contigu. `event_history_exhaustive=false` reste respecté : P5B n’invente aucun événement intermédiaire absent.

La projection événementielle et la déduplication `event_id` restent différées jusqu’à l’existence d’un contrat P1 qualifié correspondant.

## MusicPayload v0.1-exp

Le payload expérimental reste volontairement minimal avec cinq axes perceptifs ordinaux `0..4` :

- `presence` ;
- `activity` ;
- `variation` ;
- `continuity` ;
- `transformation`.

Ces axes ne sont ni des métriques biologiques, ni des paramètres musicaux, ni des commandes audio.

La qualification MUS-2 a exploré les **3 125 combinaisons** du profil monde :

- 5/5 axes ont un effet structurel mesurable ;
- 5/5 produisent des signatures structurelles distinctes ;
- le saut maximal du plan pour un voisin ordinal est de 1 ;
- 1 574 vecteurs de plan courant distincts sont obtenus.

Conclusion : `MusicPayload v0.1-exp` est **provisoirement suffisant** pour poursuivre. Aucune extension P1/P0 n’est demandée sans insuffisance perceptive concrète et reproductible.

## MUS-0 — fondation contractuelle — PASS / FROZEN

Qualification : **80/80 tests PASS**.

Baseline : `5835597c9dbdc1a4f20ed3778a6ff2fc2c518d10`  
Tag : `p5b-mus0-offline-pass-20260819`

MUS-0 qualifie notamment session/replay, séparation publication/révision/âge, isolation multi-Avelune, JSON strict, allowlist, contrôles de confidentialité, semantic replay `manifest.json + frames.ndjson + checksums.sha256`, lecture streaming et compatibilité fail-closed.

## MUS-1 — état perceptif et mémoire — PASS / FROZEN

Qualification : **148/148 tests PASS**.

Baseline : `7557f001b56cb252da6a0e2ec8fe0e559c9c3342`  
Tag : `p5b-mus1-offline-pass-20260819`

MUS-1 qualifie :

- `MusicPerceptionState` déterministe et débarrassé des métadonnées de transport ;
- mémoire monde bornée et reconstructible ;
- continuité bornée des régions/représentations opaques sans inférence biologique ;
- snapshot mémoire local déterministe et versionné ;
- restart/restore exact ;
- recovery depuis replay qualifié ;
- aucune fausse histoire lorsque les preuves sont insuffisantes ;
- maintien de P1 comme seule autorité de continuité live.

## MUS-2 — grammaire abstraite — PASS / FROZEN

Qualification finale : **294/294 tests PASS**.

Baseline fonctionnelle avant rapport : `7513eacf8f8bc8b10821c10507ff55ea8276fa0b`  
Commit de qualification : `314f4b4218e136f109deb8d0999a7b555ca4e141`  
Tag : `p5b-mus2-offline-pass-20260819`

### Evidence compositionnelle

`StructuralMusicInterpreter` ne parcourt jamais librement `MusicMemoryState`.

`CompositionEvidenceProjector` produit une projection allowlistée, inspectable et déterministe. N’y entrent pas : hashes de provenance, compteurs de publication, transport, statuts de recovery ni métadonnées épistémiques.

### Temporalité canonique

La mémoire temporelle conserve uniquement des **changements réellement observés** et les situe par `canonical_age`.

- répéter la publication du même état ne crée aucun mouvement temporel supplémentaire ;
- `recent` et `intermediate` utilisent des fenêtres canoniques disjointes ;
- `RESYNC` ouvre un nouveau segment et ne fabrique aucune transition à travers le trou ;
- le présent garde l’autorité principale ;
- l’influence récente/intermédiaire reste bornée ;
- l’histoire longue peut laisser une empreinte sans écraser le présent.

### Structure et motifs

`StructuralCompositionPlan` réunit un macro-plan abstrait et des motifs structurels abstraits.

Les identifiants opaques servent uniquement à l’adressage de continuité. Leur valeur ou leur hash ne produit aucune variante musicale. Les caches d’entités absentes ne génèrent aucun motif fantôme.

### Thèmes

`ThemeProfile` intervient après la structure.

Même structure + même thème donne le même plan stylisé. Deux thèmes distincts peuvent produire des traitements esthétiques distincts sans modifier la structure, les motifs ni l’histoire interprétée.

### Accessibilité

`AccessibilityProfile` intervient après le thème.

- contrôles indépendants et non diagnostiques ;
- profil neutre transparent ;
- contraintes d’accessibilité prioritaires sur la présentation esthétique ;
- aucune réécriture du thème choisi ou du `StructuralCompositionPlan`.

Les limites audio concrètes — fréquences, dynamique, transitoires, spatialisation effective — appartiennent à la qualification du futur renderer.

### Ce que MUS-2 ne contient pas

- aucun renderer ;
- aucun moteur audio ;
- aucun WAV/MIDI ;
- aucune note ou hauteur concrète ;
- aucun BPM ;
- aucun instrument/preset/sample ;
- aucune dépendance réseau ;
- aucune donnée privée du Cœur ou CODEX.

## MUS-3 — prochaine phase

MUS-3 introduira une frontière de rendu remplaçable :

```text
AccessibleMusicalPlan
        ↓
RendererPort
        ↓
renderer témoin
```

Objectifs :

- faux renderer de contrôle ;
- premier renderer audio témoin isolé et remplaçable ;
- qualification perceptive comparative ;
- vérification des thèmes et adaptations d’accessibilité sur sorties réellement audibles ;
- mesures locales CPU/RAM/latence/stockage ;
- aucune sélection prématurée du moteur audio final.

## Phases suivantes

- **MUS-4** : premier semantic replay réel clos produit par P1 depuis un artefact autorisé, traversant le même pipeline sans accès aux internes du Cœur ;
- **MUS-5** : paquet de préparation P6 / futur live, ports stables, reprise/resync, préférences, budgets cumulés et readiness replay → live.

## Dépendances et gaps

- P0/O1 : intouchable pendant sa campagne active ;
- `GAP-P1-DOC` : forme partageable de certains détails P1 à synchroniser, non bloquante pour les baselines offline ;
- P0 live + P1 live : bloquants pour le futur live ;
- premier replay réel MUSIQUE : encore ouvert, non bloquant pour MUS-3 ;
- P2/P3/P4/P6/P8 : non bloquants pour MUS-3 offline ;
- moteur audio final, races et gameplay TF/TD/RPG : non requis pour MUS-3.

## Critère anti-réécriture

La future livraison d’un semantic replay réel P1 doit traverser le même pipeline que les fixtures et produire les mêmes types de plans sans accès aux internes du Cœur et sans refonte conceptuelle des couches MUS-0→3.

Le corpus de références scientifiques et artistiques reste documenté dans `docs/26_univers_sonore_references_methode.md`. Les références informent les hypothèses et protocoles ; elles ne prescrivent pas directement les recettes d’Avelune.
