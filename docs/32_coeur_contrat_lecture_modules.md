# Cœur vivant — contrat de lecture des modules

> **Statut : architecture partageable — v0.5**  
> Date : 21 août 2026  
> Ce document est l’autorité architecturale partageable pour la frontière **Cœur → modules**. Il décrit les garanties de raccordement sans exposer les structures, recettes, paramètres ou causalités propriétaires du Cœur.

## 1. Principe

Le Cœur d’une instance est l’autorité sur l’état canonique de ce monde. Les modules externes — Fenêtre sur les Avelunes, visuel, sonore, Tableaux, panneaux et jeu — sont des **clients en aval**.

Ils ne doivent ni importer durablement les structures internes du Cœur, ni devenir nécessaires à sa survie, ni constituer une seconde autorité.

Architecture qualifiée offline :

```text
état privé du Cœur
        ↓
P1 / normalisation privée et source
        ↓
ReadSession
        ↓
ReadSessionItem
├─ WorldReadEnvelope
└─ ContinuityDecision
        ↓
   ┌────┴────┐
   ↓         ↓
 P5A       P5B
visuel    sonore
   └────┬────┘
        ↓
P6 — Fenêtre sur les Avelunes
```

Le protocole de transport est distinct de la sémantique du contrat.

## 2. Autorités et responsabilités

La frontière durable sépare explicitement :

```text
P0 / Cœur
- état canonique
- identité canonique du monde
- révision canonique
- âge canonique

P1 / Lecteur
- projection de lecture
- session de lecture
- ordre de publication
- continuité
- doublons / gaps
- changement de stream
- changement de monde
- resynchronisation
- qualification de l’historique exploitable

P5A / Visuel
- interprétation visuelle de la projection autorisée
- continuité perceptive locale
- renderer et qualité de présentation

P5B / Sonore
- interprétation musicale de la projection autorisée
- mémoire musicale bornée
- composition et rendering

P6 / Fenêtre
- assemblage de sorties qualifiées
- lifecycle d’observation
- accessibilité et présentation
```

**P1 est l’unique autorité de continuité.** Les consommateurs peuvent vérifier la forme et les invariants locaux de leurs données, mais ils ne recalculent pas une seconde décision de continuité à partir de `publication_seq`, `state_revision`, `canonical_age`, timestamps ou identifiants d’événements.

## 3. ReadSessionItem — frontière convergée

La forme de consommation durable qualifiée offline est conceptuellement :

```text
ReadSessionItem {
  frame: WorldReadEnvelope,
  continuity: ContinuityDecision
}
```

`WorldReadEnvelope` transporte l’état/projection et les primitives communes. `ContinuityDecision` transporte la décision P1 sur la continuité de publication.

Les surfaces historiques ou de compatibilité propres à un module ne deviennent pas la frontière d’intégration simplement parce qu’elles restent présentes dans son code.

## 4. WorldReadEnvelope — noyau commun

Le noyau contractuel commun comprend conceptuellement :

```text
WorldReadEnvelope {
  contract_version
  projection_version
  world_instance_id
  source_kind
  stream_id
  canonicality
  publication_seq
  state_revision
  canonical_age
  frame_kind
  payload
}
```

Les valeurs exactes du schéma sont versionnées dans `docs/contracts/`.

Pour la première famille de contrats, `source_kind` couvre les sources de fixture, replay, LAB et live canonique. `frame_kind` distingue les formes de publication autorisées par la version de contrat.

## 5. Identité d’instance

`world_instance_id` est l’identité persistante et opaque d’un monde.

Règles :

- généré une seule fois pour une vraie instance ;
- non dérivé de la seed, du hostname, du chemin, du process ou de la date ;
- stable à travers redémarrage, migration et restauration contrôlée du même monde ;
- un clone destiné à une qualification destructive reçoit une nouvelle identité LAB ;
- le nom humain d’un monde est une métadonnée distincte.

