# ADR-0003 - Garder le Cœur indépendant de ses représentations

Statut : accepté le 13 août 2026.

## Contexte

Avelune doit pouvoir faire évoluer un monde canonique pendant une durée indéterminée, tandis que ses couches visuelles, sonores, d’observation et d’administration pourront changer plusieurs fois de technologies, de machines et de niveau de service.

Coupler la continuité du Cœur à un moteur de rendu, un framework ou un matériel spécialisé créerait un risque de pérennité et rendrait les migrations futures inutilement dangereuses.

## Décision

Retenir l’architecture :

```text
Cœur vivant
    ↓
état canonique / persistance
    ↓
contrat sémantique versionné
    ↓
interpréteurs et services indépendants
```

Le Cœur ne dépend pas d’un interpréteur visuel, sonore, de l’Observatoire, de la Console ni d’un futur moteur de représentation pour calculer ou préserver l’histoire canonique.

Les technologies de représentation sont remplaçables. Une indisponibilité de représentation doit conduire à un mode dégradé ou à une interruption de cette représentation, jamais à l’invention d’une évolution canonique alternative.

## Conséquences

- un moteur visuel ou sonore peut être remplacé sans réécrire l’histoire du monde ;
- les besoins GPU ou audio ne deviennent pas automatiquement des besoins du Cœur ;
- l’accessibilité peut modifier les rendus sans altérer l’état canonique ;
- les contrats entre Cœur et interpréteurs doivent être explicites et versionnés ;
- les dépendances propriétaires d’un rendu ne doivent pas pénétrer le chemin de survie canonique ;
- en cas de pénurie de ressources, les fonctions non canoniques sont dégradées avant les lois du monde ;
- les décisions de matériel et de capacité peuvent être prises séparément pour le Cœur et pour ses représentations.

Voir aussi `../ARBITRATION_LONGEVITY_AND_RESOURCES.md`.
