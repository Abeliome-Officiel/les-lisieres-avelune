# Primitives d’interface PROTO-0.2

Ces composants restent des primitives de présentation. Les règles, validations et transitions appartiennent à `src/lib/proto0/`.

- `ResourceStrip` reçoit des ressources déjà libellées et formatées.
- `CapacityStrip` reçoit les lectures de capacité, détails et états d’alerte.
- `ProductionNode` rassemble flux, charges, état ON/OFF, personnel et commandes. Les callbacks déclenchent le contrôleur ; le composant ne décide jamais si une transition est valide.
- `PopulationPool` présente population totale, affectée et libre.
- `ModifierBreakdown` présente un effet additif fidèle sous la forme base, delta, résultat.
- `FlowDiagram` représente un enchaînement simple sans devenir un éditeur de graphe.
- `ResourceCostPreview` et `CapacityDelta` rendent les aperçus calculés par le moteur.
- `TurnReportPanel` reste séparé des logs techniques.

## Conventions d’interaction

- Toute action manipulatoire conserve une commande bouton utilisable au clic, au tap et au clavier.
- Les cibles incompatibles sont filtrées depuis les previews moteur.
- Une fonction OFF conserve son personnel ; retirer le personnel est une transition distincte.
- Un lien suspendu reste visible et n’est pas supprimé.

## Extension

Les futurs gestes Pointer Events doivent appeler les mêmes callbacks que les boutons actuels, avec annulation sans mutation partielle. Les composants ne doivent pas importer de catalogue canonique ni recalculer une règle métier.
