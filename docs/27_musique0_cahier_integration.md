# MUSIQUE-0 — cahier des charges d’intégration

> **Statut : préproduction partageable — v0.1**  
> **Verdict : VERT pour un laboratoire hors ligne.**  
> Aucun moteur audio final, aucune intégration live au Cœur et aucune recette de traduction propriétaire ne sont actés par ce document.

## 1. Objectif

MUSIQUE-0 doit permettre de prototyper la musique évolutive d’Avelune avant que le Cœur soit terminé **sans créer une dépendance qui imposerait une réécriture lors du branchement final**.

La règle centrale est :

> **la grammaire musicale ne dépend jamais directement des structures internes d’une révision du Cœur.**

Toute dépendance à la source est confinée dans un adaptateur remplaçable.

## 2. Architecture anti-réécriture

```text
Cœur / export / replay / fixture
            ↓
   adaptateur de source
            ↓
 projection sémantique autorisée
            ↓
 contrat sémantique versionné
            ↓
     état musical abstrait
            ↓
 grammaire / compositeur Avelune
            ↓
    renderer audio remplaçable
            ↓
   préférences sensorielles
```

Les fixtures synthétiques, les replays de laboratoire et le futur Cœur actif doivent devenir interchangeables **à partir du contrat sémantique**.

Le Cœur ne connaît ni instruments, synthèse, motifs, moteur audio ou préférences sensorielles. Le renderer ne connaît ni tables, classes, colonnes, coefficients ou paramètres privés du Cœur.

## 3. Responsabilités

- **Cœur** : produit les faits canoniques et l’histoire ;
- **projection/adaptateur** : transforme une source/version vers la sémantique autorisée ;
- **contrat** : décrit le sens des données nécessaires à une représentation, pas les internes du moteur ;
- **grammaire musicale** : traduit le sens en comportements musicaux ;
- **renderer** : matérialise ces comportements en audio ;
- **accessibilité** : transforme ou simplifie le rendu sans modifier le canon.

Le protocole de transport est distinct du contrat. Le LAB lit d’abord des fichiers ; la production pourra employer un transport réseau différent sans modifier la grammaire tant que la sémantique reste compatible.

## 4. Versions indépendantes

Maintenir séparément :

1. version de la source/Cœur ;
2. version de l’adaptateur et du contrat ;
3. version de la grammaire musicale ;
4. version du renderer.

Une évolution interne du Cœur qui conserve la même signification est absorbée par l’adaptateur. Si la signification elle-même change, le contrat évolue explicitement et sa compatibilité est testée.

## 5. Contrat sémantique v0

Le premier contrat est volontairement petit et expérimental. Il prévoit au minimum :

- identifiant et version du contrat ;
- type et version de source ;
- version d’adaptateur ;
- identifiant de replay ou de flux ;
- numéro de séquence ;
- temps logique ;
- portée monde/région ;
- état complet resynchronisable ;
- descripteurs sémantiques autorisés ;
- marqueurs d’événements autorisés ;
- extensions versionnées ;
- validation de schéma.

Le contrat ne contient aucune formule d’extraction et aucune liste de champs privés du Cœur.

Le schéma technique initial est conservé sous `docs/contracts/representation-semantic-v0.schema.json`.

## 6. Replays et fixtures

Chaque replay est accompagné d’un manifeste contenant au minimum : identifiant, provenance, version de source, version d’adaptateur, version du contrat, période logique, portée, checksum, classification et notes d’usage.

Le corpus initial doit couvrir au moins :

- stabilité relative ;
- perturbation ;
- récupération ;
- divergence spatiale/régionale ;
- renouvellement/turnover ;
- comparaison contrôle/candidat lorsque disponible.

Les trois premières fixtures sont **synthétiques** et ne constituent donc ni une vérité du Cœur ni une publication de données privées.

## 7. Grammaire musicale minimale

Le laboratoire pourra explorer des axes musicaux tels que densité, tension/résolution, registre, richesse timbrale, activité rythmique, mémoire/persistance, vitesse de transformation et silence.

