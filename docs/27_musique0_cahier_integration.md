# MUSIQUE-0 — cahier des charges d’intégration

> **Statut : préproduction partageable — v0.2**  
> **Verdict : VERT pour un laboratoire hors ligne et réversible.**  
> Ce document autorise un banc d’essai découplé ; il ne sélectionne aucun moteur audio et ne fixe aucune décision propriétaire de traduction.

## 1. Objectif

MUSIQUE-0 doit permettre de prototyper la musique évolutive d’Avelune avant que le Cœur soit terminé **sans créer une dépendance qui imposerait une réécriture lors du branchement final**.

La règle centrale est :

> **la grammaire musicale ne dépend jamais directement des structures internes d’une révision du Cœur.**

Toute dépendance à la source est confinée dans un adaptateur remplaçable.

## 2. Architecture anti-réécriture

```text
source autorisée / replay / fixture
            ↓
   adaptateur de source
            ↓
 projection sémantique autorisée
            ↓
 contrat sémantique versionné
            ↓
     grammaire musicale
            ↓
    renderer remplaçable
            ↓
   préférences sensorielles
```

Les fixtures synthétiques, les replays autorisés et une future source active doivent devenir interchangeables **à partir de la frontière contractuelle**.

Le renderer ne connaît aucune structure privée du Cœur. Inversement, le Cœur ne connaît aucune technologie de rendu sonore.

## 3. Responsabilités

- **source canonique** : produit les faits et l’histoire ;
- **projection/adaptateur** : traduit une source/version vers la sémantique explicitement autorisée ;
- **contrat** : décrit le sens des données nécessaires à une représentation ;
- **grammaire musicale** : transforme cette sémantique en comportements musicaux ;
- **renderer** : matérialise ces comportements en audio ;
- **accessibilité** : transforme ou simplifie le rendu sans modifier le canon.

Le protocole de transport est distinct du contrat. Le LAB lit d’abord des fichiers ; la production pourra employer un transport différent si la sémantique reste compatible.

## 4. Versions indépendantes

Maintenir séparément :

1. version de la source ;
2. version de l’adaptateur et du contrat ;
3. version de la grammaire musicale ;
4. version du renderer.

Une évolution interne de la source qui conserve la même signification est absorbée par l’adaptateur. Si la signification elle-même change, le contrat évolue explicitement et sa compatibilité est testée.

## 5. Contrat expérimental v0

Le premier artefact technique est un **enveloppe de représentation expérimentale**, volontairement petite et transport-neutre. Elle doit porter seulement ce qui est nécessaire pour tester le découplage : version, provenance autorisée, séquence, temps logique, portée, état complet ou incrémental, descripteurs et événements explicitement autorisés.

Cette enveloppe n’est pas déclarée contrat universel définitif d’Avelune. Le visuel et le sonore pourront partager un socle commun ou utiliser des contrats frères si leurs sémantiques divergent. Ce choix sera fait sur besoin démontré, pas par symétrie architecturale.

Le contrat n’expose que la sémantique autorisée et reste indépendant de la structure privée de sa source.

Le schéma technique initial est conservé sous `docs/contracts/representation-semantic-v0.schema.json`.

## 6. Replays et fixtures

Chaque replay de laboratoire doit pouvoir être accompagné d’un manifeste suffisant pour identifier sa provenance autorisée, les versions nécessaires à sa reproduction, sa période logique, sa portée, son intégrité et sa classification.

Le corpus expérimental devra couvrir plusieurs régimes et transitions contrastés, et inclure des cas appariés lorsque cela est pertinent. Les fixtures publiques de démarrage restent **neutres et synthétiques** : elles valident le schéma et le pipeline sans prétendre représenter la structure réelle du Cœur.

Les scénarios sémantiques plus expressifs peuvent être testés dans l’espace interne approprié avant toute décision de publication.

## 7. Grammaire musicale minimale

Le laboratoire peut explorer des propriétés musicales générales telles que densité, tension et résolution, registre, richesse timbrale, activité rythmique, continuité, vitesse de transformation et silence.

Ces propriétés sont musicales, pas canoniques. Les détails propriétaires de la grammaire expérimentale sont versionnés et testés dans l’espace interne approprié. GitHub conserve seulement les interfaces, méthodes et critères nécessaires au développement partagé.

## 8. Gates

### G0 — Documentation et publication
Architecture, méthode, références, frontières et règles d’hygiène documentaire présentes.

### G1 — Contrat
Le schéma v0 accepte plusieurs fixtures synthétiques neutres sans importer le Cœur.

