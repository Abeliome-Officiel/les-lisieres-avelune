# VISUEL-2 — Canvas reference probe

## Statut

Laboratoire non canonique, empilé sur VISUEL-1. Il ne lit aucune donnée réelle du Cœur et n'établit aucune mécanique biologique.

Canvas 2D sert de **renderer témoin** pour obtenir une première référence de qualité/coût avec l'API graphique la plus simple possible. Ce n'est pas un choix de moteur final.

## Lancer localement

Depuis `labs/visuel2` :

```bash
npm run serve
```

Puis ouvrir :

```text
http://127.0.0.1:4173/labs/visuel2/
```

Aucune installation npm n'est nécessaire.

## Scénarios

- état stable synthétique ;
- transformation majeure synthétique avant/après, interpolée uniquement par la présentation ;
- 1, 16, 64 ou 128 formes pour la charge stable ;
- profils `sober`, `normal`, `rich` ;
- `reducedMotion` indépendant du niveau de qualité.

La boucle de transformation est explicitement un outil de laboratoire. Elle n'implique aucune répétition canonique d'une transformation dans le monde.

## Mesures affichées

Le navigateur rapporte une fenêtre glissante de mesures :

- FPS observés ;
- intervalle entre frames p95/p99 ;
- temps de plan/interpolation p95 ;
- temps d'émission des commandes Canvas p95 ;
- nombre de formes ;
- appels de dessin estimés ;
- taille du buffer de rendu.

Ces mesures **ne sont pas** un temps GPU fiable et ne mesurent pas la consommation électrique. Les tests matériels devront relever séparément CPU, GPU, RAM, énergie et charge des autres services Avelune.

## Architecture

```text
fixture publique synthétique
        ↓
VISUEL-0 validation/projection
        ↓
VISUEL-1 plan de rendu neutre
        ↓
RendererPort
        ↓
CanvasReferenceRenderer
```

Le renderer ne reçoit pas les données source et ne connaît pas le Cœur.

## Invariants

1. même plan + même temps de présentation → mêmes commandes ;
2. l'identité de projection survit à l'interpolation ;
3. `reducedMotion` supprime le mouvement temporel sans supprimer le signal de changement ;
4. qualité sobre/normal/riche ne change pas la morphologie primaire ;
5. le probe accepte jusqu'à 128 formes synthétiques sans modifier le contrat ;
6. aucune logique Canvas n'est autorisée à remonter dans VISUEL-0 ou VISUEL-1.

## Ce que ce probe ne doit pas décider

- renderer final ;
- palette finale ;
- style final des organismes ;
- règles du vivant ;
- règles d'une transformation canonique ;
- vocabulaire privé de traduction ;
- budget matériel final.
