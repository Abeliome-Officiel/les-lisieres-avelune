# P5A VISUEL — plan de qualification offline

> Date : 19 août 2026  
> Statut : **cahier des charges VERT / implémentation OFFLINE NON PASS / LIVE BLOCKED**.

## 1. Objectif

Prouver qu’une histoire sémantique autorisée peut devenir une représentation visuelle cohérente, accessible, reproductible et remplaçable sans que le visuel devienne une seconde simulation biologique.

P5A est strictement visuel. Les préférences de l’observateur traitées ici sont des préférences **visuelles/sensorielles**.

## 2. Frontière

```text
P1 Lecteur du Cœur
  ↓
WorldReadEnvelope + VisualPayload
  ↓
grammaire visuelle
  ↓
profil de présentation utilisateur
  ↓
port renderer
  ↓
renderer LAB
```

P5A ne lit ni le Cœur ni sa persistance. P6 reste propriétaire de l’assemblage de la Fenêtre.

## 3. Méthode rebuild-first

Les anciens VISUEL-0/1/Canvas ne sont pas des dépendances. Ils restent des archives de résultats, mesures et idées.

La baseline P5A est reconstruite depuis P1. Après qualification de la nouvelle base, les anciens LAB pourront être comparés et seuls les éléments qui simplifient réellement l’architecture pourront être repris.

## 4. Phases

- **VISUEL-0** : contrat d’entrée, `VisualPayload`, fixtures, replay, session/resync, multi-Avelune, confidentialité.
- **VISUEL-1** : grammaire minimale, coût minimal de vie, qualité adaptative, préférences visuelles.
- **VISUEL-1B** : renderer témoin remplaçable.
- **VISUEL-2** : continuité, croissance, transformation/mue.
- **VISUEL-3** : histoires divergentes.
- **VISUEL-4** : environnement, traces, vagues.
- **VISUEL-5** : paquet d’intégration visuelle prêt pour P6.

## 5. Fixtures VISUEL-0

F01 snapshot stable monde A.  
F02 `publication_seq` contigu avec saut de `state_revision` sur snapshots complets.  
F03 publication dupliquée.  
F04 trou de `publication_seq`.  
F05 changement de `stream_id`.  
F06 collision volontaire de `representation_id` entre mondes A/B.  
F07 variation progressive même identité.  
F08 transformation majeure explicitement signalée.  
F09 disparition/retour selon identité explicitement fournie.  
F10 version incompatible.  
F11 champ non allowlisté / leurre sensible.  
F12 replay valide puis checksum corrompu.  
F13 cadence sémantique lente.  
F14 préférences visuelles extrêmes.  
F15 `SOBRE/NORMAL/RICHE` avec mêmes faits/identités.  
F16 matrice synthétique 1/16/64/128 éléments.

## 6. Gate de tests offline

T01 validation stricte enveloppe + `VisualPayload`.  
T02 séparation `publication_seq/state_revision/canonical_age`.  
T03 duplicate idempotent.  
T04 publication gap → `RESYNC_REQUIRED`.  
T05 nouveau stream sans nouveau monde.  
T06 cache `world_instance_id + representation_id`.  
T07 aucune contamination A/B.  
T08 replay manifest/NDJSON/checksums.  
T09 fixture/replay équivalents sémantiquement.  
T10 `source_kind` sans effet artistique.  
T11 version incompatible → fail closed.  
T12 allowlist/leak scan.  
T13 continuité d’identité.  
T14 aucune inférence d’événement absent.  
T15 qualité matérielle ≠ préférences visuelles.  
T16 mouvement/couleur réduits conservent l’information critique.  
T17 déterminisme de préparation.  
T18 fake renderer + renderer LAB propre sur le même port.  
T19 fixture→replay sans changement de grammaire.  
T20 benchmark offline de non-régression.

## 7. Gaps amont

- **GAP-P1-DOC** : publier/synchroniser la forme P1 qualifiée avec `publication_seq`. P5A ne l’invente pas.
- **GAP-P0-LIVE** : bloc atomique `CommittedWorldState` requis par P1 live.
- **GAP-P1-LIVE** : qualification live après P0.
- **GAP-REAL-REPLAY** : premier replay sémantique riche du vivant requis avant VISUEL-2 réel, pas avant la plomberie VISUEL-0.

P2/P3/P4 ne bloquent pas VISUEL-0 offline.

## 8. Critère OFFLINE PASS

P5A passe lorsque : F01–F16 existent ; T01–T20 passent ; aucune fuite privée n’est détectée ; aucune dépendance aux anciens LAB n’existe ; la grammaire et le port renderer sont propres ; le registre des sources de recherche est à jour ; les gaps live restants sont explicitement attribués.

Le renderer final, le live et la Fenêtre P6 ne sont pas requis pour ce PASS.