Pour les caches et mémoires de modules, `representation_id` seul ne suffit jamais : le namespace minimal inclut `world_instance_id`.

P0-AUTH a qualifié cette identité côté autorité canonique. Lors d’une création orchestrée, l’identité provisionnée par P3 et celle portée par P0 doivent correspondre exactement ; une divergence est bloquante.

## 6. Révision canonique et ordre de publication

`state_revision` identifie l’ordre des états **committés** du Cœur. Il reste distinct de :

```text
canonical_age
publication_seq
wall clock
version de schéma
SQLite rowid
identifiant d’événement
```

`publication_seq` appartient à la publication P1 et n’est pas une révision canonique du monde.

Conséquence qualifiée : un saut de `state_revision` n’est **pas automatiquement** un gap de publication. La continuité est décidée par P1 à partir de son contrat de session, pas par les renderers.

P0-AUTH qualifie `state_revision` comme un entier monotone de commit canonique. La manière exacte dont P0 stocke et incrémente cette valeur reste privée et n’est pas une dépendance des clients.

## 7. canonical_age

La **forme publique de transport qualifiée** reste une **chaîne décimale exacte**.

Exemples de forme :

```text
"100"
"100.25"
"0.0001"
```

Cette forme évite les pertes de précision et n’impose aucune représentation numérique flottante aux consommateurs.

P0-AUTH qualifie désormais les garanties sémantiques suivantes :

- `canonical_age` appartient au même commit autoritatif que `world_instance_id`, `state_revision` et l’état vivant ;
- sa valeur est exacte et sa progression active suit exactement le delta de temps biologique logique du commit ;
- un offset décimal exact peut être conservé sans dérive ;
- si le **Cœur lui-même** est arrêté, la politique qualifiée est `PAUSE` : le temps mural d’indisponibilité ne crée pas de vieillissement canonique ;
- un client n’infère ni âge manquant, ni rattrapage, ni progression locale.

Le contrat de lecture ne fixe toujours pas :

- la primitive de stockage interne utilisée par P0 ;
- une notion publique de `canonical_hour` ;
- le facteur temps réel ↔ temps canonique de présentation ou d’exploitation ;
- la manière dont l’UX traduit cet âge pour un humain.

Ces choix restent distincts du transport. Ils sont versionnés lorsqu’ils deviennent nécessaires et ne sont jamais inventés par P1, P5 ou P6.

## 8. ContinuityDecision

`ContinuityDecision` appartient à P1 et exprime les décisions nécessaires à une consommation sûre : continuité, duplicate, gap, nouvelle session, changement de monde/stream, resynchronisation et qualification de l’historique lorsque nécessaire.

`event_history_exhaustive`, lorsqu’il est nécessaire à un consommateur, relève de cette décision de continuité P1 ; il n’est pas ré-inféré par P5B ou P6.

## 9. Matrice transverse C01–C08

Le gate PRE-P6 du 21 août 2026 a qualifié la compatibilité P1/P5A/P5B sur la matrice suivante :

- **C01** — premier snapshot ;
- **C02** — publication contiguë ;
- **C03** — saut de `state_revision` sans gap de publication ;
- **C04** — duplicate `publication_seq` rejeté par P1 ;
- **C05** — gap de publication ;
- **C06** — reprise contiguë sans invention d’un historique perdu ;
- **C07** — changement de stream → nouvelle session ;
- **C08** — changement de monde → nouvelle session.

Verdict : **PASS**.

## 10. État, transition et événement

Le contrat distingue :

- **state** : propriété durable ;
- **transition** : changement entre deux états ;
- **event** : fait ponctuel canonique explicitement publiable.

Un client ne transforme pas arbitrairement toute différence numérique en événement.

Un événement publiable porte uniquement les primitives nécessaires à son rôle et un payload allowlisté. Les causes internes, seuils, tirages ou paramètres réservés ne franchissent pas cette frontière.

## 11. Identifiants et descripteurs de représentation

