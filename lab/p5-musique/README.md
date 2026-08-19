# P5B MUSIQUE — terrain offline

Ce répertoire décrit uniquement le **terrain partageable** du chantier P5B. Il ne contient ni recettes musicales propriétaires, ni replay privé, ni données brutes du Cœur.

L’ancien `lab/musique0/` reste historique. P5B repart sur une fondation propre et n’a aucune obligation de compatibilité avec ce LAB.

## Statut

- architecture : **PASS** ;
- MUS-0 fondation contractuelle offline : **PASS / CLOSED** ;
- MUS-1A état perceptif : **PASS** ;
- MUS-1B mémoire monde bornée : **PASS** ;
- MUS-1C continuité bornée des identités opaques : **PASS** ;
- MUS-1 global : **NON ENCORE QUALIFIÉ** — MUS-1P persistance/restart puis MUS-1D final gate ;
- P5B offline global : **NON** — MUS-1 à MUS-3 restent à qualifier ;
- live : **BLOCKED** ;
- accès O1 : **NO** ;
- audio : **NONE** à ce stade.

MUS-0 a fermé avec 80/80 tests PASS. MUS-1C porte la suite cumulée à 125/125 tests PASS avant le lot de persistance.

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

P5B peut conserver un harnais local de continuité pour les fixtures/replays offline, mais **ne devient pas une seconde autorité de continuité live**. La détection des gaps, changements de stream/monde et la qualification du resync restent des responsabilités P1. P5B décide uniquement comment sa mémoire aval réagit à une discontinuité déjà qualifiée.

## Frontière qualifiée par MUS-0

```text
métadonnées P1 consommées
        +
MusicPayload v0.1-exp
        ↓
MusicSemanticObservation
```

Les cinq axes expérimentaux de `MusicPayload` sont `presence`, `activity`, `variation`, `continuity` et `transformation`, sur une échelle ordinale 0..4. Ils ne sont ni biologiques, ni musicaux, ni audio.

MUS-0 qualifie également `publication_seq`, `state_revision`, `canonical_age`, resync, isolation multi-Avelune, JSON strict, allowlist, semantic replay SHA-256, streaming et compatibilité fail-closed.

`event_history_exhaustive=false` reste respecté : P5B n’invente pas les événements absents. Une projection événementielle et `event_id` ne seront ajoutés qu’après qualification d’un contrat P1 correspondant.

## Mémoire MUS-1

MUS-1A retire les métadonnées de transport avant mémoire/composition et construit un `MusicPerceptionState` déterministe.

MUS-1B conserve un état courant, des résumés historiques interprétables et une fenêtre récente bornée. Une discontinuité n’est jamais transformée en transition supposée.

MUS-1C conserve la continuité locale de `region_id` / `representation_id` sans table historique infinie : les identités actives suivent le snapshot courant et seules des identités récemment absentes peuvent être retenues dans un cache à capacité fixe. Une absence ou une éviction n’implique jamais naissance, mort ou extinction.

## MUS-1P — persistance/restart avant fermeture

MUS-1 ne sera pas déclaré PASS avant qualification d’une persistance locale **non autoritative**, versionnée et déterministe de `MusicMemoryState`.

Objectifs :

- save → restart → restore restitue exactement la même mémoire ;
- snapshot partitionné par `world_instance_id` ;
- version/politiques mémoire vérifiées explicitement ;
- snapshot corrompu ou incompatible : échec P5B local uniquement ;
- aucun effet sur le Cœur ;
- aucune histoire fabriquée ;
- reconstruction depuis semantic replay qualifié si disponible ;
- sinon reprise avec perte de mémoire explicitement connue côté P5B.

## Invariants avant MUS-2

- `history_digest` et `semantic_fingerprint` sont des preuves d’intégrité/provenance, **jamais des seeds ni des données compositionnelles** ;
- `samples`, `observation_count` et les nombres de transitions mesurent l’observation, **pas la durée canonique** ;
- toute durée/persistance musicale future doit s’appuyer sur `canonical_age` et une sémantique temporelle explicite ;
- `frame_kind`, `event_history_exhaustive`, resync et autres métadonnées épistémiques peuvent contrôler la mise à jour de mémoire mais ne deviennent pas humeur, tension ou événement musical du monde ;
- la grammaire future devra équilibrer présent, mémoire récente et influence historique longue afin que l’histoire colore sans figer la réponse au présent ;
- `MusicPayload v0.1-exp` reste volontairement minimal : aucune extension vers P1/P0 sans manque concret démontré.

## Ordre de travail

1. ~~fondation contrat/session/replay/`MusicPayload`~~ — **MUS-0 PASS** ;
2. ~~`MusicPerceptionState`~~ — **MUS-1A PASS** ;
3. ~~mémoire monde reconstructible et bornée~~ — **MUS-1B PASS** ;
4. ~~continuité bornée des identités opaques~~ — **MUS-1C PASS** ;
5. qualifier persistance/restart de `MusicMemoryState` — **MUS-1P NEXT** ;
6. fermer MUS-1 par gate finale — MUS-1D ;
7. construire `StructuralMusicalPlan` sans moteur audio ;
8. ajouter thèmes observateur et accessibilité en couches séparées ;
9. ajouter un renderer témoin remplaçable ;
10. qualifier l’ensemble offline avant tout live.

## Séparation public / privé

Partageable ici : contrats de consommation, interfaces, gates, fixtures neutres, résultats agrégés, méthodologie et références.

Privé/Coffre : mappings exacts, recettes, provenance propriétaire, replays sensibles, paramètres de composition révélateurs, causalités et toute information permettant d’inférer le Cœur.

Référentiels :

- `docs/p5_musique_fondations_offline_v0.1.md` ;
- `docs/p5_musique_mus1p_persistence_restart_gate.md` — décision de revue avant fermeture MUS-1.
