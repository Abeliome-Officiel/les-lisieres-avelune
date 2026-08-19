# P5A — VISUEL — fondations offline, phases et gates

> Statut au 19 août 2026 : **OFFLINE PASS = NON** ; **LIVE BLOCKED = OUI**.
>
> Ce document décrit le périmètre P5A VISUEL après qualification offline de P1/P2/P3/P4. Il ne remplace pas l'autorité de P1 sur `WorldReadEnvelope` et ne publie aucun détail privé du Cœur.

## 1. Mission et frontière

P5A construit la grammaire visuelle et le sous-système de rendu réutilisables par P6 Fenêtre puis, lorsque pertinent, par le futur jeu.

```text
P1 Lecteur du Cœur
  ↓
WorldReadEnvelope + VisualPayload
  ↓
grammaire VISUEL
  ↓
profil de présentation
  ↓
renderer remplaçable
```

P5 ne lit pas directement le Cœur, sa persistance, P2, P3 ou P4 pour produire la perception du monde.

P6 reste propriétaire de l'assemblage de la Fenêtre. P5 fournit un composant visuel intégrable ; il ne devient pas le produit Fenêtre.

## 2. Correction de continuité issue de P1

Le contrat qualifié P1 distingue trois axes :

- `publication_seq` : ordre des publications dans une session ;
- `state_revision` : identité/ordre de l'état canonique committé représenté ;
- `canonical_age` : âge canonique du monde.

Un saut de `state_revision` entre deux **snapshots complets** ne constitue pas à lui seul un trou si `publication_seq` reste contigu.

P5 demande une resynchronisation sur perte/désordre de publication, changement de session non revalidé, incompatibilité de version ou incohérence de monde. Il ne fabrique pas d'état absent.

CREAD v0.1 ne garantit pas un historique événementiel exhaustif : P5 ne déduit jamais qu'il connaît tous les événements survenus entre deux snapshots.

> GAP-P1-DOC : au moment de cette reprise, les documents/schémas partageables présents sur `main` reflètent encore la forme du 18 août et n'exposent pas `publication_seq`. P5 ne modifie pas l'autorité P1 pour corriger ce décalage ; il attend la synchronisation contractuelle P1 avant de figer son loader.

## 3. Phases P5A

### VISUEL-0 — fondation contractuelle offline — ACTIVE

- `VisualPayload v0.1` expérimental ;
- loader `WorldReadEnvelope` ;
- loader `Avelune Semantic Replay` ;
- session `publication_seq` / `stream_id` / resync ;
- isolation multi-Avelune ;
- allowlist et scan de fuite ;
- fixture/replay équivalents ;
- bridge vers VISUEL-1 existant.

### VISUEL-1 — grammaire et coût minimal — BRIQUE EXISTANTE À REQUALIFIER

Plan de rendu neutre, déterminisme de présentation, profils `SOBRE/NORMAL/RICHE`, préférences sensorielles indépendantes et port renderer.

### VISUEL-1B — renderer témoin — BRIQUE EXISTANTE À REQUALIFIER

Canvas 2D reste un témoin de contrôle, pas un choix final.

### VISUEL-2 — continuité / croissance / mue

Qualification sur une histoire sémantique adaptée : identité stable, transformation majeure, continuité perceptive et mouvement réduit.

### VISUEL-3 — trajectoires historiques divergentes

Même grammaire, mondes/histoires différents, sans convergence visuelle artificielle.

### VISUEL-4 — environnement / traces / vagues

Région/scène, traces historiques, événements perceptibles allowlistés, LOD et sobriété.

### VISUEL-5 — paquet d'intégration pour P6

Port/API de rendu stable, profils qualité/accessibilité, reprise/resync, budget client documenté et exemple d'intégration offline. **P6 construit la Fenêtre.**

## 4. Fixtures offline minimales

