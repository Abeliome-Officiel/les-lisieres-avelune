# VISUEL-1 — terrain de fondation

Ce laboratoire prépare le premier rendu vivant sans choisir encore de renderer graphique.

## But

Prouver que la grammaire de représentation peut produire un **plan de rendu neutre**, déterministe et adaptable à partir du profil public de VISUEL-0.

Chaîne testée :

```text
payload VISUEL-0 autorisé
        ↓
planScene()
        ↓
plan de rendu neutre
        ↓
RendererPort
        ↓
renderer interchangeable
```

Aucune donnée du Cœur réel n'est utilisée ici.

## Invariants

- le renderer ne reçoit pas les internes du Cœur ;
- la grammaire ne dépend pas de PixiJS, Canvas, WebGL ou d'un autre moteur ;
- une même scène + une même version de grammaire produit le même plan ;
- `sobre`, `normal` et `riche` conservent identité et morphologie primaire ;
- la réduction du mouvement retire l'animation non indispensable sans retirer l'information de changement ;
- `normal` reste la cible de référence ; `riche` ajoute seulement des couches sacrifiables ;
- le benchmark mesure la préparation CPU du rendu, pas encore le GPU.

## Commandes

Depuis `labs/visuel1` :

```bash
npm test
npm run measure
```

Aucune installation de dépendance n'est nécessaire.

## Mesures préparées

Le benchmark construit des scènes synthétiques de :

- 1 forme ;
- 16 formes ;
- 64 formes ;
- 128 formes.

Il mesure p50/p95 du temps de génération du plan et une variation indicative du heap Node. Ces valeurs servent de baseline comparative, jamais de budget final de production.

## Renderer réel

Le prochain renderer d'essai devra implémenter le port `render(plan)` sans modifier le contrat VISUEL-0 ni `planScene()` pour satisfaire ses propres contraintes techniques.

Un renderer candidat qui exige de remonter ses structures natives dans le contrat ou dans la vérité du monde échoue la gate d'architecture.
