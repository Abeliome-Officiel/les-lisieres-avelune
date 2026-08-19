# P5B MUSIQUE — MUS-1P persistance/restart et garde-fous avant MUS-2

> Date : 19 août 2026  
> Statut : **MUS-1A PASS · MUS-1B PASS · MUS-1C PASS · MUS-1P PASS · MUS-1 OFFLINE READY FOR FINAL GATE · LIVE BLOCKED**

## Résultat MUS-1P

MUS-1P est qualifié avec **148/148 tests PASS**, `compileall` PASS, `diff-check` PASS, audit mémoire RNG/horloge/réseau PASS et audit de frontière d'autorité P1 PASS.

La mémoire P5B dispose désormais d'un snapshot JSON canonique, déterministe, versionné et non autoritatif. Le round-trip `save → restart logique → restore` restitue exactement le même `MusicMemoryState`. Les corruptions, versions incompatibles, types non allowlistés et incohérences de monde/révision/âge/fingerprint sont refusés en fail-closed.

Le recovery qualifié distingue :

- snapshot valide → `RESTORED` ;
- snapshot invalide + semantic replay qualifié → `REBUILT_FROM_REPLAY` ;
- preuve insuffisante → `PARTIAL_RESTART_REQUIRED`, sans mémoire historique fabriquée.

La séquence est maintenant :

```text
MUS-1C PASS
  ↓
MUS-1P PASS
  ↓
MUS-1D — final offline qualification
```

MUS-1A, MUS-1B, MUS-1C et MUS-1P restent qualifiés ; ils ne sont pas remis à zéro.

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

Les composants de persistance/recovery MUS-1P ne réimplémentent ni `PublicationSession`, ni `ReadSession`, ni `ContinuityGuard`.

## Snapshot de mémoire

Le snapshot local P5B qualifié est :

- non autoritatif ;
- versionné ;
- strictement validé ;
- partitionné par `world_instance_id` ;
- déterministe ;
- protégé par SHA-256 ;
- compatible uniquement avec les versions/politiques mémoire explicitement admises ;
- écrit atomiquement sur le filesystem local.

Le round-trip qualifié est :

```text
MusicMemoryState
  ↓ save
snapshot
  ↓ restart
restore
  ↓
même MusicMemoryState
```

Un snapshot invalide n'est jamais restauré partiellement.

## Corruption et incompatibilité

Une corruption ou incompatibilité de snapshot :

- affecte P5B uniquement ;
- n'affecte jamais le Cœur ;
- ne crée aucune histoire fictive ;
- produit un état d'échec/dégradation explicite.

Recovery préféré : reconstruction depuis un semantic replay qualifié disponible. Sans replay suffisant, P5B conserve explicitement la perte de connaissance ; cette perte est une information épistémique, pas un événement d'Avelune.

`MemoryRecoveryStatus` reste séparé de `MusicMemoryState`.

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

### Frontière de preuves compositionnelles

MUS-2 ne doit pas laisser l'interpréteur structurel fouiller librement l'objet technique `MusicMemoryState`. La prochaine frontière doit projeter une allowlist de preuves interprétables, conceptuellement :

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

Cette frontière doit exclure les hashes, statuts de recovery, provenance de transport et compteurs pris à tort comme temps canonique.

### MusicPayload reste expérimental

`MusicPayload v0.1-exp` reste volontairement minimal avec cinq axes perceptifs ordinaux. Aucun enrichissement vers P1/P0 n'est demandé sans insuffisance concrète, reproductible et documentée lors des essais de grammaire.

## Gate MUS-1D

`MUS_1_OFFLINE=PASS` ne peut être prononcé qu'après la gate finale qui revalide notamment :

- les **148 tests** existants ;
- round-trip snapshot exact et sérialisation déterministe ;
- corruption/incompatibilité isolée à P5B ;
- recovery replay exact et absence de fausse histoire ;
- frontière d'autorité P1/P5B ;
- bornes de mémoire monde et d'identités ;
- isolation multi-Avelune ;
- hashes classés non compositionnels ;
- compteurs d'observation distincts du temps canonique ;
- métadonnées épistémiques exclues des faits musicaux ;
- absence de RNG, réseau, audio et dépendance runtime au Cœur/P2/P3/P4.

Après seulement cette gate, MUS-2 pourra ouvrir la projection de preuves compositionnelles puis `StructuralMusicalPlan`, toujours sans moteur audio ni renderer.
