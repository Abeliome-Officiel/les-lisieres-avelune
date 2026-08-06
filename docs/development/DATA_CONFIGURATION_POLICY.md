# Politique de données, configuration et équilibrage

Statut : document normatif.

## 1. But

Éviter que l'équilibrage exige de modifier la logique métier et éviter plusieurs sources contradictoires de vérité.

## 2. Situation actuelle

Le PROTO-0 possède déjà une bonne première séparation :

- `playable-start-reference.ts` : départ, population, capacités ;
- `playable-construction-reference.ts` : bâtiments, coûts, usages, grants ;
- `tf-processing-reference.ts` : recettes ;
- `playable-research-reference.ts` : recherches, durées, effets ;
- `playable-sustainability-reference.ts` : énergie/entretien ;
- `playable-recovery-reference.ts` : conséquences/récupération ;
- `playable-capture-reference.ts` : économie de captation ;
- `playable-td-reference.ts` : coûts de fabrication TD ;
- `td-reference.ts` : coefficients d'effets TD historiques encore utilisés ;
- `playable-wave-cycle-reference.ts` : calendrier, profils et incertitudes.

Les moteurs utilisent majoritairement ces références au lieu de disperser les nombres dans la logique.

## 3. Problème restant

Ces références sont des modules TypeScript. Une modification d'équilibrage nécessite encore compilation, tests et déploiement.

De plus, `data/design_data.json`, `csv/`, `design-data/` et les références TypeScript décrivent des générations différentes de conception. Aucun de ces ensembles ne doit être supposé automatiquement canonique pour le runtime.

## 4. Classification obligatoire

Toute nouvelle valeur doit appartenir à une catégorie :

- **Invariant** : règle structurelle, dans le code et testée.
- **Balance** : nombre modifiable fréquemment, dans un dataset.
- **Contenu** : définition d'un objet de jeu, dans un dataset.
- **État runtime** : résultat vivant de la partie, dans la sauvegarde/BDD.
- **Présentation** : libellé/texte, dans contenu/localisation.
- **Télémétrie** : donnée d'observation, dans un événement versionné.

## 5. Source canonique cible

Pipeline recommandé :

`tableur/édition -> export JSON -> validation de schéma -> normalisation -> content registry -> moteurs`

Le fichier consommé par le runtime doit être versionné et reproductible. Le tableur peut être un outil d'édition, mais ne doit pas être chargé directement par le serveur de jeu.

## 6. Identité d'un ruleset

Chaque session/simulation future doit pouvoir enregistrer :

- `rulesetVersion`
- `contentVersion`
- hash du dataset
- version du moteur
- seed

Ainsi, un résultat peut être rejoué exactement après modification de l'équilibrage.

## 7. IDs et extensibilité

Les unions TypeScript actuelles sont utiles au prototype, mais elles obligent à recompiler pour ajouter du contenu. À terme :

- IDs opaques validés au chargement ;
- relations vérifiées par schéma/registre ;
- cibles de modificateurs provenant d'un registre de capacités connu ;
- pas de `switch` moteur à modifier pour chaque nouvelle définition de contenu lorsque le comportement peut être décrit par données/composants.

## 8. Règle pour l'équilibrage

Un changement de nombre ne doit jamais nécessiter de modifier une fonction métier, sauf si ce nombre représente en réalité une nouvelle règle.
