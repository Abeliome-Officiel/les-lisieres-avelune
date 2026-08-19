# P5A VISUEL — plan de qualification offline

> Date : 19 août 2026  
> Statut : **VISUEL-0 OFFLINE PASS / CONTRACT FREEZE NO / LIVE NOT QUALIFIED**.

## 1. Verdict

**VISUEL-0 OFFLINE = PASS.**

Baseline locale qualifiée AvLab :

- dépôt : `/srv/lab/Projets/Avelune-Officiel/p5a-visuel` ;
- branche : `feat/visuel0-lot1-input-session` ;
- commit : `ca9bed16f9fdb1aaeab2acd13563958c2d5ff8f8` ;
- worktree : clean après checkpoint ;
- tests : **84/84 PASS** ;
- fixtures : **F01–F16 QUALIFIED** ;
- tests/gates : **T01–T24 QUALIFIED** ;
- remote/push du dépôt AvLab : aucun.

Ce PASS qualifie le socle offline. Il ne qualifie ni le live, ni un contrat P1↔P5A définitivement figé, ni un renderer final.

## 2. Objectif fermé par VISUEL-0

Prouver qu’une observation visuelle autorisée peut traverser P5A jusqu’à un plan de rendu abstrait cohérent, accessible, reproductible et remplaçable sans que le visuel devienne une seconde simulation biologique.

Chaîne qualifiée :

```text
P1 / WorldReadEnvelope + VisualPayload
  ↓
NormalizedVisualObservation
  ↓
bridge P5A
  ↓
SemanticVisualState
  ↓
PerceptualState
  ↓
PresentationState
  ↓
RenderPlan
  ↓
renderer remplaçable
```

P5A est strictement visuel. P6 reste propriétaire de l’assemblage de la Fenêtre.

## 3. Frontière P1 / P5A

P1 reste seul propriétaire de :

- l’ordre de publication ;
- `publication_seq` ;
- la continuité de session/stream ;
- la détection des gaps de publication ;
- la décision de resynchronisation ;
- la qualification de l’observation remise à P5A.

P5A **ne recrée pas ContinuityGuard**.

`state_revision` identifie la révision canonique représentée et peut sauter entre snapshots complets. Un saut de `state_revision` ne constitue pas à lui seul un trou de publication. `canonical_age` est un troisième axe distinct.

`event_history_exhaustive=false` interdit à P5A d’inventer les événements absents entre deux observations.

## 4. VisualPayload v0.x — expérimental

La forme expérimentale suffisante pour ouvrir VISUEL-1 expose actuellement, par entité :

```text
representation_id
descriptor.cohesion
descriptor.extension
descriptor.curvature
descriptor.luminosity
```

Les quatre axes sont normalisés dans `[0,1]`.

Ils sont des **descripteurs perceptifs de projection**, pas des mesures biologiques publiques et pas une copie des internes du Cœur.

Le runtime P5A n’invente jamais un descripteur absent : payload incomplet → **fail closed**.

Cette forme reste explicitement **expérimentale**. VISUEL-1 doit d’abord démontrer un manque artistique avant toute demande d’évolution de frontière.

Règle :

```text
besoin artistique démontré
  ↓
information absente du payload
  ↓
revue de frontière
  ↓
éventuelle évolution minimale et versionnée
```

Jamais : « on veut une nouvelle forme → exposons davantage de biologie ».

## 5. Continuité perceptive locale

`representation_epoch` est une donnée locale P5A :

- non canonique ;
- non biologique ;
- non transportée comme vérité P1 ;
- utilisée uniquement pour la continuité de représentation.

Le cache et la continuité sont namespacés au minimum par :

```text
world_instance_id + representation_id
```

Deux Avelune peuvent utiliser le même `representation_id` sans partager cache ou mémoire.

Une transformation majeure synthétique F08 démontre le comportement interne de continuité, mais ne fige pas le futur contrat de mue. Une différence numérique de descripteurs ne vaut jamais preuve de transformation majeure.

## 6. Animation et hash local

L’animation entre observations est strictement présentationnelle : bornée, réversible, déterministe et non cumulative sur la vérité.

Le déphasage local utilise aujourd’hui un hash déterministe de :

```text
world_instance_id + representation_id
```

Ce hash n’est **ni une seed canonique, ni une identité, ni une seed générale du vivant visible**.

Il peut seulement influencer des degrés de liberté purement présentationnels, par exemple une phase respiratoire ou un déphasage décoratif local.

Il ne doit jamais décider :

- morphologie fondamentale ;
- caractère biologique apparent ;
- transformation ;
- importance d’un être ;
- couleur porteuse d’une signification ;
- événement ;
- identité.

Cette frontière devient un invariant à transmettre à VISUEL-1.

## 7. Présentation, qualité et accessibilité

Les préférences visuelles/sensorielles sont distinctes de la qualité matérielle.

Préférences actuellement qualifiées :

- mouvement ;
- particules ;
- saturation ;
- contraste ;
- glow.

Qualité matérielle : `SOBER / NORMAL / RICH`.

Les tests garantissent que :

- S/N/R conserve exactement les mêmes faits, identités et ordre sémantique ;
- mouvement nul ne supprime pas l’information ;
- particules nulles ne suppriment pas l’information ;
- saturation nulle conserve structure et contour ;
- aucune information nécessaire ne dépend uniquement de la couleur, du mouvement ou des particules.

## 8. Fixtures F01–F16