| ID | Cas | Attendu |
|---|---|---|
| F01 | snapshot stable monde A | accepté |
| F02 | `publication_seq` contigu, `state_revision` saute | accepté en snapshot |
| F03 | `publication_seq` dupliqué | pas de double traitement |
| F04 | trou de `publication_seq` | `RESYNC_REQUIRED` |
| F05 | changement `stream_id` | session revalidée / snapshot requis |
| F06 | monde A/B avec même `representation_id` | caches isolés |
| F07 | variation progressive même identité | continuité conservée |
| F08 | transformation majeure synthétique explicite | identité conservée selon contrat |
| F09 | disparition/retour explicitement identifié | aucune identité inventée |
| F10 | version incompatible | fail closed |
| F11 | champ non allowlisté / leurre sensible | rejet |
| F12 | replay valide puis checksum corrompu | valide / rejet |
| F13 | longue période sans publication | animation présentationnelle seulement |
| F14 | mouvement nul / saturation faible / particules nulles | information critique conservée |
| F15 | SOBRE/NORMAL/RICHE | mêmes faits et identités |
| F16 | 1/16/64/128 éléments | non-régression de coût |

## 5. Gate de tests offline

1. validation stricte enveloppe + `VisualPayload` ;
2. séparation `publication_seq` / `state_revision` / `canonical_age` ;
3. duplicate publication idempotent ;
4. publication gap → resync ;
5. restart de stream sans changement d'identité monde ;
6. cache `world_instance_id + representation_id` ;
7. aucune contamination A/B ;
8. replay manifest/NDJSON/checksums ;
9. fixture et replay équivalents → même sémantique utile ;
10. `source_kind` n'altère pas la grammaire ;
11. version incompatible → erreur explicite ;
12. allowlist/leak scan ;
13. continuité d'identité ;
14. aucune inférence d'événement absent ;
15. qualité matérielle ≠ préférences sensorielles ;
16. mouvement/couleur réduits conservent l'information critique ;
17. déterminisme de préparation ;
18. fake renderer et Canvas consomment le même port ;
19. fixture → replay sans réécriture du plan/renderer ;
20. benchmark offline de non-régression.

Le benchmark matériel de production et le choix du renderer final ne font pas partie de cette gate de fondation.

## 6. Gaps amont

- **GAP-P1-DOC** : fournir/synchroniser la définition contractuelle exacte P1 incluant la sémantique `publication_seq` ;
- **GAP-P0-LIVE** : fournir atomiquement `CommittedWorldState { world_instance_id, state_revision, canonical_age, state }` depuis un même état committé ;
- **GAP-P1-LIVE** : ensuite qualifier `RealCoeurReadAdapter + LiveSource`, équivalence replay/live, pannes/reprise et coûts ;
- **GAP-REAL-REPLAY** : produire un premier replay sémantique riche du vivant depuis un artefact clos avant VISUEL-2 réel.

P2, P3 et P4 ne bloquent pas le socle offline P5. P8 ne bloque pas les préférences locales ; il portera plus tard leur persistance utilisateur.

## 7. Risques principaux

- conserver implicitement `representation-semantic-v0` comme contrat courant ;
- confondre `state_revision` et `publication_seq` ;
- inventer des événements entre snapshots ;
- contaminer les caches entre mondes ;
- faire varier la grammaire selon `source_kind` ;
- confondre qualité matérielle et accessibilité ;
- faire d'une commodité Canvas/Pixi une exigence Cœur ;
- absorber le périmètre P6 dans P5 ;
- attendre le live alors que la gate offline est qualifiable sur fixtures.

## 8. Verdict courant

**OFFLINE PASS = NON.**

Les briques historiques VISUEL-0 (9/9), VISUEL-1 (7/7) et Canvas (5/5) restent utiles mais ne sont pas requalifiées contre P1 du 19 août et ne chargent pas encore le replay sémantique final.

**LIVE BLOCKED = OUI.**

Blocages : protocole O1 intouchable ; primitives atomiques P0 non encore livrées à P1 ; CREAD-LIVE donc gelé. Ce blocage live n'empêche pas la fermeture de VISUEL-0 offline.

## 9. Prochaine étape

Rebaser la plomberie VISUEL-0 sur le contrat P1 qualifié, construire les fixtures/tests ci-dessus et reconnecter la sortie au **plan VISUEL-1 et au Canvas VISUEL-1B existants sans réécriture substantielle**. Cette absence de réécriture est la preuve anti-couplage recherchée.
