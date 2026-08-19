# P5B MUSIQUE — terrain offline

Ce répertoire décrit uniquement le **terrain partageable** du chantier P5B. Il ne contient ni recettes musicales propriétaires, ni replay privé, ni données brutes du Cœur.

L’ancien `lab/musique0/` reste historique. P5B repart sur une fondation propre et n’a aucune obligation de compatibilité avec ce LAB.

## Statut

- architecture : **PASS** ;
- MUS-0 fondation contractuelle offline : **PASS / CLOSED** ;
- P5B offline global : **NON** — MUS-1 à MUS-3 restent à qualifier ;
- live : **BLOCKED** ;
- accès O1 : **NO** ;
- audio : **NONE** à la fermeture de MUS-0.

La gate MUS-0 a fermé avec 80/80 tests PASS, lecture replay streaming, contrôle de compatibilité, confidentialité et absence de dépendances runtime tierces.

## Entrée autorisée

```text
P1 / WorldReadEnvelope + MusicPayload
```

P5B ne lit jamais directement le Cœur, sa base, P2, P3 ou P4.

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

## Ordre de travail

1. ~~fondation contrat/session/replay/`MusicPayload`~~ — **MUS-0 PASS** ;
2. construire `MusicPerceptionState` ;
3. construire une mémoire reconstructible, bornée et isolée par monde ;
4. qualifier deux histoires divergentes puis partiellement convergentes ;
5. construire le plan musical structurel ;
6. ajouter thèmes observateur et accessibilité ;
7. ajouter un renderer témoin remplaçable ;
8. qualifier l’ensemble offline avant tout live.

## Séparation public / privé

Partageable ici : contrats de consommation, interfaces, gates, fixtures neutres, résultats agrégés, méthodologie et références.

Privé/Coffre : mappings exacts, recettes, provenance propriétaire, replays sensibles, paramètres de composition révélateurs, causalités et toute information permettant d’inférer le Cœur.

Référentiel : `docs/p5_musique_fondations_offline_v0.1.md`.
