# PROTO-0.2 — Décisions nécessaires

Dernière revue : 2026-08-08 après le jalon `proto-0.2.0-tech`.

Les anciennes questions sur connexions directes, réseau productif, quatre familles de tours, captation/matière de vague, stockage natif, réserve énergétique courte et nombre fixe de trois vagues sont **closes ou hors périmètre** par les sources de rang supérieur.

Les décisions ci-dessous ne doivent pas être tranchées arbitrairement par Codex. Lorsqu’elles deviennent nécessaires à un sous-jalon, les résoudre par combinaison de simulation, prototype et playtest humain.

## Décisions déjà clarifiées

### Défense : quantité ou qualité

Statut : **ACTÉ**.

Le joueur choisit comment augmenter sa défense :

- multiplier les tours de base ;
- améliorer leur efficacité ;
- combiner les deux.

Aucune technologie ne doit être imposée artificiellement comme « bonne voie ». La stratégie de quantité doit être limitée par ses vrais coûts (ressources, temps de fabrication, débit, stockage, emplacements, coût d’opportunité), tandis que l’amélioration doit augmenter l’efficacité par ressource/cycle/emplacement.

### Durée du mini-jeu

Statut : **CADRÉ, NON CHIFFRÉ**.

Le run doit être court, rejouable et suffisamment long pour faire ressentir une progression et une fin. L’ancienne indication « 10–15 min » exprime une intention de format, pas une durée à imposer tant que le temps humain n’est pas mesuré.

Ne pas fixer arbitrairement le nombre de cycles ou de vagues à partir de cette estimation.

## Points ouverts pour PROTO-0.2.2 et suivants

### D-001 — Composition du kit initial
Statut : OPEN
Bloquant pour : PROTO-0.2.2
Non bloquant pour : PROTO-0.2.1

La baseline donne sept fonctions gratuites à implanter. La revue humaine montre que cela surcharge l’ouverture puis crée un creux artificiel.

À comparer :
- conserver le kit complet avec meilleure présentation ;
- réduire le kit et faire construire certaines fonctions avec les ressources d’amorçage ;
- autre composition minimale issue des simulations.

Critère : première défense accessible rapidement sans transformer l’ouverture en checklist.

### D-002 — Première confrontation
Statut : OPEN
Bloquant pour : PROTO-0.2.2
Non bloquant pour : PROTO-0.2.1

La première confrontation doit être précoce et pédagogique.

À trancher :
- impossible de perdre le run mais dégâts possibles ;
- absence totale de dégâts sur la première vague ;
- autre forme de protection pédagogique.

Préférence de travail actuelle : non létale mais avec conséquence possible, car elle enseigne mieux l’enjeu. À valider, pas à supposer.

### D-003 — Cadence exacte de la première vague
Statut : OPEN
Bloquant pour : équilibrage PROTO-0.2.2
Non bloquant pour : PROTO-0.2.1

Ne plus reprendre automatiquement « autour du cycle 6 ».

La première vague doit arriver rapidement après que le joueur a eu une possibilité réelle de préparer au moins une défense de base. Le cycle exact doit venir des tests de rythme.

### D-004 — Densité des gisements
Statut : OPEN
Bloquant pour : optimisation économique PROTO-0.2.2
Non bloquant pour : PROTO-0.2.1

Les gisements sont non épuisables et trop nombreux visuellement dans la baseline.

Hypothèse à tester : 2 organiques + 2 minéraux sur la carte actuelle.

Question sous-jacente : croissance économique par multiplication d’extracteurs, amélioration des extracteurs, ou équilibre des deux ?

### D-005 — Forme de l’amélioration défensive
Statut : OPEN
Bloquant pour : PROTO-0.2.3
Non bloquant pour : PROTO-0.2.1/0.2.2

Le principe « quantité ou qualité au choix du joueur » est acté. La matérialisation de la qualité ne l’est pas encore.

Options possibles :
- améliorer les tours existantes ;
- fabriquer un niveau supérieur de la même famille Affaiblissement ;
- combinaison des deux.

Ne pas créer une seconde famille de tour pour résoudre cette question.

### D-006 — Débit des ateliers et fabriques
Statut : OPEN
Bloquant pour : PROTO-0.2.3
Non bloquant pour : PROTO-0.2.1

Le développement du Corcite doit augmenter le nombre d’actions utiles et de productions possibles par cycle.

À mesurer : nombre de producteurs, temps de fabrication et capacités nécessaires pour éviter qu’un unique atelier/fabrique reste un goulet d’étranglement permanent.

### D-007 — Nombre typique de vagues / durée réelle
Statut : OPEN
Bloquant pour : PROTO-0.2.4
Non bloquant pour : PROTO-0.2.1 à 0.2.3

Mesurer avant de décider :
- durée jusqu’à la première défense ;
- durée jusqu’à la première vague ;
- nombre de décisions significatives par cycle ;
- nombre de vagues jusqu’à victoire/défaite ;
- durée totale nouveau joueur / joueur connaissant les règles.

### D-008 — Victoire immédiate à la première annulation
Statut : OPEN CONDITIONNEL
Bloquant pour : seulement si les playtests montrent des fins trop précoces
Non bloquant pour : tant que l’équilibrage raisonnable permet une progression intéressante

La règle active reste : Puissance résiduelle `0` → victoire immédiate du testeur.

Si les nouvelles défenses primaires permettent une victoire trop précoce malgré des coûts cohérents, réouvrir explicitement cette règle plutôt que truquer l’économie ou interdire arbitrairement des tours.

## Points futurs hors besoin immédiat

- Nature détaillée future de l’onde : composition et 4 à 6 caractéristiques à définir pour le jeu final, pas pour le challenge actif PROTO-0.2.
- Consommation exacte d’entretien d’une fonction OFF ou sans personnel si le comportement existant doit être réexaminé.
- Conséquence future d’une baisse externe de capacité énergétique sous la charge active.

## Format pour une nouvelle vraie décision

```text
## D-XXX — Titre court
Statut : OPEN
Bloquant pour : ...
Non bloquant pour : ...

Contexte
...

Option A
...

Option B
...

Conséquence technique
...

Conséquence joueur
...
```

Ne pas utiliser ce fichier pour les erreurs techniques, choix de refactor, CSS, tests, paramètres numériques de laboratoire ou autres décisions que `AGENTS.md` autorise Codex à prendre seul.
