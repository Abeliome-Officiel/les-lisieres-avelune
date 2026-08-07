# PROTO-0.2 — Garde-fous techniques et briques réutilisables

## Objectif

PROTO-0.2 peut rester un prototype visuellement provisoire, mais les primitives destinées à survivre doivent être propres, testables et réutilisables. Ne pas repartir de zéro si le moteur historique peut être adapté sans conserver des concepts désormais hors périmètre.

## Primitives à privilégier

Noms indicatifs, à adapter à l’existant :
- `HexBoard` ;
- `HexCell` ;
- représentation de ressource de sol ;
- `PlacementPreview` ;
- `BuildingDefinition` / `BuildingInstance` ;
- fabrication de bâtiment ;
- inventaire global / piles / catégories / capacité ;
- primitive générique de réservation de coût ;
- sortie locale bloquée d’un producteur ;
- `Recycler` ;
- arbre/nœud de recherche source de vérité ;
- `ResourceHUD` / `CapacityHUD` ;
- fiche Corcite ;
- `DefensePath` ;
- placement de défense ;
- rapport de vague ;
- persistance locale versionnée ;
- interactions clic/tap/clavier réutilisables.

Ne pas créer de doublon si un composant/moteur existant couvre déjà correctement la responsabilité.

## Séparation des responsabilités

### Données/configuration
- définitions de bâtiments ;
- coûts ;
- recettes ;
- caractéristiques de recherche ;
- paramètres de vague ;
- coefficients d’équilibrage.

### Moteur
- règles ;
- réservations ;
- transitions d’état ;
- fabrication ;
- extraction ;
- placement ;
- recherche ;
- résolution défensive ;
- dégâts d’Intégrité ;
- victoire/défaite.

### Présentation
- agrégation joueur ;
- icônes ;
- détails de coûts/modificateurs ;
- rapports ;
- états visuels.

### Interaction
- sélection ;
- tap/clic ;
- drag optionnel ;
- confirmation ;
- clavier lorsque pertinent.

Aucune règle critique ne doit vivre uniquement dans un composant Svelte.

## Suppression du réseau actif

Les primitives historiques `ProductionNode`, ports, `ConnectionLayer`, routage, buffers, graphes et connexions directes ne doivent **pas structurer le parcours PROTO-0.2**.

Le code peut rester temporairement présent s’il est proprement isolé et inutilisé. Si le retirer simplifie sans risque, Codex peut le supprimer/refactorer avec tests.

Ne pas créer d’API publique autour du réseau sous prétexte d’extensibilité future.

## Plateau

Le plateau économique doit avoir un état explicite :
- coordonnées hex ;
- ressource de sol éventuelle ;
- bâtiment éventuel ;
- états de sélection/preview calculés séparément.

Pas de règle d’adjacence ou logistique cachée. `1 bâtiment = 1 case` dans ce proto.

La pose doit être testable indépendamment de l’UI : case libre, bâtiment valide, production attendue d’un extracteur, confirmation/annulation.

## Fabrication / réservations / sortie bloquée

Créer une primitive générique d’ordre :
- coût réservé à la commande ;
- matière réservée encore physiquement stockée ;
- consommation au démarrage réel ;
- annulation pré-démarrage remboursée ;
- résultat vers inventaire si capacité ;
- sinon résultat dans une sortie locale unique et producteur bloqué.

La règle doit fonctionner pour bâtiments et défenses, et être extensible à d’autres objets sans dupliquer la logique.

## Stockage

Une seule vérité de capacité globale dérivée des bâtiments de stockage posés. Supprimer/neutraliser toute `baseStorageCapacity` native dans le parcours PROTO-0.2.

Le bootstrap du kit initial est une phase de déploiement, pas un stockage gratuit permanent.

## Énergie / espace historique

- retirer la réserve énergétique courte du moteur actif ;
- `energy used/capacity` uniquement ;
- retirer/neutraliser l’ancien espace abstrait si le plateau hexagonal est désormais la contrainte spatiale active.

Éviter deux vérités concurrentes dans l’état sérialisé.

## Recherche

Une seule source de vérité de recherche. Les raccourcis contextuels référencent un identifiant de nœud existant, ils ne créent pas de systèmes parallèles.

Prévoir : unlocks, niveaux répétables, limite globale de progression répétable, effets configurables et testables.

## Défense / onde

Pour PROTO-0.2, le moteur actif doit pouvoir fonctionner sur une structure minimale :
- `wave.power` ;
- liste ordonnée des tours d’Affaiblissement ;
- puissance avant/après chaque tour ;
- puissance résiduelle ;
- Intégrité avant/après ;
- résultat `tester-victory | game-victory | continue`.

Les anciens champs pression/structure/charge/matière peuvent être migrés/isolés mais ne doivent plus dicter la résolution active.

La croissance de puissance entre ondes doit être centralisée et strictement croissante. Codex peut ajuster les paramètres numériques par simulation, sans changer les règles.

## Simulations d’équilibrage

Avant `REVIEW_READY`, écrire/exécuter une simulation déterministe permettant au minimum de comparer :
- trajectoire raisonnable de développement/défense ;
- trajectoire faible ou mal optimisée ;
- impact de plusieurs allocations de recherche ;
- nombre d’ondes avant victoire ou mort ;
- absence de run infini si le joueur n’atteint jamais zéro résidu.

Cible de laboratoire : au moins une stratégie raisonnable gagne après plusieurs cycles, tandis qu’une stratégie déficiente finit par perdre. Ne pas chercher un équilibrage final.

## Persistance

Primitive versionnée :
- sérialisation explicite ;
- validation à la restauration ;
- migration/rejet propre des anciennes sauvegardes incompatibles ;
- aucun crash sur JSON corrompu ;
- nouvelle partie explicite.

## Contrôles attendus

Avant `REVIEW_READY` :
- typecheck / `svelte-check` ;
- `test:proto0` ;
- build ;
- tests ciblés des nouvelles règles ;
- simulations d’équilibrage ;
- smoke test du parcours ;
- responsive desktop/mobile vérifié raisonnablement.

Ajouter E2E si faisable proprement, avec scénarios prioritaires : déploiement initial, pose, extraction, transformation/fabrication, recherche, production d’une défense, placement, onde, victoire/défaite, sauvegarde/restauration.

## Dette acceptable

Acceptable si documentée : assets temporaires, palette encore ajustable, animations limitées, certains panneaux secondaires simples.

Non acceptable : logique dupliquée dans l’UI, réseau direct réintroduit, stockage natif caché, seconde réserve énergie, ancien espace abstrait actif, victoire basée sur anciens champs de vague, tests supprimés pour passer, page principale non jouable, mobile inutilisable.
