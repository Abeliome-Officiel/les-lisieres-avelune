# PROTO-0.2 — Garde-fous techniques et briques réutilisables

## Objectif technique

PROTO-0.2 peut être rapide, incomplet dans sa finition et volontairement expérimental. En revanche, les **briques transversales destinées à survivre** doivent être propres, testables et réutilisables afin d’éviter de les réécrire dans les versions suivantes.

Le critère n’est donc pas « tout doit être parfait », mais :

> Ce qui est jetable peut rester simple. Ce qui devient une primitive du jeu doit être construit proprement.

## Briques à privilégier comme composants réutilisables

Noms indicatifs ; Codex doit inspecter l’existant avant de créer des doublons.

- `ResourceStrip` : ressources principales, icônes, quantités, détails.
- `CapacityStrip` : énergie, population, entretien, stockage, espace si retenu à l’écran.
- `ProductionNode` : fonction productive générique avec état, coûts, recette, résultat.
- `ModifierBreakdown` : base + modificateurs + delta + résultat final.
- `ConnectionLayer` / primitive équivalente : liens entre ports, états actif/suspendu/compatible.
- `PopulationPool` : population totale, affectée, libre et interactions d’affectation.
- `DefensePath` : positions, inventaire, placement/déplacement.
- `EvolutionPanel` / primitive équivalente : recherche en cours, découverte, choix RPG.
- primitives d’interaction pointer/clic/tap réutilisables.

Ne pas imposer ces noms si des composants existants couvrent déjà correctement la responsabilité.

## Séparation des responsabilités

### Moteur
- règles ;
- validation ;
- calculs ;
- transitions d’état ;
- résolution de tour ;
- effets de recherche ;
- effets TD.

### Présentation
- formatage joueur ;
- icônes ;
- breakdowns ;
- agrégation lisible ;
- états visuels.

### Interaction
- drag/pointer ;
- clic/tap alternatif ;
- sélection de port ;
- feedback de compatibilité.

Aucun calcul critique de règle ne doit exister uniquement dans un composant Svelte.

## Drag-and-drop / pointer interactions

Pour les nouveaux gestes, préférer une abstraction fondée sur Pointer Events ou une solution équivalente compatible souris/tactile, plutôt qu’un usage fragile du HTML Drag and Drop desktop-only.

Exigences :
- annulation propre ;
- cible compatible déterminée par le modèle, pas par le CSS ;
- alternative sans drag ;
- pas de mutation partielle si le drop échoue ;
- tests de la logique indépendamment du geste graphique lorsque possible.

## Graphe / connexions

Ne pas construire maintenant : pan/zoom libre, sélection multiple, routage automatique sophistiqué, groupes, minimap, éditeur généraliste.

Construire une primitive simple mais extensible :
- nœuds positionnés par layout applicatif ;
- ports identifiés ;
- SVG ou technique équivalente pour les lignes ;
- états actif / suspendu ;
- compatibilité source/destination explicite dans les données ;
- possibilité future d’ajouter buffers, branches et priorités sans casser l’API publique du composant.

## Modèle d’état

Avant tout changement de structure d’état :
- inventorier les types existants ;
- distinguer état historique et parcours jouable ;
- éviter les champs doublons représentant la même vérité ;
- prévoir une version de schéma pour la sauvegarde locale.

## Persistance locale

Cible : primitive propre et réutilisable.

Exigences :
- clé versionnée ;
- sérialisation explicite ;
- validation minimale à la restauration ;
- gestion des versions incompatibles ;
- pas de crash si JSON corrompu ;
- API suffisamment isolée pour être remplacée plus tard par une persistance serveur.

## Contrôles

Codex doit utiliser la stratégie de validation réellement supportée par le dépôt et l’infrastructure. Cible minimale avant `REVIEW_READY` :

- typecheck / `svelte-check` ;
- suite `test:proto0` ;
- build ;
- tests ciblés des règles modifiées ;
- smoke test du parcours si l’environnement le permet.

Ajouter Playwright/E2E uniquement si cela peut être fait rapidement et proprement sans détourner la soirée vers l’infrastructure de tests. Les scénarios E2E prioritaires sont : démarrer, affecter, activer, produire, rechercher, placer une défense, terminer un tour, restaurer une sauvegarde.

## Dette acceptable ce soir

Acceptable si documentée :
- layout encore simple ;
- styling incomplet ;
- transitions sans animation ;
- quelques vues encore textuelles ;
- instrumentation légère ;
- fin de run minimale.

Non acceptable :
- logique dupliquée dans l’UI ;
- deuxième modèle de population ;
- deuxième moteur de recherche ;
- régression silencieuse des règles historiques hors périmètre ;
- hack non testé pour l’énergie ;
- dépendance forte entre graphisme et règles ;
- suppression de tests pour obtenir du vert.

## Politique de modification

Refactoriser librement lorsqu’il s’agit d’un changement local clairement nécessaire à la qualité/réutilisabilité et couvert par tests.

Si un refactor devient transversal, massif ou modifie plusieurs domaines sans nécessité directe pour la tâche : arrêter ce refactor et documenter la proposition au lieu d’élargir silencieusement le périmètre.
