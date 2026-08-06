# Roadmap - Les Lisières d'Avelune

## État courant - PROTO-0 jouable

Branche active : `develop/proto-0.1-playable`

### Construction du prototype miniature

- [x] Lot 1 - départ minimal du Corcite
- [x] Lot 2 - construction et ressources
- [x] Lot 3 - extraction et stockage
- [x] Lot 4 - transformation et fabrication
- [x] Lot 5 - énergie, entretien, population/travail
- [x] Lot 6 - recherches et découvertes
- [x] Lot 7 - fabrication et organisation TD
- [x] Lot 8 - cycle multi-vagues
- [x] Lot 9 - conséquences et récupération
- [x] Lot 10 - économie de captation
- [x] Lot 11 - interface navigateur mobile/bureau
- [x] Lot 12 - carnet de test
- [x] Lot 13 - simulations d'équilibrage de référence
- [x] Lot 14 technique - parcours intégral automatisé
- [ ] Lot 14 expérientiel - playtest humain et verdict sur la boucle

Référence temporelle actuelle : première vague au tour 6 ; puis minimum 5 tours de développement, avec 0 à 2 tours de délai déterministe supplémentaire. Ces valeurs restent des paramètres de playtest.

## Gate actuelle

Question à valider :

> Est-ce que les décisions produisent des situations que le joueur veut comprendre, améliorer et expérimenter ?

### Si le playtest invalide la boucle

1. corriger les mécaniques et la lisibilité ;
2. refaire une version miniature ;
3. rejouer avant d'investir dans l'architecture de production.

### Si le playtest valide la boucle

Phase de consolidation courte, avant ajout massif de contenu :

- [ ] découper l'interface Svelte monolithique ;
- [ ] définir un registre de contenu/ruleset injecté dans les moteurs ;
- [ ] externaliser balance et contenu hors TypeScript compilé ;
- [ ] définir une source canonique de données ;
- [ ] versionner les états persistants et migrations ;
- [ ] formaliser la frontière serveur autoritaire ;
- [ ] ajouter CI GitHub test/check/build ;
- [ ] ajouter E2E navigateur de base ;
- [ ] formaliser télémétrie métier et persistance PostgreSQL.

Ensuite seulement :

- [ ] vertical slice représentative ;
- [ ] production de contenu ;
- [ ] équilibrage à plus grande échelle ;
- [ ] UX/accessibilité de production ;
- [ ] monde persistant partagé et montée en charge.

## Historique P0-P10

Les jalons P0-P10 ont validé les briques de moteur : fondations, état Corcite, réservations, TF, RPG, TD, vague, conséquences, reporting, simulations et premier contrôleur navigateur.

Le scénario `proto-0-spec.1` (10 tours, 1 vague) est désormais **historique**. Il reste conservé pour régression et traçabilité, mais n'est plus le périmètre courant.

## Références

- [`docs/proto0/PROTO0_PLAYABLE_SCOPE.md`](docs/proto0/PROTO0_PLAYABLE_SCOPE.md)
- [`docs/proto0/PROTO0_PLAYTEST_READY.md`](docs/proto0/PROTO0_PLAYTEST_READY.md)
- [`docs/development/GAME_DEVELOPMENT_METHOD.md`](docs/development/GAME_DEVELOPMENT_METHOD.md)
- [`docs/development/TECHNICAL_DEBT_AND_NEXT_STEPS.md`](docs/development/TECHNICAL_DEBT_AND_NEXT_STEPS.md)
