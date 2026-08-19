# P5B MUSIQUE — MUS-1P persistance/restart et garde-fous avant MUS-2

> Date : 19 août 2026  
> Statut : **MUS-1A PASS · MUS-1B PASS · MUS-1C PASS · MUS-1P REQUIRED · MUS-1 OFFLINE NOT YET QUALIFIED**

## Pourquoi MUS-1P existe

La revue de fermeture MUS-1 a identifié une responsabilité structurelle absente : `MusicMemoryState` est reconstructible depuis replay et borné en mémoire, mais il doit également survivre à un redémarrage du processus P5B sans perte silencieuse de l'histoire musicale déjà connue.

La séquence devient donc :

```text
MUS-1C
  ↓
MUS-1P — persistence / restart memory
  ↓
MUS-1D — final offline qualification
```

MUS-1A, MUS-1B et MUS-1C restent qualifiés ; ils ne sont pas remis à zéro.

## Autorité de continuité

P5B ne devient pas une deuxième implémentation autoritative de P1.

Cible live :

```text
WorldReadEnvelope + MusicPayload
        ↓
P1 ReadSession / ContinuityGuard
        ↓
observation P1 qualifiée
        ↓
P5B
        ↓
MusicSemanticObservation
        ↓
MusicPerceptionState
        ↓
MusicMemoryState
```

Les gardes de continuité P5B utilisés offline restent des harnais de compatibilité/tests. En production, la qualification des gaps, changements de stream/monde et resync appartient à P1. P5B décide seulement comment sa mémoire réagit à une discontinuité déjà qualifiée.

## Snapshot de mémoire

MUS-1P doit qualifier un snapshot local P5B :

- non autoritatif ;
- versionné ;
- strictement validé ;
- partitionné par `world_instance_id` ;
- déterministe ;
- compatible avec les versions/politiques mémoire attendues.

Le round-trip requis est :

```text
MusicMemoryState
  ↓ save
snapshot
  ↓ restart
restore
  ↓
même MusicMemoryState
```

Un snapshot invalide ne doit jamais être restauré partiellement.

## Corruption et incompatibilité

Une corruption ou incompatibilité de snapshot :

- affecte P5B uniquement ;
- n'affecte jamais le Cœur ;
- ne crée aucune histoire fictive ;
- doit produire un état d'échec/dégradation explicite.

Recovery préféré : reconstruction depuis un semantic replay qualifié disponible. Sans replay suffisant, P5B peut repartir du prochain état P1 qualifié avec une perte de mémoire explicitement connue. Cette perte de connaissance est une information épistémique, pas un événement d'Avelune.

## Garde-fous MUS-2

### Hashes non compositionnels

`history_digest` et `semantic_fingerprint` servent à l'intégrité, la provenance et la comparaison. Ils sont interdits comme seed, RNG, choix de variante, motif, harmonie, timbre ou toute autre donnée compositionnelle.

### Cadence de publication ≠ temps canonique

`samples`, `observation_count`, `linked_transitions` et les autres compteurs d'observation ne mesurent pas une durée vécue par Avelune.

Une cadence de publication différente ne doit pas, à elle seule, modifier l'interprétation musicale structurelle. Toute notion de durée/persistance musicale doit utiliser `canonical_age` via une sémantique temporelle explicite.

### Métadonnées épistémiques ≠ faits du monde

`frame_kind`, `event_history_exhaustive`, resync, provenance de transport et statut de recovery peuvent modifier la validation ou la mise à jour de mémoire. Ils ne deviennent jamais directement humeur, tension, couleur, densité ou événement musical du monde.

### Plusieurs échelles de mémoire

Le fait que le stockage soit borné ne signifie pas que les cumuls historiques doivent dominer éternellement la musique. MUS-2 devra distinguer explicitement le présent, la mémoire récente et une influence historique plus longue afin que l'histoire ancienne laisse une couleur sans empêcher la réponse au présent.

### MusicPayload reste expérimental

`MusicPayload v0.1-exp` reste volontairement minimal avec cinq axes perceptifs ordinaux. Aucun enrichissement vers P1/P0 n'est demandé sans insuffisance concrète, reproductible et documentée lors des essais de grammaire.

## Gate MUS-1D

`MUS_1_OFFLINE=PASS` ne peut être prononcé qu'après :

- MUS-1P PASS ;
- round-trip snapshot exact ;
- corruption/incompatibilité isolée à P5B ;
- absence de fausse histoire lors du recovery ;
- frontière d'autorité P1/P5B explicitement conservée ;
- hashes interdits comme données compositionnelles ;
- compteurs d'observation explicitement distincts du temps canonique ;
- métadonnées épistémiques exclues des faits musicaux.

Après seulement cette gate, MUS-2 peut ouvrir `StructuralMusicalPlan` sans moteur audio ni renderer.