F01 snapshot stable monde A.  
F02 `publication_seq` contigu avec saut de `state_revision` sur snapshots complets.  
F03 publication dupliquée — compatibilité P1, sans ContinuityGuard runtime P5A.  
F04 trou de `publication_seq` — harnais de compatibilité P1 uniquement ; la décision de resync reste P1.  
F05 changement de `stream_id` — compatibilité P1 uniquement.  
F06 collision volontaire de `representation_id` entre mondes A/B.  
F07 variation progressive même identité.  
F08 transformation majeure synthétique explicitement signalée.  
F09 disparition/retour selon identité explicitement fournie.  
F10 version incompatible.  
F11 champ non allowlisté / leurre sensible.  
F12 replay valide, frame_count mensonger et checksum corrompu.  
F13 cadence sémantique lente : animation présentationnelle uniquement.  
F14 préférences visuelles extrêmes avec information critique conservée.  
F15 `SOBER/NORMAL/RICH` avec mêmes faits/identités.  
F16 matrice synthétique 1/16/64/128 éléments.

## 9. Tests T01–T24

T01 validation stricte enveloppe + `VisualPayload`.  
T02 séparation `publication_seq/state_revision/canonical_age`.  
T03 duplicate idempotent dans le harnais P1 de compatibilité.  
T04 publication gap qualifié par le harnais P1 ; aucune autorité runtime P5A.  
T05 restart/stream dans le harnais P1 de compatibilité.  
T06 cache `world_instance_id + representation_id`.  
T07 aucune contamination A/B.  
T08 replay manifest/NDJSON/checksums.  
T09 fixture/replay équivalents.  
T10 `source_kind` sans effet artistique.  
T11 version incompatible → fail closed.  
T12 allowlist/leak scan.  
T13 continuité d’identité.  
T14 aucune inférence d’événement absent.  
T15 qualité matérielle ≠ préférences visuelles.  
T16 mouvement/couleur réduits conservent l’information critique.  
T17 déterminisme de préparation.  
T18 renderers substituables sur le même port.  
T19 fixture→replay sans réécriture substantielle.  
T20 benchmark offline de non-régression.  
T21 republication sémantiquement identique → aucun reroll arbitraire.  
T22 historique événementiel non exhaustif → état courant rendu sans passé inventé.  
T23 même entrée/configuration/préférences/phase → même résultat.  
T24 preuve E2E réelle `WorldReadEnvelope → RenderPlan`, conservation explicite des descripteurs, équivalence fixture/replay bout-en-bout et `representation_epoch` local.

## 10. Audit final

Résultat final :

```text
VISUEL-0 FINAL AUDIT=PASS
TESTS=84/84
F01-F16=QUALIFIED
T01-T24=QUALIFIED
INPUT_TO_SEMANTIC_RUNTIME_BRIDGE=YES
E2E_ENVELOPE_TO_RENDERPLAN_PROOF=YES
P1_CONTINUITY_RUNTIME_DUPLICATION=NO
STATE_REVISION_GAP_RESYNC_RULE=NO
ARTISTIC_TRANSPORT_METADATA_DEPENDENCY=NO
RUNTIME_PRIVATE_LEAK=NO
CONCRETE_RENDERER_TECH_DEPENDENCY=NO
P5A_AUDIO_DEPENDENCY=NO
UNCONTROLLED_ARTISTIC_RNG=NO
LIVE_INFRA_RUNTIME_DEPENDENCY=NO
RUNTIME_THIRD_PARTY_DEPENDENCY=NO
MISSING_DESCRIPTOR_FAIL_CLOSED=YES
```

F16 à 128 entités, dernière mesure de qualification headless :

- semantic médiane ≈ 0,279 ms ;
- perceptual médiane ≈ 0,248 ms ;
- presentation médiane ≈ 0,390 ms ;
- RenderPlan médiane ≈ 0,523 ms ;
- SemanticVisualState 19 395 B ;
- PerceptualState 44 741 B ;
- PresentationState 115 093 B ;
- RenderPlan 158 142 B ;
- 896 commandes ;
- heap proxy ≈ 1,14 MB ;
- déterministe = true.

Ces chiffres sont une baseline headless offline, pas un budget GPU/production.

## 11. Gaps restant ouverts

- **GAP-P1-DOC** : la sémantique qualifiée P1 distingue `publication_seq`, `state_revision` et `canonical_age`, mais les documents/schémas partageables principaux P1 ne sont pas encore tous synchronisés. **Non bloquant pour le PASS offline ; bloquant pour CONTRACT FREEZE.**
- **GAP-P0-LIVE** : primitives atomiques autoritatives requises pour P1 live.
- **GAP-P1-LIVE** : qualification live après P0.
- **GAP-REAL-REPLAY** : replay sémantique riche du vivant requis avant VISUEL-2 réel, pas pour VISUEL-1 offline.

Statut officiel :

```text
VISUEL-0 OFFLINE = PASS
CONTRACT FREEZE   = NO
VISUEL LIVE       = NOT QUALIFIED
```

## 12. Règle de gel VISUEL-0

VISUEL-0 est fermé fonctionnellement.

Ne pas le rouvrir pour ajouter une fonctionnalité opportuniste. Le rouvrir uniquement pour :

- défaut démontré ;
- régression ;
- incompatibilité réelle révélée par une phase ultérieure ;
- évolution contractuelle minimale décidée par revue de frontière.

Les anciennes branches VISUEL/Canvas restent historiques et comparatives.

## 13. Suite

VISUEL-1 devient un nouveau chantier : **grammaire du vivant / impression de vie à coût minimal**.

Question de phase :

> Comment une identité, une continuité et quelques propriétés perceptives peuvent-elles produire quelque chose qui semble réellement vivant ?

VISUEL-1 doit partir de la baseline qualifiée `ca9bed16f9fdb1aaeab2acd13563958c2d5ff8f8`, sans dépendre d’un renderer concret et sans enrichir le `VisualPayload` « au cas où ».
