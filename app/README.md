# Les Lisières d'Avelune - application PROTO-0

Application SvelteKit du prototype jouable.

## État actuel

La branche `develop/proto-0.1-playable` expose la boucle miniature réelle :

`construction/extraction -> TF -> recherche/progression -> préparation TD -> vague -> conséquences -> adaptation`

Le prototype comprend plusieurs vagues dans une même session et un carnet de playtest.

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

`src/routes/+page.svelte` est encore une interface de prototype monolithique et doit être découpée après validation du playtest si cette boucle est conservée.

## Validation

```bash
npm run test:proto0
npm run check
npm run build
```

## Architecture

Voir `../docs/development/` pour l'audit, la politique de données, la cible d'architecture et la stratégie de consolidation.