Lorsqu’une continuité perceptive doit être exposée, la projection peut fournir des identifiants opaques tels que :

- `representation_id` pour une entité/représentation autorisée ;
- `region_id` pour une région ou scène autorisée ;
- `event_id` pour un événement publiable.

Ces identifiants sont stables dans le scope du monde concerné et ne doivent pas encoder une sémantique biologique reconstructible.

Une métrique scientifique n’est **pas** automatiquement une propriété artistique. Paramètres, seuils, coefficients, seed, RNG, diagnostics scientifiques, généalogie complète ou attributs permettant de reconstruire les recettes ne sont pas publiés par défaut.

## 12. Projections spécialisées

Le noyau commun ne devient pas un « super-contrat » transportant tout ce qui pourrait intéresser tous les clients.

La convergence qualifiée utilise des projections spécialisées distinctes pour le visuel et le sonore. P5A et P5B consomment directement leur forme convergée sans qu’une couche de réparation spécifique à P6 soit nécessaire.

```text
P6_TRANSLATION_REQUIRED=NO
P6_CONTRACT_REPAIR_REQUIRED=NO
```

Les mappings exacts Cœur → descripteurs perceptifs restent avant la frontière de publication lorsqu’ils sont propriétaires.

## 13. Sources interchangeables

Un même client doit pouvoir fonctionner contre des fixtures, replays, sources LAB et sources live autorisées sans modifier sa grammaire ou son renderer.

Le client peut connaître `source_kind`, mais aucune décision sur la vérité canonique ne dépend de cette seule valeur.

Pour un même état source, la projection obtenue par replay et par source live doit être sémantiquement équivalente après exclusion des seules métadonnées de transport.

## 14. Replays sémantiques

Le format de replay sémantique partageable reste versionné sous `docs/contracts/`.

Deux catégories ne doivent jamais être confondues :

1. **raw/private observer replay** : données internes, source éventuelle de conversion uniquement ;
2. **semantic replay** : sortie allowlistée, seule catégorie durable consommée par les modules partageables.

Les métadonnées de provenance propriétaires restent hors replay SHAREABLE.

## 15. Snapshots, gaps et resynchronisation

Le modèle de production cible reste :

```text
état cohérent publié
        ↓
publications ordonnées
        ↓
trou / désordre / nouvelle session
        ↓
décision P1
        ↓
resynchronisation lorsque requise
        ↓
nouvel état cohérent
```

Le client ne fabrique jamais une révision ou un historique absent.

## 16. Cadence

La cadence finale de publication reste une propriété de l’intégration et ne doit jamais imposer la cadence biologique du Cœur.

Les modules interpolent et temporisent localement sans inventer de faits canoniques.

Les budgets de cadence restent des budgets de conception tant qu’un SLA réel n’a pas été qualifié.

## 17. Volume et coût

La taille finale du monde n’est pas supposée petite. Les projections doivent rester compactes, versionnées et mesurables.

Le coût pertinent est le coût cumulé du Cœur, du Lecteur et des consommateurs réellement actifs dans une configuration gelée, pas un benchmark isolé d’un renderer.

## 18. Classification

### SHAREABLE

Peut comprendre les primitives contractuelles et les identifiants/descripteurs explicitement allowlistés nécessaires au rôle du client.

### PRIVATE

Contient par défaut les sources brutes, identités internes, configuration, seeds, instrumentation scientifique, mappings privés, stockage brut, provenance propriétaire et diagnostics causaux.

### CODEX

Aucun contenu CODEX ne doit être nécessaire au fonctionnement normal de VISUEL ou MUSIQUE. Si un renderer a besoin d’un champ CODEX, la frontière est incorrecte.

Un artefact SHAREABLE est produit explicitement par allowlist ; ce n’est pas un artefact PRIVATE dont quelques champs auraient simplement été masqués.

## 19. Lecture seule en v1.0

