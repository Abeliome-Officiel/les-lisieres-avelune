# Cœur vivant — contrat de lecture des modules

> **Statut : architecture partageable — v0.3**  
> Date : 18 août 2026  
> Ce document est l’autorité architecturale partageable pour la frontière **Cœur → modules**. Il décrit les garanties de raccordement sans exposer les structures, recettes, paramètres ou causalités propriétaires du Cœur.

## 1. Principe

Le Cœur d’une instance est l’autorité sur l’état canonique de ce monde. Les modules externes — Fenêtre sur la Lisière, visuel, sonore, Tableaux, panneaux et jeu — sont des **clients en aval**.

Ils ne doivent ni importer durablement les structures internes du Cœur, ni devenir nécessaires à sa survie, ni constituer une seconde autorité.

Architecture de référence :

```text
état privé du Cœur
        ↓
CœurReadAdapter
normalisation privée/versionnée
        ↓
modèle d’observation normalisé
PRIVÉ / interne
        ↓
allowlists spécialisées
        ├─ WorldReadEnvelope + VisualPayload
        ├─ WorldReadEnvelope + MusicPayload
        └─ autres projections futures
```

Il n’existe **ni un adaptateur VISUEL ni un adaptateur MUSIQUE relisant chacun les internes du Cœur**, ni un contrat public géant faisant l’union de toutes les données utiles à tous les clients.

Le noyau commun porte uniquement les primitives universelles d’identité, d’ordre, de temps, de source et de compatibilité. Chaque projection spécialisée reçoit ensuite seulement les données nécessaires à son rôle.

Le protocole de transport est distinct de la sémantique du contrat.

## 2. Responsabilité de la projection

Le `CœurReadAdapter` appartient au périmètre **CŒUR / intégration**, pas aux renderers.

Dans les laboratoires, il peut être un outil offline :

```text
artefact clos → CœurReadAdapter CLI → semantic replay
```

Plus tard, il pourra devenir une couche légère de publication en lecture seule contre un état **committé** du Cœur, sans accrocher un renderer ou un client réseau dans la boucle biologique.

L’interface historique `observer(state, events)` reste utile à l’instrumentation de laboratoire et possède des preuves de neutralité, mais elle n’est pas contractualisée comme API de production VISUEL/MUSIQUE.

## 3. WorldReadEnvelope v0.1 — noyau commun

Le noyau contractuel commun est conceptuellement :

```text
WorldReadEnvelope {
  contract_version
  projection_version
  world_instance_id
  source_kind
  stream_id
  canonicality
  state_revision
  canonical_age
  frame_kind
  payload
}
```

Pour la première version, les valeurs de `source_kind` couvrent au minimum :

```text
fixture | replay | lab_live | canonical_live
```

et `frame_kind` :

```text
snapshot | delta | event_batch
```

**REPLAY-0.1 utilise uniquement des snapshots complets.** Les deltas viennent après validation de la frontière et de la resynchronisation.

Le schéma partageable du noyau v0.1 est conservé sous `docs/contracts/world-read-envelope-v0.1.schema.json`.

## 4. Identité d’instance

`world_instance_id` est l’identité persistante et opaque d’un monde.

Règles actées :

- généré une seule fois pour une vraie instance ;
- non dérivé de la seed, du hostname ou de la date ;
- stable à travers redémarrage, migration et restauration contrôlée du même monde ;
- un clone destiné à une qualification destructive reçoit une **nouvelle** identité LAB ;
- un replay transporte l’identité du monde d’origine, mais possède son propre `replay_id` et son propre `stream_id`.

Une première implémentation peut utiliser UUIDv4.

Le nom humain d’un monde est une métadonnée distincte.

Pour les caches et mémoires de modules, `representation_id` seul ne suffit jamais : le namespace minimal inclut `world_instance_id`.

## 5. Révision canonique et temps

`state_revision` est un entier monotone identifiant l’ordre des états **committés**.

Il est distinct de :

```text
canonical_age
wall clock
SQLite rowid
publication sequence
```

La règle cible est :

```text
état committé N   → state_revision N
état suivant      → state_revision N+1
```

La révision doit être persistée atomiquement avec l’état qu’elle identifie.

`canonical_age` représente l’âge monotone du monde et reste indépendant du temps machine et du facteur réel ↔ canonique. Une représentation initiale explicite en heures canoniques est admise.

La politique d’arrêt du Cœur — pause de l’âge ou rattrapage déterministe — reste ouverte ; le contrat doit pouvoir représenter les deux sans changement de schéma.

## 6. Stream et canonicalité

`stream_id` identifie une session de publication. Il peut changer après redémarrage du publisher sans changer `world_instance_id`.

