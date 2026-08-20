# P5A — VISUEL — fondations offline, phases et gates

> Statut au 19 août 2026 : **OFFLINE PASS = NON** ; **LIVE BLOCKED = OUI**.
>
> Ce document décrit le périmètre P5A VISUEL après qualification offline de P1/P2/P3/P4. Il ne remplace pas l'autorité de P1 sur `WorldReadEnvelope` et ne publie aucun détail privé du Cœur.

## 0. Règle de méthode — invariants avant héritage de code

P5 ne cherche pas à conserver l'implémentation historique pour elle-même.

Lorsque l'architecture qualifiée, les contrats amont ou l'expérience acquise montrent qu'une branche de LAB est devenue artificielle, trop couplée ou coûteuse à adapter, la solution préférée peut être de **jeter cette implémentation et reconstruire proprement depuis la bonne frontière**, même si une partie du code fonctionnait déjà.

Ordre de conservation :

1. lois et frontières d'Avelune ;
2. invariants perceptifs et artistiques actés ;
3. connaissances acquises, résultats de tests et mesures ;
4. références scientifiques, artistiques et techniques ayant réellement nourri le chantier ;
5. formats/contrats qualifiés ;
6. code existant seulement s'il reste naturellement compatible avec les points précédents.

Un ancien module peut donc être conservé comme **preuve, comparaison ou source de connaissance** sans être réutilisé dans la baseline finale.

Les grands principes perceptifs restent indépendants de l'implémentation. Par exemple, les rendus et futurs interpréteurs peuvent être adaptés aux préférences de l'observateur — préférences sensorielles, qualité, thème ou direction perceptive lorsque le module concerné le prévoit — sans modifier l'état canonique ni l'histoire du monde.

Les sources de recherche sont pérennes : abandonner Canvas, PixiJS, une grammaire morphologique ou une technique expérimentale ne supprime pas les études, œuvres, standards, précédents ni résultats documentés qui ont éclairé la décision. Ils restent dans le registre avec leur statut `[RÉFÉRENCE] / [HYPOTHÈSE AVELUNE] / [TESTÉ] / [ACTÉ]`.

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
- grammaire minimale propre, construite depuis la frontière P1 ;
- comparaison avec les anciennes briques VISUEL-0/1/1B pour récupérer seulement ce qui reste sain.

### VISUEL-1 — grammaire et coût minimal — À REQUALIFIER / RECONSTRUIRE SI NÉCESSAIRE

Le plan de rendu neutre, le déterminisme de présentation, les profils `SOBRE/NORMAL/RICHE`, les préférences sensorielles indépendantes et le port renderer restent des **principes à préserver**. Leur implémentation historique n'est pas une contrainte de compatibilité.

### VISUEL-1B — renderer témoin — RÉFÉRENCE, PAS HÉRITAGE OBLIGATOIRE

Canvas 2D reste un témoin de contrôle et une baseline de comparaison. Il peut être repris, simplifié ou remplacé si une baseline propre est plus rationnelle. Il ne sélectionne pas le renderer final.

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
18. au moins deux renderers/ports de test peuvent consommer la même grammaire sans imposer de changement au contrat ;
19. fixture → replay ne change ni la sémantique visuelle ni les invariants artistiques ; une réimplémentation interne propre reste autorisée ;
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
- attendre le live alors que la gate offline est qualifiable sur fixtures ;
- **suradapter un ancien prototype pour préserver du code au lieu de reconstruire une frontière propre** ;
- perdre la traçabilité d'une étude ou d'un essai simplement parce que la technique qu'il motivait est abandonnée.

## 8. Verdict courant

**OFFLINE PASS = NON.**

Les briques historiques VISUEL-0 (9/9), VISUEL-1 (7/7) et Canvas (5/5) restent des preuves utiles. Elles ne sont ni sacrées ni automatiquement reprises : elles précèdent P1 du 19 août et seront évaluées morceau par morceau contre la nouvelle baseline.

**LIVE BLOCKED = OUI.**

Blocages : protocole O1 intouchable ; primitives atomiques P0 non encore livrées à P1 ; CREAD-LIVE donc gelé. Ce blocage live n'empêche pas la fermeture de VISUEL-0 offline.

## 9. Prochaine étape

Créer une **baseline VISUEL-0 propre depuis la frontière P1 qualifiée**, puis seulement comparer l'ancien code avec cette architecture.

Pour chaque brique historique :

```text
compatible naturellement et plus simple à conserver ? → réutiliser
nécessite adaptateurs artificiels, exceptions ou dette ? → jeter / réécrire
```

La gate n'est donc plus « préserver le plan/renderer existant ». La gate est : **obtenir une architecture simple, testable et indépendante qui conserve les invariants d'Avelune sans dépendre de l'histoire accidentelle des prototypes**.

## 10. Capital scientifique et artistique à conserver

Le chantier conserve un registre durable des sources réellement utilisées pour réfléchir à la représentation : L-systems et Algorithmic Botany, Clades, réaction-diffusion, cohérence temporelle, LOD, formes implicites/SDF/metaballs, particules/champs de flux, WCAG/W3C, renderers et futures références pertinentes.

Une source peut rester importante même si l'hypothèse qu'elle a inspirée échoue. Le statut du registre doit alors évoluer plutôt que disparaître : `[RÉFÉRENCE]` reste la référence ; `[HYPOTHÈSE AVELUNE]` décrit la transposition envisagée ; `[TESTÉ]` enregistre le résultat, y compris négatif ; `[ACTÉ]` consigne la décision retenue.

Le code est remplaçable ; **l'apprentissage documenté ne l'est pas**.