Pour la v1.0, la frontière avec la biologie est unidirectionnelle :

```text
Cœur autonome → état canonique → P1 → modules
```

Les actions de gameplay d’un Corcite ne sont pas renvoyées vers la biologie du Cœur dans cette version.

## 20. Dégradation et indépendance

La panne, le remplacement ou l’arrêt d’un module externe ne doit pas arrêter un Cœur sain ni modifier sa trajectoire.

Si un client perd le flux, il peut conserver le dernier état validé comme stale explicite, dégrader sa représentation et attendre la resynchronisation décidée par P1. Il ne crée pas un nouvel état canonique local.

Visuel et sonore restent indépendants : une panne de l’un ne doit pas imposer l’arrêt de l’autre.

## 21. Gates avant branchement live

Les deux premières conditions ont été qualifiées par P0-AUTH :

- [x] P0 fournit un état committé autoritatif cohérent ;
- [x] les métadonnées d’identité/révision/âge correspondent au même commit canonique que l’état.

**CREAD-LIVE** doit maintenant qualifier la frontière réelle P0 → P1 :

1. l’adaptateur/lecteur ne modifie pas l’état ;
2. aucun champ privé non allowlisté ne sort ;
3. `world_instance_id` est vérifié de bout en bout ;
4. continuité, duplicate, gap, changement de stream/monde et resynchronisation restent autorité P1 ;
5. replay/live sont sémantiquement équivalents ;
6. renderer arrêté → Cœur inchangé ;
7. publisher/lecteur arrêté → Cœur inchangé ;
8. source A ne peut pas alimenter silencieusement cache/mémoire B ;
9. version incompatible → échec explicite, aucune approximation silencieuse ;
10. coût de publication/consommation est mesuré avec les composants réellement concurrents.

Aucune de ces gates n’autorise un accès direct au stockage privé du Cœur.

## 22. Statut PRE-P6, P0 et suite

Le gate transverse P1↔P5A↔P5B est clos :

```text
TRANSVERSE_P1_P5A_P5B_FORMAL_GATE=PASS
CONTRACT_READY_FOR_P6_1=YES
PRE_P6_TRANSVERSE=CLOSED
```

P0 et les gates opérationnelles immédiates sont également clos :

```text
P0_AUTH=PASS
BIOLOGICAL_RNG_NEUTRALITY=PASS
O2_CLEAN_RESTART=PASS
O3_CRASH_ATOMICITY=PASS
O4_DOWNTIME_POLICY=PAUSE
```

Cette fermeture autorise le **travail P6 offline** mais pas le raccord live :

```text
P6_OFFLINE_FOUNDATION_CONTRACT_READY=YES
P6_OFFLINE_WORK=AUTHORIZED
P6_LIVE_INTEGRATION=WAIT_CREAD_LIVE
P6_LIVE_AUTHORIZED=NO
```

La chaîne amont restante vers le live est désormais :

```text
CREAD-LIVE
  ↓
OBS-1 / ORCH-1 selon dépendances
  ↓
O5-MIGRATION
  ↓
raccords live aval
```

**O5-MIGRATION reste obligatoire** avant la qualification intégrée finale : la migration LAB devra préserver `world_instance_id` et le canon sans maintenir deux autorités actives.

Voir également `docs/development/P0_AUTH_CLOSURE_2026-08-21.md` et `docs/development/PRE_P6_TRANSVERSE_2026-08-21.md`.

## 23. Frontière de confidentialité

GitHub peut documenter l’existence du contrat, ses propriétés, ses versions, ses tests, les identités opaques nécessaires à l’interopérabilité, les formats de replay partageables et les catégories sémantiques autorisées.

Restent hors dépôt les détails permettant de reconstruire les mécanismes du Cœur : champs sources privés, mappings exacts, paramètres, seeds, seuils, recettes, causalités réservées, instrumentation brute, structure de stockage interne, états RNG et background confidentiel non nécessaire à l’architecture partageable.