Un changement de `stream_id` signifie : **la session de transport a changé ; vérifier la continuité ou resynchroniser**.

Chaque source porte également une canonicalité explicite, avec une sémantique équivalente à :

```text
LAB | STAGING | CANONICAL
```

Une simulation ou un replay de laboratoire ne doit jamais être confondu avec l’histoire canonique d’une vraie Avelune.

## 7. Identifiants de représentation

Lorsqu’une continuité perceptive doit être exposée, l’adaptateur fournit des identifiants opaques :

- `representation_id` pour une entité/représentation autorisée ;
- `region_id` pour une région ou scène autorisée ;
- `event_id` pour un événement publiable.

Ces identifiants sont stables dans le scope du monde concerné et ne doivent pas encoder une sémantique biologique reconstructible.

La méthode de correspondance entre identité interne et identité de représentation reste avant la frontière partageable.

## 8. État, transition et événement

Le contrat distingue :

- **state** : propriété durable ;
- **transition** : changement entre deux états ;
- **event** : fait ponctuel canonique explicitement publiable.

Un client ne transforme pas arbitrairement toute différence numérique en événement.

Un événement publiable porte les primitives nécessaires à sa déduplication et à son ordre, ainsi qu’un payload allowlisté. Les causes internes, seuils, tirages ou paramètres réservés ne franchissent pas cette frontière.

## 9. Descripteurs perceptifs

Le contrat peut transporter, après allowlist :

- identité monde/région/représentation ;
- présence, apparition, disparition, persistance et transformation significative ;
- localisation ou portée autorisée ;
- descripteurs qualitatifs ou normalisés conçus pour la représentation ;
- révision et âge canonique ;
- changements observables explicitement publiables.

La liste exacte des descripteurs VISUEL/MUSIQUE n’est pas figée par ce document.

Une métrique scientifique n’est **pas** automatiquement une propriété artistique. Paramètres, seuils, coefficients, seed, RNG, diagnostics scientifiques, généalogie complète ou attributs permettant de reconstruire les recettes ne sont pas publiés par défaut.

## 10. Projections spécialisées

Le noyau commun ne doit pas devenir un « super-contrat » transportant tout ce qui pourrait intéresser tous les clients.

Répartition :

```text
CŒUR / intégration
- identité monde
- révision
- temps
- source / canonicalité
- ordre / resynchronisation
- primitives d’identité persistante
- faits canoniques publiables
- classification et frontière d’exposition

VISUEL
- VisualPayload
- grammaire visuelle
- continuité graphique
- renderer, LOD, accessibilité

MUSIQUE
- MusicPayload
- état perceptif musical
- mémoire
- grammaire, thèmes, composition
- renderer audio, accessibilité
```

Le Cœur peut refuser une donnée demandée si son exposition nécessiterait de publier un secret ou d’inventer un fait canonique.

## 11. Sources interchangeables

Un même client doit pouvoir fonctionner contre :

```text
fixture
replay
snapshot de test
LAB
production
```

sans modifier sa grammaire ou son renderer.

Pour un même état source `S`, la projection obtenue par replay et par source LAB/live simulée doit être sémantiquement équivalente après exclusion des seules métadonnées de transport :

```text
semantic_hash(P_replay) == semantic_hash(P_live)
```

Le client peut connaître `source_kind`, mais aucune décision de rendu ne dépend de ce choix.

## 12. Avelune Semantic Replay v0.1

Le format de replay sémantique de laboratoire est :

```text
replay/
├── manifest.json
├── frames.ndjson
└── checksums.sha256
```

Le manifeste décrit notamment : version de format/contrat/projection, classification, source, canonicalité, `world_instance_id`, `replay_id`, `stream_id`, nombre de frames, premières/dernières révisions et positions canoniques, version d’adaptateur et empreintes des fichiers.

Les métadonnées de provenance propriétaires restent dans une variante PRIVATE et n’ont aucune raison d’être présentes dans un replay SHAREABLE.

`frames.ndjson` contient une projection complète par ligne pour REPLAY-0.1.

Voir `docs/contracts/avelune-semantic-replay-v0.1.md`.

Deux catégories ne doivent jamais être confondues :

1. **raw/private observer replay** : données internes, source de conversion uniquement ;
2. **semantic replay** : sortie du `CœurReadAdapter` + allowlist, seule catégorie durable consommée par VISUEL/MUSIQUE.

## 13. Snapshots, deltas et resynchronisation

Le modèle de production cible reste :

```text
snapshot complet cohérent
        ↓
changements ordonnés
        ↓
trou / désordre / nouvelle session
        ↓
RESYNC_REQUIRED
        ↓
nouveau snapshot complet
```

