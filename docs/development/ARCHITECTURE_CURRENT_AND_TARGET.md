# Architecture actuelle et architecture cible

Statut : document normatif de développement.

## 1. Architecture actuelle du PROTO-0 jouable

```text
Svelte UI (+page.svelte)
        |
        v
playable-browser-controller.ts
        |
        +--> corcite/
        +--> turn/
        +--> tf/
        +--> rpg/
        +--> td/
        +--> wave/
        |
        v
domain/ + config/
```

Le contrôleur navigateur est une couche d'orchestration. Les règles principales ne sont pas réimplémentées dans la page : elles résident dans les moteurs spécialisés.

### Rôles actuels

- `domain/` : contrats et états ;
- `config/` : références et catalogues de prototype ;
- `corcite/` : état, construction, capacités, soutenabilité, récupération, validation et sérialisation ;
- `turn/` : plan, réservations, arbitrage et commit ;
- `tf/` : production et réseau ;
- `rpg/` : recherche et progression ;
- `td/` : inventaire, placement, effets et résolution ;
- `wave/` : cycle et conséquences ;
- `simulation/` : exécution headless ;
- `playable-browser-controller.ts` : cas d'usage du prototype ;
- `routes/+page.svelte` : UI de playtest.

## 2. Dépendances à préserver

Direction souhaitée :

`UI/API -> application -> domain/rules`

Les règles ne doivent pas importer Svelte, HTTP, PostgreSQL ou des détails de présentation.

Les simulations doivent utiliser les mêmes règles et les mêmes catalogues que le serveur de jeu.

## 3. Architecture cible après validation du prototype

```text
app/src/lib/game/
  domain/          états, value objects, invariants
  rules/           TF, RPG, TD, vague, conséquences
  application/     commandes/cas d'usage
  content/         interfaces et registre de contenu normalisé
  telemetry/       événements métier
  simulation/      runners déterministes

app/src/lib/server/
  api/             validation des commandes/auth
  persistence/     PostgreSQL/repositories/migrations
  content-loader/  chargement + validation des datasets

app/src/lib/ui/
  views/
  components/
  stores/
  selectors/

app/content/
  schema/
  balance/
  buildings/
  recipes/
  research/
  td/
  waves/
  narrative/
  locales/
```

## 4. Refactors à ne pas faire prématurément

Ne pas réécrire les moteurs fonctionnels uniquement pour satisfaire l'arborescence cible. Migrer une brique lorsqu'un besoin réel apparaît, avec tests de non-régression.

## 5. Dette d'interface

`+page.svelte` est aujourd'hui un composant de prototype très volumineux. Le premier découpage recommandé :

- `CorciteView.svelte`
- `TfView.svelte`
- `ResearchView.svelte`
- `DefenseView.svelte`
- `WaveView.svelte`
- `NotebookView.svelte`
- `StatusBar.svelte`
- selectors/view-models pour les calculs de présentation.

La page racine doit seulement orchestrer navigation, session et composition.

## 6. Règle de conception

Une nouvelle mécanique ne doit pas être ajoutée directement à l'UI. Elle doit d'abord exister comme règle/cas d'usage testable hors navigateur, puis être exposée à l'interface.
