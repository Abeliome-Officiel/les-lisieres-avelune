# Les Lisières d'Avelune

Dépôt de conception et de développement du jeu navigateur **Les Lisières d'Avelune**.

## État courant

La branche de travail active du prototype jouable est :

`develop/proto-0.1-playable`

État au 6 août 2026 :

- boucle miniature jouable TF -> progression/recherche -> préparation TD -> vague -> conséquences -> adaptation ;
- départ du Corcite sans chaîne productive préinstallée ;
- population/travail, énergie, entretien, stockage et construction réellement contraignants ;
- fabrication et inventaire physique des défenses ;
- cycle de **trois vagues** ;
- première vague au tour 6 ;
- entre vagues : minimum 5 tours de développement + délai déterministe de 0 à 2 tours ;
- conséquences persistantes, récupération et économie de captation ;
- carnet de playtest ;
- 338 tests au dernier passage complet ;
- 384 parties de simulation du prototype jouable ;
- application déployée pour playtest humain.

Le verdict expérientiel du Lot 14 reste ouvert : les tests techniques ne remplacent pas la question « est-ce intéressant à jouer ? ».

## Phase de développement

Avelune est actuellement à la transition :

**prototype intégré jouable -> validation qualitative par playtest humain**.

Il ne faut pas encore considérer le projet comme entré en production massive de contenu.

Voir :

- [`docs/proto0/PROTO0_PLAYABLE_SCOPE.md`](docs/proto0/PROTO0_PLAYABLE_SCOPE.md)
- [`docs/proto0/PROTO0_PLAYTEST_READY.md`](docs/proto0/PROTO0_PLAYTEST_READY.md)
- [`docs/development/AUDIT_DEVELOPPEMENT_ARCHITECTURE_2026-08-06.md`](docs/development/AUDIT_DEVELOPPEMENT_ARCHITECTURE_2026-08-06.md)
- [`docs/development/GAME_DEVELOPMENT_METHOD.md`](docs/development/GAME_DEVELOPMENT_METHOD.md)

## Architecture du prototype

Le coeur suit une séparation :

`domain/rules -> orchestration -> UI`

Les moteurs TF, RPG, TD et vague sont utilisés hors interface par les tests et simulations. L'interface Svelte actuelle est volontairement une interface de prototype et constitue la principale dette de découpage.

Voir :

- [`docs/development/ARCHITECTURE_CURRENT_AND_TARGET.md`](docs/development/ARCHITECTURE_CURRENT_AND_TARGET.md)
- [`docs/development/DATA_CONFIGURATION_POLICY.md`](docs/development/DATA_CONFIGURATION_POLICY.md)
- [`docs/development/TEST_SECURITY_PERSISTENCE_STRATEGY.md`](docs/development/TEST_SECURITY_PERSISTENCE_STRATEGY.md)

## Documentation historique

Les jalons P0-P10 et `proto-0-spec.1` sont conservés comme **historique de validation des moteurs**. Ils décrivent notamment l'ancien scénario fixe de dix tours et une vague ; ils ne constituent plus la définition normative du prototype jouable actuel.

La branche historique `develop/proto-0` reste conservée pour traçabilité.

## Développement local

Application : `app/`  
Infrastructure : `infra/compose.yaml`

Commandes de validation de référence :

```bash
npm run test:proto0
npm run check
npm run build
```

## Index

L'index documentaire principal est [`docs/index.md`](docs/index.md).

<!-- PROTO0_PLAYABLE_CURRENT_2026_08_06 -->
## État courant du PROTO-0.1 jouable

Le jalon de lisibilité et de temporalité du prototype est validé.
Les décisions de construction et de fabrication sont désormais
planifiées pendant le tour, achevées lors de sa résolution et
utilisables au tour suivant.

Le détail du jalon est documenté dans
[`docs/proto0/PROTO0_PLAYABLE_UX_TEMPORALITY_2026-08-06.md`](docs/proto0/PROTO0_PLAYABLE_UX_TEMPORALITY_2026-08-06.md).
