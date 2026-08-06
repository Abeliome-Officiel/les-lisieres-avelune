# Avelune — PROTO-0 — Vérification moteur P9

Statut : résultats produits par le moteur headless.

## 1. Traçabilité du lot de référence

Le rapport de conception antérieur indique que 60 configurations avaient été comparées, mais les documents conservés ne contiennent pas leur liste exacte.

Il serait donc incorrect de prétendre les réexécuter à l’identique.

P9 définit désormais une référence moteur explicite de **60 configurations** :

- 24 permutations des quatre familles N1 distinctes ;
- 36 ordonnancements uniques utilisant deux familles présentes deux fois.

Cette référence est sérialisable, reproductible et utilisable pour les régressions futures.

## 2. Scénario nominal

Configurations exécutées : 60.
Résultats TD distincts : 60.
Effet de l’ordre reproduit : oui.
Configuration universellement dominante : aucune.
Taille du front de Pareto : 60.

### Leaders par objectif

- pressure-min : 32.75 — td-reference-036
- structure-min : 44 — td-reference-043, td-reference-044, td-reference-045, td-reference-046, td-reference-047, td-reference-048
- charge-min : 9.8 — td-reference-037, td-reference-038, td-reference-039, td-reference-040, td-reference-041, td-reference-042
- capturable-matter-max : 16 — td-reference-049, td-reference-050, td-reference-051, td-reference-052, td-reference-053, td-reference-054
- captured-matter-max : 8.75 — td-reference-043

## 3. Variabilité seedée

Graines testées : 64.
Configurations seedées exécutées : 3840.
Toutes les vagues restent dans les bornes configurées : oui.
Même graine = même batterie : oui.
Des graines différentes produisent une variation observable : oui.
Graines faisant apparaître une configuration universellement dominante : 0.

## 4. Stress et invariants

Tours TF consécutifs terminés : 100/100.
Tous les états TF produits restent valides : oui.
Transformation/fabrication gratuite observée : non.
Stockage saturé traité explicitement : oui.
Chaîne bloquée traitée explicitement : oui.
Ressource insuffisante signalée explicitement : oui.
Conflit humain détecté : oui.
Conflit humain résolu après décision : oui.
État impossible volontairement injecté détecté : oui.

## 5. Conclusions moteur

- effet de l’ordre TD reproduit : oui ;
- aucune domination universelle observée dans le lot testé : oui ;
- variation seedée maîtrisée : oui ;
- répétition déterministe : oui ;
- aucune transformation/fabrication gratuite observée : oui ;
- conflits explicitement détectés/résolus : oui ;
- états impossibles détectés : oui.

## 6. Portée

Ces résultats valident ou réfutent les hypothèses de laboratoire de PROTO-0 pour le moteur actuel. Ils ne constituent pas un équilibrage définitif du jeu.
