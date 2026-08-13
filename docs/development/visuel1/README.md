# VISUEL-1 — préparation du premier rendu vivant

Statut : **préparation technique**, empilée sur `develop/visuel-0-contract`.

## Objectif

Préparer le terrain du premier rendu vivant sans engager prématurément :

- un renderer final ;
- une API graphique propriétaire ;
- une biologie de production ;
- une taxonomie de races ;
- un budget matériel arbitraire.

VISUEL-1 doit d'abord démontrer qu'une représentation légère, déterministe et adaptable peut être préparée indépendamment du moteur graphique.

## Architecture de travail

```text
contrat VISUEL-0
      ↓
plan de rendu neutre
      ↓
port renderer
      ├── renderer factice / enregistrement
      ├── futur probe Canvas2D
      ├── futur probe renderer accéléré
      └── autre technologie remplaçable
```

Le plan de rendu est une frontière de laboratoire. Il ne devient pas une vérité canonique et ne doit contenir aucune information privée absente du contrat autorisé.

## Fondations préparées

### Déterminisme

La variation visuelle de laboratoire est dérivée de l'alias public et d'une version de grammaire. Elle permet de comparer deux rendus à entrée identique sans dépendre d'un RNG implicite du renderer.

Cette stratégie ne préjuge pas de la future manière dont les seeds de représentation seront gérées en production.

### Qualité adaptative

Trois profils sont préparés :

- `sober` : morphologie primaire, sans couches secondaires coûteuses ;
- `normal` : cible de conception et de benchmark ;
- `rich` : enrichissements sacrifiables.

Une montée de qualité ne peut pas modifier l'identité ou la morphologie primaire de la forme.

### Accessibilité

`reducedMotion` est indépendant du niveau de qualité. Il peut neutraliser pulsation, mouvement secondaire et parallaxe sans supprimer l'information indiquant qu'une transformation est en cours.

### Port de renderer

Un renderer doit consommer `render(plan)`. Les objets natifs d'une bibliothèque graphique ne doivent pas remonter dans le contrat public ou dans la grammaire.

### Mesure

Le benchmark prépare 1, 16, 64 et 128 formes. Il mesure uniquement la génération CPU du plan de rendu. Les mesures GPU, mémoire graphique, fréquence d'image, température/énergie et coût navigateur appartiendront au premier probe réel.

## Gate avant choix d'un renderer d'essai

Le terrain est considéré prêt si :

1. tous les tests VISUEL-0 restent verts ;
2. le plan est déterministe à entrée/version identiques ;
3. `sobre`, `normal`, `riche` conservent la même identité et la même morphologie primaire ;
4. la réduction de mouvement conserve l'information utile ;
5. un renderer d'enregistrement consomme le plan sans dépendre du Cœur ;
6. le benchmark 1/16/64/128 s'exécute en CI ;
7. aucune donnée ou structure CODEX n'est introduite ;
8. aucune dépendance graphique n'est encore nécessaire.

## Étape suivante après gate

Créer un **renderer probe minimal** sur scènes synthétiques, avec seulement :

- silhouette ;
- surface simple ;
- micro-mouvement ;
- transition majeure avant/après ;
- niveaux `sober/normal/rich` ;
- mode mouvement réduit.

Le probe devra mesurer son coût avant tout enrichissement artistique important.

## Ce que VISUEL-1 ne décide pas

- architecture biologique du Cœur ;
- causes ou effets canoniques des transformations ;
- morphologie des futures races ;
- nombre final de formes visibles ;
- technologie finale de rendu ;
- seuils de matériel minimum/recommandé ;
- recettes propriétaires de traduction.
