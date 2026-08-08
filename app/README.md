# Les Lisières d'Avelune - application PROTO-0

Application SvelteKit du prototype jouable.

## État actuel

La branche `develop/proto-0.2.2-playtest` expose le playtest distribué :

`construction/extraction -> TF -> recherche/progression -> préparation TD -> vague -> conséquences -> adaptation`

Le prototype comprend des sessions anonymes à code 4 chiffres, sauvegardes
PostgreSQL, télémétrie de rythme, feedback intégré et SMTP facultatif.

Les anciens moteurs/tests P0-P10 restent conservés comme régression historique. Le scénario fixe de dix tours/une vague n'est plus la définition du prototype jouable.

## Organisation

Le code métier réside principalement dans `src/lib/proto0/` :

- `domain/`
- `config/`
- `corcite/`
- `turn/`
- `tf/`
- `rpg/`
- `td/`
- `wave/`
- `simulation/`

`playable-browser-controller.ts` orchestre les cas d'usage du navigateur sans remplacer les moteurs métier.

Le moteur `proto02/game.ts` reste indépendant de la persistance. Les
repositories serveur ont des fakes mémoire pour les tests.

## Validation

```bash
npm run test:proto0
npm run check
npm run build
```

La migration et les variables de déploiement sont documentées dans
`../infra/README.md`.

## Architecture

Voir `../docs/development/` pour l'audit, la politique de données, la cible d'architecture et la stratégie de consolidation.
