# Avelune Semantic Replay v0.1

> **Statut : format de laboratoire partageable — v0.1**  
> Date : 18 août 2026

## 1. Finalité

Le replay sémantique est le format durable consommable par VISUEL, MUSIQUE et futurs modules aval pour rejouer une histoire autorisée **sans dépendre d’un dump SQLite, d’un objet Python du Cœur ni d’un rapport scientifique brut**.

Il est produit après la frontière privée :

```text
artefact clos / source privée
        ↓
CœurReadAdapter
        ↓
allowlist de projection
        ↓
Avelune Semantic Replay
```

Un replay ne devient jamais une seconde autorité canonique. Il représente une histoire déjà produite.

## 2. Arborescence

```text
replay/
├── manifest.json
├── frames.ndjson
└── checksums.sha256
```

## 3. `manifest.json`

Le manifeste SHAREABLE contient uniquement les métadonnées nécessaires à l’interopérabilité et à l’intégrité, par exemple :

```json
{
  "format": "avelune-semantic-replay",
  "format_version": "0.1",
  "contract_version": "0.1",
  "projection": "music",
  "projection_version": "0.1",
  "classification": "SHAREABLE",
  "source_kind": "replay",
  "canonicality": "LAB",
  "world_instance_id": "opaque-world-id",
  "replay_id": "opaque-replay-id",
  "stream_id": "opaque-stream-id",
  "frame_count": 123,
  "first_revision": 0,
  "last_revision": 122,
  "first_canonical_age_h": 0,
  "last_canonical_age_h": 122,
  "adapter_version": "0.1",
  "files": {
    "frames.ndjson": {
      "sha256": "..."
    }
  }
}
```

Les identifiants ci-dessus sont des exemples de forme, pas des valeurs réelles.

Une variante PRIVATE peut conserver séparément les métadonnées de provenance nécessaires à l’audit propriétaire. Elles ne sont pas ajoutées au replay SHAREABLE simplement parce qu’elles existent.

## 4. `frames.ndjson`

REPLAY-0.1 utilise volontairement **des snapshots complets**. Une ligne NDJSON correspond à une frame sémantique complète :

```json
{
  "contract_version": "0.1",
  "projection_version": "0.1",
  "world_instance_id": "opaque-world-id",
  "source_kind": "replay",
  "stream_id": "opaque-stream-id",
  "canonicality": "LAB",
  "state_revision": 123,
  "canonical_age": {
    "value": 456,
    "unit": "canonical_hour"
  },
  "frame_kind": "snapshot",
  "payload": {}
}
```

Chaque ligne doit valider le schéma `world-read-envelope-v0.1.schema.json` ainsi que le schéma spécialisé du payload lorsqu’il existe.

## 5. Ordre et continuité

Les frames sont ordonnées par `state_revision`.

Pour REPLAY-0.1 :

- les révisions doivent être strictement monotones ;
- un trou inattendu est une erreur de replay ;
- le client ne fabrique jamais une révision absente ;
- `canonical_age` reste monotone et distinct de l’ordre transactionnel ;
- `world_instance_id` reste identique sur toute la séquence ;
- `stream_id` identifie la session de replay et ne vaut pas identité du monde.

## 6. Intégrité

`checksums.sha256` protège les fichiers du replay.

Le manifeste contient au minimum l’empreinte SHA-256 de `frames.ndjson`. Toute modification d’une frame produit donc un artefact différent.

Un replay gelé doit être reproductible à partir de sa source privée et de l’adaptateur/version documentés dans l’espace de provenance approprié.

## 7. Deux catégories à ne pas confondre

### Raw/private observer replay

Données issues des internes ou d’une instrumentation de laboratoire. Classification PRIVATE par défaut. Il sert uniquement de source éventuelle au `CœurReadAdapter`.

### Semantic replay

Sortie normalisée et allowlistée. C’est la seule catégorie destinée à devenir une entrée durable de VISUEL/MUSIQUE.

Un replay PRIVATE n’est pas rendu SHAREABLE par masquage de quelques champs : une nouvelle sortie SHAREABLE est produite explicitement par allowlist.

## 8. Projection

Le manifeste identifie la projection (`visual`, `music`, ou autre profil défini). Le noyau contractuel est commun, mais les payloads spécialisés ne sont pas fusionnés.

Ainsi un replay MUSIQUE ne transporte pas automatiquement les données propres au VISUEL, et inversement.

## 9. Interchangeabilité

La gate de branchement exige que, pour un même état source, la projection obtenue depuis un replay et celle obtenue depuis une source LAB/live soient sémantiquement identiques après exclusion des seules métadonnées de transport.

Le module peut connaître `source_kind`; sa logique artistique ne dépend pas de cette valeur.

## 10. Confidentialité

Aucun paramètre, seed, mapping privé, identifiant interne, diagnostic scientifique brut, causalité réservée ou contenu CODEX n’est requis dans un replay destiné au fonctionnement normal de VISUEL/MUSIQUE.

Le replay est classé comme un artefact homogène : `PRIVATE` ou `SHAREABLE`.

## 11. Évolution

Les deltas, batches d’événements et optimisations réseau sont hors REPLAY-0.1. Ils seront ajoutés seulement après validation des snapshots complets, de l’ordre, de l’identité, de la resynchronisation et de l’interchangeabilité replay/live.
