# P5A VISUEL — passation de clôture VISUEL-0

> Date : 19 août 2026  
> Verdict : **VISUEL-0 OFFLINE = PASS**  
> `CONTRACT FREEZE = NO`  
> `VISUEL LIVE = NOT QUALIFIED`

## Baseline qualifiée

Dépôt AvLab local : `/srv/lab/Projets/Avelune-Officiel/p5a-visuel`  
Branche : `feat/visuel0-lot1-input-session`  
Commit de clôture : `ca9bed16f9fdb1aaeab2acd13563958c2d5ff8f8`  
Worktree après checkpoint : clean  
Remote/push : aucun.

Validation :

- 84/84 tests PASS ;
- F01–F16 qualifiées ;
- T01–T24 qualifiés ;
- bridge réel input → SemanticVisualState → RenderPlan ;
- équivalence fixture/replay bout-en-bout ;
- fail-closed si descriptor absent ;
- isolation multi-Avelune ;
- déterminisme ;
- renderer-neutral ;
- aucune dépendance runtime tierce ;
- aucune dépendance live ;
- aucune fuite privée ;
- aucune dépendance audio.

## Architecture à préserver

```text
P1 qualifie publication/session
  ↓
WorldReadEnvelope + VisualPayload
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
renderer substituable
```

P5A ne recrée jamais ContinuityGuard. `publication_seq`, gaps, stream et resync restent propriété P1.

`representation_epoch` est local, non canonique et non biologique.

L’animation entre observations est bornée, réversible, déterministe et incapable de créer un fait canonique.

Les niveaux `SOBER/NORMAL/RICH` et les préférences sensorielles transforment uniquement la présentation. L’information nécessaire doit survivre à mouvement nul, particules nulles et saturation nulle.

## VisualPayload expérimental

Forme actuelle suffisante pour ouvrir VISUEL-1 :

```text
representation_id
descriptor.cohesion
descriptor.extension
descriptor.curvature
descriptor.luminosity
```

Les axes restent expérimentaux. Ils ne sont pas figés en contrat de production.

Évolution autorisée uniquement après besoin artistique démontré et revue de frontière. Aucune extension spéculative « au cas où ».

## Hash de micro-mouvement

Le hash local de `world_instance_id + representation_id` sert uniquement à produire une variation présentationnelle déterministe.

Il ne doit jamais décider : morphologie fondamentale, caractère biologique apparent, transformation, importance, couleur significative, événement ou identité.

Il est acceptable comme phase/déphasage décoratif local ; il est interdit comme pseudo-seed générale du vivant visible.

## F16

Dernière baseline headless à 128 entités :

- semantic ≈ 0,279 ms médiane ;
- perceptual ≈ 0,248 ms ;
- presentation ≈ 0,390 ms ;
- RenderPlan ≈ 0,523 ms ;
- RenderPlan 158 142 B ;
- 896 commandes ;
- heap proxy ≈ 1,14 MB ;
- déterministe = true.

Ces mesures ne valent pas budget GPU/production.

## Dettes ouvertes

### GAP-P1-DOC

La sémantique qualifiée P1 distingue `publication_seq`, `state_revision` et `canonical_age`, mais les documents/schémas partageables principaux P1 restent partiellement en retard.

Conséquence :

```text
VISUEL-0 OFFLINE = PASS
CONTRACT FREEZE   = NO
```

Cette dette n’annule pas le PASS offline.

### Live

`GAP-P0-LIVE` et `GAP-P1-LIVE` restent ouverts. VISUEL live n’est pas qualifié.

### Replay vivant riche

`GAP-REAL-REPLAY` reste ouvert et devient pertinent avant VISUEL-2 réel, pas avant VISUEL-1 offline.

## Règle de gel

VISUEL-0 est une borne historique. Ne pas ajouter de fonctionnalité dans cette phase sauf défaut démontré, régression ou évolution minimale issue d’une revue de frontière.

Les anciennes branches VISUEL-0/1/Canvas restent des archives comparatives, pas des dépendances.

## Ouverture VISUEL-1

Baseline de départ : `ca9bed16f9fdb1aaeab2acd13563958c2d5ff8f8`.

Question de phase :

> Comment une identité, une continuité et quelques propriétés perceptives peuvent-elles produire quelque chose qui semble réellement vivant ?

VISUEL-1 doit tester la richesse morphologique et l’impression de vie à coût minimal sans figer prématurément les quatre axes et sans choisir un renderer définitif.