Un futur delta porte `base_revision=N` et `state_revision=N+1`. Il est applicable seulement si `local_revision == base_revision`.

Le client ne fabrique jamais une révision absente.

## 14. Cadence

La cadence finale de publication reste ouverte. Le modèle cible est hybride : périodique + événementiel.

Budget de conception provisoire, **pas un SLA** : les clients doivent tolérer aussi bien des rafales allant jusqu’à environ une frame sémantique par seconde que plusieurs dizaines de secondes ou minutes sans changement significatif.

Le Cœur ne change jamais sa cadence biologique pour satisfaire une animation ou une musique. Les modules interpolent et temporisent localement sans inventer de faits canoniques.

## 15. Volume — budget de conception

La taille finale n’est pas connue. Pour éviter de supposer un monde minuscule, les projections de scène/région doivent rester robustes à des ordres de grandeur allant approximativement de `10²` à `10⁴` éléments sémantiques potentiels.

Une vue normale doit chercher des snapshots compacts et des deltas nettement plus petits. Ces valeurs sont des budgets de conception, pas des capacités promises du Cœur.

## 16. Classification

### SHAREABLE

Peut comprendre les primitives contractuelles et les identifiants/descripteurs explicitement allowlistés nécessaires au rôle du client.

### PRIVATE

Contient par défaut les sources brutes, identités internes, configuration, seeds, instrumentation scientifique, mappings privés, stockage brut, provenance propriétaire et diagnostics causaux.

### CODEX

Aucun contenu CODEX ne doit être nécessaire au fonctionnement normal de VISUEL ou MUSIQUE. Si un renderer a besoin d’un champ CODEX, la frontière est incorrecte.

Un artefact de replay possède une classification homogène. Une version SHAREABLE est produite explicitement par allowlist ; elle n’est pas un replay PRIVATE avec quelques champs « cachés ».

## 17. Lecture seule en v1.0

Pour la v1.0, la frontière avec la biologie est unidirectionnelle :

```text
Cœur autonome → état canonique → contrat de lecture → modules
```

Les actions de gameplay d’un Corcite ne sont pas renvoyées vers la biologie du Cœur dans cette version.

## 18. Dégradation et indépendance

La panne, le remplacement ou l’arrêt d’un module externe ne doit pas arrêter un Cœur sain ni modifier sa trajectoire.

Si un client perd le flux, il peut conserver le dernier état validé, dégrader sa représentation et demander une resynchronisation. Il ne crée pas un nouvel état canonique local.

## 19. Gates avant branchement live

Avant raccordement durable :

1. l’adaptateur ne modifie pas le state ;
2. aucun champ privé non allowlisté ne sort ;
3. `world_instance_id` est vérifié de bout en bout ;
4. `state_revision` est monotone et correctement persisté ;
5. resynchronisation par snapshot fonctionnelle ;
6. trou de delta détecté ;
7. replay/live sémantiquement équivalents ;
8. renderer arrêté → Cœur inchangé ;
9. publisher arrêté → Cœur inchangé ;
10. source A ne peut pas alimenter silencieusement cache/mémoire B ;
11. version incompatible → échec explicite, aucune approximation silencieuse ;
12. coût de publication/consommation mesuré avec les composants réellement concurrents.

## 20. Restrictions de qualification opérationnelle

Pendant un soak dont le protocole a été figé avant T0, aucun nouveau consommateur, observer, service de publication ou benchmark de représentation ne doit être ajouté en cours de route.

VISUEL/MUSIQUE travaillent alors sur documentation, fixtures, code offline et artefacts clos. Les composants destinés à participer à un futur soak de capacité doivent être définis et gelés **avant** son démarrage.

## 21. Fenêtre, sonore et autres modules

La Fenêtre sur la Lisière est destinée à être le premier consommateur permanent privilégié de cette frontière. Le sonore, les Tableaux, panneaux et futurs clients suivent ensuite la même discipline de raccordement.

VISUEL et MUSIQUE peuvent être artistiquement coordonnés, mais restent indépendants :

```text
Cœur → contrat commun → VISUEL
                    └→ MUSIQUE
```

et jamais :

```text
Cœur → VISUEL → MUSIQUE
Cœur → MUSIQUE → VISUEL
```

## 22. Frontière de confidentialité

GitHub peut documenter l’existence du contrat, ses propriétés, ses versions, ses tests, les identités opaques nécessaires à l’interopérabilité, les formats de replay partageables et les catégories sémantiques autorisées.

Restent hors dépôt les détails permettant de reconstruire les mécanismes du Cœur : champs sources privés, mappings exacts, paramètres, seeds, seuils, recettes, causalités réservées, instrumentation brute et background confidentiel non nécessaire à l’architecture publique.
