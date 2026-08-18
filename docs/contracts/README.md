# Contrats de lecture et de représentation

Ce répertoire contient les **contrats partageables** utilisés entre le Cœur et les modules aval d’Avelune.

## Autorité actuelle

La frontière architecturale est décrite dans [`docs/32_coeur_contrat_lecture_modules.md`](../32_coeur_contrat_lecture_modules.md).

Le noyau commun de lecture v0.1 est :

- [`world-read-envelope-v0.1.schema.json`](world-read-envelope-v0.1.schema.json) — identité de monde, source, stream, canonicalité, révision, âge canonique, type de frame et payload spécialisé ;
- [`avelune-semantic-replay-v0.1.md`](avelune-semantic-replay-v0.1.md) — format de replay sémantique de laboratoire.

Les données perceptives restent dans des projections spécialisées (`VisualPayload`, `MusicPayload`, etc.) validées par allowlist. Le noyau commun ne doit pas devenir l’union de tous les champs utiles à tous les modules.

## Schéma historique `representation-semantic-v0`

[`representation-semantic-v0.schema.json`](representation-semantic-v0.schema.json) est un **contrat expérimental de LAB antérieur** à la stabilisation de `WorldReadEnvelope v0.1`.

Il reste volontairement dans le dépôt parce que des branches et preuves de laboratoire VISUEL/MUSIQUE existantes le consomment encore. Il ne doit pas être supprimé ou modifié brutalement pour masquer cette histoire.

Règle de migration :

```text
ancien fixture/replay de LAB
        ↓
adaptateur/migration explicite
        ↓
WorldReadEnvelope v0.1 + payload spécialisé
        ↓
grammaire / renderer inchangés autant que possible
```

Une incompatibilité doit échouer explicitement ; aucune approximation silencieuse n’est autorisée.

## Frontière public / privé

Ces contrats peuvent documenter la forme des données autorisées et leurs invariants. Ils ne contiennent pas :

- seeds ou paramètres biologiques ;
- champs sources privés du Cœur ;
- mappings exacts vers les descripteurs perceptifs ;
- métriques scientifiques sans utilité publique ;
- causalités, recettes ou contenu CODEX.

Les replays bruts/observer restent PRIVATE. Un replay sémantique SHAREABLE est généré explicitement par allowlist après audit.
