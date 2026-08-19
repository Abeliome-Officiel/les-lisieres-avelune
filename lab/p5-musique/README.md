# P5B MUSIQUE — terrain offline

Ce répertoire décrit uniquement le **terrain partageable** du chantier P5B. Il ne contient ni recettes musicales propriétaires, ni replay privé, ni données brutes du Cœur.

L’ancien `lab/musique0/` reste historique. P5B repart sur une fondation propre et n’a aucune obligation de compatibilité avec ce LAB.

## Entrée autorisée

```text
P1 / WorldReadEnvelope + MusicPayload
```

P5B ne lit jamais directement le Cœur, sa base, P2, P3 ou P4.

## Ordre de travail

1. synchroniser la forme contractuelle P1 qualifiée ;
2. définir `MusicPayload v0.1` expérimental ;
3. construire fixtures et tests MUS-0 ;
4. qualifier loader/session/replay clock ;
5. construire mémoire ;
6. construire le plan musical structurel ;
7. ajouter thèmes observateur et accessibilité ;
8. ajouter un renderer témoin remplaçable ;
9. qualifier l’ensemble offline avant tout live.

## Séparation public / privé

Partageable ici : contrats, interfaces, gates, fixtures neutres, résultats agrégés, méthodologie et références.

Privé/Coffre : mappings exacts, recettes, provenance propriétaire, replays sensibles, paramètres de composition révélateurs, causalités et toute information permettant d’inférer le Cœur.

Référentiel : `docs/p5_musique_fondations_offline_v0.1.md`.
