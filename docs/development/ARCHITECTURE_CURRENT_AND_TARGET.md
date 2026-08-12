# Architecture actuelle et architecture cible

Statut : document normatif de développement.  
Mise à jour : 13 août 2026.

## 1. Principe général

Avelune ne doit plus être décrit comme une application monolithique unique. Trois chantiers ont des cycles de vie distincts :

```text
PROTO jouable              Cœur vivant                 Tableau Réel
validation UX/mécaniques   monde autonome headless     projet réel persistant
        |                         |                           |
        +----------- contrats / adaptateurs ----------------+
```

Aucun chantier ne doit dépendre du runtime éphémère d’un autre par simple commodité.

Les futurs rendus visuel et sonore constituent des **couches de représentation**, pas de nouveaux moteurs du monde ni de nouveaux axes runtime actuels.

Les choix transversaux de technologie, ressources, données et matériel suivent désormais la doctrine [Arbitrage transversal — pérennité, ressources et matériel](ARBITRATION_LONGEVITY_AND_RESOURCES.md).

## 2. PROTO jouable

La baseline intégrée à `main` conserve l’architecture PROTO-0.1 :

```text
Svelte UI
   ↓
contrôleur d'application
   ↓
corcite / turn / tf / rpg / td / wave
   ↓
domain + config
```

Le candidat courant PROTO-0.2.2 est développé sur `develop/proto-0.2.2-playtest`. Il ajoute le mini-jeu distribué, les sessions PostgreSQL et la couche de feedback.

Principes à préserver :

- `UI/API -> application -> domain/rules` ;
- les règles n’importent pas Svelte, HTTP ou PostgreSQL ;
- les simulations utilisent les mêmes règles que le runtime correspondant ;
- une nouvelle mécanique existe d’abord comme règle testable hors navigateur ;
- aucune intégration automatique d’un moteur du Cœur dans le PROTO.

## 3. Cœur vivant

Le Cœur est un moteur autonome du monde, séparé des PROTO.

Cible conceptuelle :

```text
moteurs du monde
      ↓
état canonique / substrat
      ↓
persistance + journal + snapshots
      ↓
simulateur accéléré / observabilité
      ↓
contrat sémantique de représentation
      ↓
interpréteurs indépendants
      ├─ visuel
      └─ sonore
```

Contraintes :

- aucun besoin d’UI ou d’audio pour faire évoluer le monde ;
- même logique pour laboratoire accéléré et futur runtime canonique ;
- persistance versionnée ;
- reprise/restauration/migrations testables ;
- les interpréteurs ne renvoient aucune décision vers le Cœur ;
- les rendus visuel et sonore sont remplaçables sans modifier l’histoire du monde ;
- les préférences d’accessibilité peuvent modifier un rendu sans modifier l’état canonique ;
- séparation stricte entre monde de laboratoire et future instance canonique.

### 3.1 Invariant de survie

**Avelune ne doit jamais dépendre pour sa survie d’un moteur chargé de la représenter.**

Une panne, suppression ou migration du visuel, du sonore, de l’Observatoire ou de la Console peut dégrader le service correspondant, mais ne doit ni arrêter ni falsifier l’évolution canonique si le Cœur et sa persistance sont sains.

Les technologies de représentation, y compris leurs éventuelles dépendances GPU, frameworks ou fournisseurs, restent hors du chemin de survie du Cœur. Voir [ADR-0003](adr/ADR-0003-CORE-REPRESENTATION-INDEPENDENCE.md).

### 3.2 Ressources et échelles de calcul

Toute charge importante doit être distinguée entre **permanente**, **périodique** et **à la demande**. Les charges permanentes doivent être mesurées en fonction des besoins réels : CPU, GPU, RAM, stockage, I/O, réseau, énergie, thermique et charge d’exploitation.

La cadence d’un calcul peut être adaptée à l’échelle temporelle du phénomène lorsqu’elle conserve les lois, invariants, causalités et résultats significatifs. La résolution maximale n’est pas un objectif autonome.

En cas de saturation, dégrader d’abord les représentations, analyses dérivées et services auxiliaires. Ne pas modifier silencieusement les lois du monde pour masquer une limite d’infrastructure et ne jamais inventer une évolution canonique côté client.

L’implémentation détaillée du laboratoire n’est pas stockée dans ce dépôt GitHub. Les correspondances exactes, seuils, temporalités, recettes de variabilité et causalités reliant les internes du Cœur aux représentations restent également hors dépôt.

Voir `docs/23_univers_sonore_contrat_public.md` pour le contrat partageable du futur interpréteur sonore.

## 4. Tableau Réel

Le Gate 0 impose une architecture autonome :

```text
sources (PROTO, instruments, saisies, facteurs)
                    ↓
             adaptateurs explicites
                    ↓
          registre persistant TA3
                    ↓
             agrégations
                    ↓
          interface publique TA3
```

Le Tableau Réel ne doit pas être une route qui dépend du conteneur ou de la base du PROTO pour exister.

Règles :

- stockage propre ;
- runtime propre ;
- import unidirectionnel des métriques PROTO ;
- historique conservé après disparition de la source ;
- aucune migration TA3 dans la base du PROTO ;
- une source absente rend une donnée inconnue/ancienne, pas le service indisponible ;
- pas de framework de plugins généraliste : petits adaptateurs explicites.

Voir `docs/real/`.

## 5. Architecture cible du jeu produit

Après validation des prototypes, la direction reste :

```text
app/src/lib/game/
  domain/          états, value objects, invariants
  rules/           TF, RPG, TD, vagues, conséquences
  application/     commandes et cas d'usage
  content/         interfaces et registre de contenu
  telemetry/       événements métier
  simulation/      runners déterministes

app/src/lib/server/
  api/
  persistence/
  content-loader/

app/src/lib/ui/
  views/
  components/
  stores/
  selectors/

app/content/
  schema/
  balance/
  buildings/
  recipes/
  research/
  td/
  waves/
  narrative/
  locales/
```

Cette cible ne justifie pas une réécriture prématurée. Une brique migre lorsqu’un besoin réel apparaît, avec tests de non-régression.

Le futur interpréteur sonore n’impose à ce stade aucun nouveau dossier, service ou framework dans cette cible : son emplacement concret sera décidé seulement lorsqu’un besoin d’implémentation aura été validé.

## 6. Dette d’interface

Les pages de prototype volumineuses sont une dette assumée tant que la boucle change rapidement. Lorsqu’un découpage devient utile, préférer :

- vues fonctionnelles ;
- composants de présentation ;
- selectors/view-models ;
- contrôleur d’application léger.

La page racine orchestre navigation, session et composition ; elle ne devient pas un second moteur de règles.

## 7. Dépôts et sources de vérité

- GitHub : code et documentation destinés au dépôt ;
- branche PROTO-0.2.2 : candidat jouable courant ;
- dépôt propriétaire séparé : laboratoire détaillé du Cœur ;
- stockage interne : informations d’exploitation, recettes de représentation et données non destinées au dépôt.

L’identité durable du monde doit rester reconstructible à partir de ses lois, données canoniques, contrats et spécifications versionnées ; elle ne doit pas être captive d’un moteur ou format de représentation particulier.

Un ancien clone ou worktree antérieur au nettoyage de l’historique GitHub doit être contrôlé avant de pouvoir redevenir une source de travail.