Ces axes sont des propriétés musicales, pas des variables canoniques. Les mappings, seuils, lissages, hystérésis, temporalités et signatures restent hors GitHub lorsqu’ils deviennent des recettes propres à Avelune.

## 8. Gates

### G0 — Documentation
Architecture, frontière public/secret, références et protocole présents.

### G1 — Contrat
Le schéma v0 accepte les fixtures synthétiques sans importer le Cœur.

### G2 — Adaptateur
Deux sources ou deux versions simulées peuvent produire le même contrat sans modifier la grammaire.

### G3 — Replay
Un replay + manifeste est validable, versionné et vérifiable.

### G4 — Renderer
Un renderer factice puis un renderer sonore peuvent consommer la même sortie de grammaire sans changement du Cœur.

### G5 — Perception
Des trajectoires différentes produisent des différences perceptibles mais cohérentes et la longue durée reste contemplative.

### G6 — Accessibilité
Le rendu peut être fortement simplifié sans supprimer d’information fonctionnelle critique.

### G7 — Ressources
Le coût isolé est connu, puis la charge cumulée est mesurée avec les briques réellement concurrentes.

### G8 — Branchement
Un replay peut être remplacé par un flux simulé respectant le même contrat sans modifier la grammaire.

Une gate échouée ne peut pas être contournée par un accès direct aux internes du Cœur.

## 9. Charge machine

Le budget final n’est jamais celui de la musique seule.

- côté navigateur : jeu + visuel + audio + accessibilité + réseau ;
- côté serveur : Cœur/backend + services réellement colocalisés ;
- côté laboratoire : campagne scientifique et expériences de représentation restent séparées par défaut.

Mesurer selon le domaine : CPU, GPU, RAM, I/O, stockage, réseau, énergie et thermique, en régime normal et aux pointes plausibles.

En contention, dégrader d’abord densité, nombre de couches, spatialisation, qualité de synthèse ou fréquence de régénération. Le sonore peut être suspendu ; le canon ne change pas.

## 10. Accessibilité

Pas de mode neuroA unique. Les axes de réglage envisagés restent indépendants autant que possible : transitoires, dynamique, densité, répétition, fréquence de variation, basses, aigus, spatialisation, sons ponctuels, complexité rythmique, couches simultanées, sons d’interface et silence.

Toute information critique possède un équivalent non sonore.

## 11. Références

Le corpus spécialisé est documenté dans [`26_univers_sonore_references_methode.md`](26_univers_sonore_references_methode.md). Les statuts `[RÉFÉRENCE]`, `[HYPOTHÈSE AVELUNE]`, `[TESTÉ]` et `[ACTÉ]` ne doivent jamais être confondus.

## 12. Frontière public / secret

**Partageable :** architecture, contrat abstrait, format de replay, méthode, références, gates, résultats agrégés et budgets non révélateurs.

**Secret :** champs sources exacts, extraction, fonctions de mapping, seuils, lissage, hystérésis, temporalités, seeds, signatures, règles de motifs, causalités et indices narratifs.

## 13. Validation du cahier

Le cahier est suffisamment complet et réaliste pour démarrer parce que :

- le Cœur reste autonome ;
- les internes provisoires ne deviennent pas une API durable ;
- sources, grammaire et renderer sont remplaçables ;
- le contrat est versionné ;
- les cadences peuvent être découplées ;
- la projection de publication filtre les secrets ;
- les ressources cumulées sont une gate ;
- l’accessibilité est structurelle ;
- les références sont traçables ;
- les migrations du contrat sont testables.

Ce verdict autorise **MUSIQUE-0 hors ligne**. Il n’autorise pas encore l’intégration live au Cœur canonique.

## 14. Première étape technique

1. créer le schéma `representation-semantic-v0` ;
2. créer trois fixtures synthétiques : stabilité, perturbation, récupération ;
3. créer leur manifeste ;
4. valider leur structure ;
5. seulement ensuite écrire l’adaptateur d’un premier export de campagne close.

Cette étape ne choisit aucun moteur audio et ne dépend d’aucun code du Cœur.
