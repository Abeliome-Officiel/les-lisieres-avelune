# ADR-0003 - Garder le Cœur indépendant de ses représentations

Statut : accepté le 13 août 2026 ; complété le 13 août 2026 pour le développement anticipé des interpréteurs.

## Contexte

Avelune doit pouvoir faire évoluer un monde canonique pendant une durée indéterminée, tandis que ses couches visuelles, sonores, d’observation et d’administration pourront changer plusieurs fois de technologies, de machines et de niveau de service.

Coupler la continuité du Cœur à un moteur de rendu, un framework ou un matériel spécialisé créerait un risque de pérennité et rendrait les migrations futures inutilement dangereuses.

Un second risque apparaît lorsqu’un interpréteur est développé avant stabilisation complète du Cœur : s’il lit directement les tables, classes ou variables d’une révision de laboratoire, une évolution normale du Cœur peut imposer une réécriture du rendu. L’anticipation n’est donc acceptable que si la frontière est prouvée dès le premier prototype.

Un troisième risque est de transmettre au client davantage d’état que nécessaire puis de compter sur l’interface pour le masquer. Le navigateur doit être traité comme un environnement observable par son utilisateur : les informations privées ne doivent donc pas y être envoyées sans nécessité.

## Décision

Retenir l’architecture :

```text
Cœur vivant / replay de laboratoire
    ↓
état canonique / persistance
    ↓
adaptateur privé de version
    ↓
projection sémantique autorisée
    ↓
contrat sémantique versionné
    ↓
interpréteurs et services indépendants
```

Le Cœur ne dépend pas d’un interpréteur visuel, sonore, de l’Observatoire, de la Console ni d’un futur moteur de représentation pour calculer ou préserver l’histoire canonique.

Les interpréteurs ne prennent pas les internes du Cœur comme API durable. Les fixtures synthétiques, replays enregistrés et futurs états canoniques doivent pouvoir converger vers le même contrat sémantique.

La projection publique repose sur une liste positive d’informations autorisées. Les interfaces privées d’observation ou d’administration restent distinctes ; une information interne n’est pas protégée simplement parce qu’un composant d’interface ne l’affiche pas.

Un changement interne du Cœur doit être absorbé autant que possible dans l’adaptateur ou, lorsque la sémantique elle-même évolue, par une migration explicite et versionnée du contrat. Il ne doit pas se propager silencieusement dans les shaders, composants d’interface, règles musicales ou grammaires de rendu.

Le contrat décrit la sémantique, pas le transport. Replay local, HTTP, SSE, WebSocket ou toute technologie future peuvent transporter la même sémantique sans devenir une dépendance du Cœur ou de la grammaire.

Le flux doit permettre une resynchronisation par état complet lorsqu’un client détecte une perte, un saut ou une incompatibilité. Le client ne reconstitue pas une évolution canonique absente.

Les versions de la source/Cœur, de l’adaptateur/contrat, de la grammaire de représentation et du renderer restent conceptuellement distinctes.

Les technologies de représentation sont remplaçables. Une indisponibilité de représentation doit conduire à un mode dégradé ou à une interruption de cette représentation, jamais à l’invention d’une évolution canonique alternative.

La cadence de simulation du Cœur, la cadence de publication du contrat et les cadences de rendu sont indépendantes. Une interpolation ou animation locale est autorisée si elle ne crée aucun nouvel état canonique.

## Conséquences

- un moteur visuel ou sonore peut être remplacé sans réécrire l’histoire du monde ;
- un LAB d’interpréteur peut commencer avant la fin du Cœur si son sous-ensemble sémantique est assez stable ;
- un prototype doit être testable avec fixtures/replays sans connexion directe au Cœur ;
- un adaptateur factice ou une révision simulée du Cœur doit permettre de vérifier la frontière avant investissement de production ;
- le navigateur ne reçoit que l’état sémantique nécessaire à la représentation autorisée ;
- le protocole réseau peut évoluer sans redéfinir la sémantique du contrat ;
- une perte de mises à jour se résout par resynchronisation plutôt que par invention côté client ;
- les besoins GPU, audio ou de fréquence d’affichage ne deviennent pas automatiquement des besoins du Cœur ;
- l’accessibilité peut modifier les rendus sans altérer l’état canonique ;
- les contrats entre Cœur et interpréteurs doivent être explicites, minimaux et versionnés ;
- les dépendances propriétaires d’un rendu ne doivent pas pénétrer le chemin de survie canonique ;
- en cas de pénurie de ressources, les fonctions non canoniques sont dégradées avant les lois du monde ;
- les décisions de matériel et de capacité sont prises sur le budget cumulé des services qui coexistent réellement, sans dimensionner chaque brique comme si elle était seule.

## Gate d’acceptation d’un interpréteur anticipé

Avant de considérer un LAB comme compatible avec le futur Cœur :

1. aucune dépendance persistante aux structures internes du Cœur ;
2. projection publique minimale, sans donnée privée inutile au client ;
3. mêmes entrées contractuelles pour fixtures, replays et flux futur ;
4. transport remplaçable sans changement de grammaire ;
5. perte ou saut de flux récupérable par état complet ;
6. évolution simulée du Cœur absorbable principalement par l’adaptateur ;
7. renderer ou interpréteur factice capable de consommer le contrat ;
8. versions source/contrat/grammaire/renderer séparables ;
9. cadence de rendu indépendante de la cadence canonique ;
10. mode dégradé sans invention d’état ;
11. coûts mesurables avec les autres charges pertinentes.

Voir aussi `../ARBITRATION_LONGEVITY_AND_RESOURCES.md`, `../../21_coeur_vivant_genese_canonique.md`, `../../23_univers_sonore_contrat_public.md` et `../../24_visuel_coeur_contrat_public.md`.
