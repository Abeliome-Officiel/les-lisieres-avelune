# Roadmap — Les Lisières d’Avelune

## Repères de version

- `v0.8` : ancien jalon/tag historique ;
- `v0.8.3` : dernière baseline de conception formellement figée avant le PROTO-0.1 ;
- **v0.8.3+** : conception consolidée avec les décisions postérieures ;
- **PROTO-0.1 jouable** : état logiciel intégré à `main`, déployé et validé comme baseline stable ;
- **PROTO-0.2** : lot expérimental en revue/playtest, non encore promu en baseline stable.

Il n’existe pas encore de nouvelle version stable arbitrairement nommée `v0.9`.

## Phase actuelle

Le PROTO-0.1 a rempli son rôle de première baseline navigateur intégrée. Les playtests ont ensuite conduit à une remise à plat du modèle mental TF/UX et à l’ouverture du lot PROTO-0.2.

La phase actuelle est :

**PROTO-0.2 alpha locale → revue technique → playtest navigateur → corrections ciblées → intégration GitHub si les gates sont satisfaites.**

Le principe directeur reste :

> **Ne pas compenser un problème de mécanique ou d’ergonomie par davantage de contenu ou d’architecture.**

## Jalon PROTO-0.1 — clôturé

Le jalon intégré le 6 août 2026 validait notamment :

- navigation joueur unifiée ;
- stocks/capacités observables ;
- population exposée ;
- chaînes et prérequis explicités ;
- construction/fabrication/recherche résolues sur une temporalité simple ;
- rapports et journal ;
- simulations reproductibles ;
- 346 tests PROTO-0 ;
- 0 erreur / 0 warning Svelte ;
- build production et déploiement public validés.

Ce jalon reste la baseline stable de `main` tant que PROTO-0.2 n’est pas revu et intégré.

## PROTO-0.2 — objectif

PROTO-0.2 est un mini-jeu de laboratoire destiné à tester plus directement :

- manipulation du Corcite sur plateau hexagonal ;
- implantation de fonctions ;
- stockage réel fourni par des bâtiments ;
- inventaire global ;
- extraction, transformation et fabrication ;
- énergie, population et entretien ;
- recherche ;
- préparation défensive ;
- vagues à **Puissance** unique ;
- adaptation jusqu’à victoire ou défaite explicite ;
- lisibilité et plaisir de manipulation ;
- composition UI proche Gen3 corrigée par la direction artistique Avelune.

### Ce que PROTO-0.2 exclut volontairement

- réseau direct Factorio/LabVIEW ;
- ports, câbles, routage et buffers complexes ;
- logistique spatiale avancée ;
- multijoueur/social ;
- météo/données réelles ;
- plusieurs anneaux mécaniques ;
- matériaux issus des vagues ;
- plusieurs caractéristiques actives de vague ;
- temps réel ;
- contenu final de races/classes/métiers ;
- direction artistique finale.

Ces exclusions de prototype ne signifient pas nécessairement que les idées sont abandonnées. Leur statut long terme est maintenu dans [`docs/conception/05_futur_du_jeu_registre_2026-08-07.md`](docs/conception/05_futur_du_jeu_registre_2026-08-07.md).

## État PROTO-0.2 au 7 août 2026

Le long run Codex a produit localement une alpha jouable volontairement simplifiée :

- page active fortement réduite et moteur P02 séparé de Svelte ;
- plateau, inventaire, production, recherche, défense et vagues intégrés ;
- simulations déterministes avec trajectoires de victoire et de défaite ;
- première passe visuelle prune/violet/lavande/opaline ;
- sauvegarde locale versionnée ;
- aucune nouvelle dépendance ni framework générique ajouté.

Un playtest navigateur réel a détecté un défaut de bootstrap : les 7 bâtiments du kit et les 8 ressources de départ étaient comptés comme `Stock 15/0` alors qu’aucun stockage n’était encore implanté.

Correctif local connu : `2b1b76d31d6f6f936b56ab2fdad29f1baeae079c`.

Le correctif sépare désormais :

- kit de déploiement hors inventaire mécanique ;
- ressources d’amorçage hors stockage avant la première membrane ;
- `0/0` au démarrage ;
- `8/16` après implantation de la première membrane avec les constantes actuelles ;
- six fonctions restantes hors capacité jusqu’à leur implantation ;
- actions normales verrouillées jusqu’à la fin du déploiement.

### Gates restantes avant intégration

- [ ] synchroniser le correctif local avec GitHub ;
- [ ] exécuter hors sandbox `npm run check` ;
- [ ] exécuter `npm run test:proto0` ;
- [ ] exécuter `npm run simulate:proto02` ;
- [ ] exécuter `npm run build` ;
- [ ] reconstruire la preview Docker 8091 ;
- [ ] vérifier visuellement le bootstrap `0/0 → 8/16` ;
- [ ] rejouer le parcours complet jusqu’à une vague ;
- [ ] corriger seulement les anomalies réellement bloquantes ;
- [ ] intégrer/pousser seulement après cette revue.

## Gate actuelle : intérêt, lisibilité et cohérence

Question principale :

> **Est-ce que les décisions produisent des situations qu’on veut comprendre, améliorer et expérimenter, avec une interface assez lisible pour que la mécanique elle-même soit jugée ?**

Les playtests doivent notamment vérifier :

- compréhension du démarrage et du déploiement ;
- intérêt des arbitrages économiques ;
- compréhension du stockage physique ;
- utilité de la recherche ;
- préparation réelle de la défense ;
- rythme des vagues ;
- clarté du rapport ;
- qualité de la composition desktop/mobile ;
- adaptation à plusieurs styles et disponibilités de jeu ;
- accessibilité réelle et non seulement théorique.

## Après validation de PROTO-0.2

Ne pas augmenter automatiquement le contenu. Faire d’abord une courte consolidation :

1. consigner les résultats du playtest ;
2. décider quelles mécaniques du P02 méritent de rester ;
3. identifier les paramètres purement de laboratoire ;
4. stabiliser les interfaces de données réellement réutilisées ;
5. ajouter seulement les tests/E2E qui apportent une couverture utile ;
6. préparer le prochain prototype à partir d’une question de design explicite.

Le réseau direct futur, les matériaux de Fracture, les événements, les systèmes sociaux, les terrains et le monde persistant partagé restent des développements possibles mais doivent être réintroduits par lots testables.

## Registre « Futur du jeu »

Le pool long terme est distinct de cette roadmap.

- baseline Drive v0.3 : **313 entrées** au 3 août 2026 ;
- registre GitHub : [`docs/conception/05_futur_du_jeu_registre_2026-08-07.md`](docs/conception/05_futur_du_jeu_registre_2026-08-07.md) ;
- le registre conserve les idées **retenues, prévues, ouvertes, remisées, hypothétiques, écartées** ;
- les idées proposées par ChatGPT sont dans une section distincte marquée **Extrapolation assistant** et n’ont aucune valeur canonique sans validation humaine.

## Principes qui ne dépendent pas du prototype

- monde partagé unique ;
- protection collective de la Lisière ;
- coopération directe entre Corcites facultative ;
- progression principalement horizontale ;
- challenge systémique sans punition artificielle ;
- échec fertile ;
- absence non punitive ;
- pas de classement humiliant ;
- pas de micro-dopamine/FOMO comme moteur de rétention ;
- accessibilité pensée pour des profils et rythmes variés, notamment TSA/TDAH/dys ;
- plusieurs styles de jeu légitimes ;
- identité queer et non genrée ;
- direction artistique onirique, féerique, organique et minérale ;
- sobriété de scope et refus de la sur-architecture comme substitut au game design.