### G2 — Adaptateur
Deux sources ou deux versions simulées peuvent produire une sortie contractuelle compatible sans modifier la grammaire.

### G3 — Replay
Un replay et son manifeste sont validables, versionnés et vérifiables.

### G4 — Renderer
Un renderer factice puis un renderer sonore peuvent consommer la même sortie de grammaire sans changement du Cœur.

### G5 — Perception
Des trajectoires contrastées produisent des différences perceptibles mais cohérentes et la longue durée reste compatible avec la direction sonore.

### G6 — Accessibilité
Le rendu peut être fortement simplifié sans supprimer d’information fonctionnelle critique.

### G7 — Ressources
Le coût isolé est connu, puis la charge cumulée est mesurée avec les briques réellement concurrentes.

### G8 — Branchement
Un replay peut être remplacé par un flux simulé respectant la même frontière contractuelle sans modifier la grammaire.

### G9 — Évolution
Une évolution plausible de la source peut être absorbée par un adaptateur ou une migration explicite du contrat sans réécriture globale du LAB.

Une gate échouée ne peut pas être contournée par un accès direct aux internes du Cœur.

## 9. Charge machine

Le budget final n’est jamais celui de la musique seule.

- côté navigateur : jeu + visuel + audio + accessibilité + réseau ;
- côté serveur : Cœur/backend + services réellement colocalisés ;
- côté laboratoire : campagnes scientifiques et expériences de représentation restent séparées par défaut.

Mesurer selon le domaine : CPU, GPU, RAM, I/O, stockage, réseau, énergie et thermique, en régime normal et aux pointes plausibles.

En contention, dégrader d’abord la sophistication ou la fréquence du rendu non canonique. Le sonore peut être suspendu ; le canon ne change pas.

## 10. Accessibilité

Pas de mode neuroA unique. Les axes de réglage sensoriel restent indépendants autant que possible et doivent permettre une réduction substantielle du rendu sans modifier les règles ni les droits de jeu.

Toute information critique possède un équivalent non sonore.

## 11. Références

Le corpus spécialisé est documenté dans [`26_univers_sonore_references_methode.md`](26_univers_sonore_references_methode.md). Les statuts **[RÉFÉRENCE]**, **[HYPOTHÈSE AVELUNE]**, **[TESTÉ]** et **[ACTÉ]** ne doivent jamais être confondus.

## 12. Hygiène CODEX et publication

Partageables : architecture nécessaire au développement commun, interfaces autorisées, méthode, références, gates, résultats suffisamment agrégés et budgets non révélateurs.

Les éléments internes ne sont **pas inventoriés** dans ce document. Leur simple existence, leur organisation ou leurs relations ne sont pas exposées lorsqu’elles ne sont pas nécessaires à la compréhension du contrat public.

Une information est classée avant synchronisation. Une vérité profonde du monde relève du CODEX approprié ; un savoir-faire technique propriétaire reste dans l’espace interne prévu pour les moteurs et recettes ; une interface nécessaire au développement partagé peut être publiée après expurgation. Il n’existe pas de « CODEX musical » créé par symétrie : le classement dépend de la nature de l’information.

GitHub est traité comme une surface de publication même lorsque le dépôt est privé.

## 13. Validation du cahier

Le cahier est suffisamment complet et réaliste pour démarrer parce que :

- le Cœur reste autonome ;
- les internes provisoires ne deviennent pas une API durable ;
- source, contrat, grammaire et renderer sont versionnés séparément ;
- les cadences peuvent être découplées ;
- l’état exposé est limité à ce qui est explicitement autorisé ;
- les ressources cumulées sont une gate ;
- l’accessibilité est structurelle ;
- les références sont traçables ;
- les migrations de frontière sont testables ;
- l’hygiène CODEX s’applique au contenu comme à la structure documentaire.

Ce verdict autorise **MUSIQUE-0 hors ligne**. Il n’autorise pas encore l’intégration live au Cœur canonique.

## 14. Première étape technique

1. maintenir un schéma d’enveloppe neutre `representation-semantic-v0` ;
2. créer trois fixtures synthétiques neutres A/B/C ;
3. créer un manifeste de corpus ;
4. valider mécaniquement ces fixtures contre le schéma ;
5. prouver qu’un lecteur factice peut les consommer sans connaissance du Cœur ;
6. seulement ensuite inspecter la forme réelle d’un export de campagne close afin de préparer un adaptateur privé.

Cette étape ne choisit aucun moteur audio et ne dépend d’aucun code du Cœur.