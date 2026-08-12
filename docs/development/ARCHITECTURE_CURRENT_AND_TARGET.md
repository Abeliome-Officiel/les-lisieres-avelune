# Architecture actuelle et architecture cible

Statut : document normatif de développement.  
Mise à jour : 12 août 2026.

## 1. Principe général

Avelune ne doit plus être décrit comme une application monolithique unique. Trois chantiers ont des cycles de vie distincts :

```text
PROTO jouable              Cœur vivant                 Tableau Réel
validation UX/mécaniques   monde autonome headless     projet réel persistant
        |                         |                           |
        +----------- contrats / adaptateurs ----------------+
```

Aucun chantier ne doit dépendre du runtime éphémère d’un autre par simple commodité.

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
rendu éventuel
```

Contraintes :

- aucun besoin d’UI pour faire évoluer le monde ;
- même logique pour laboratoire accéléré et futur runtime canonique ;
- persistance versionnée ;
- reprise/restauration/migrations testables ;
- rendu graphique remplaçable sans modifier l’histoire du monde ;
- séparation stricte entre monde de laboratoire et future instance canonique.

L’implémentation détaillée du laboratoire n’est pas stockée dans ce dépôt GitHub.

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
- stockage interne : informations d’exploitation et données non destinées au dépôt.

Un ancien clone ou worktree antérieur au nettoyage de l’historique GitHub doit être contrôlé avant de pouvoir redevenir une source de travail.
