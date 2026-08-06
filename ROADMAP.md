# Roadmap — Les Lisières d’Avelune

## Repères de version

- `v0.8` : ancien jalon/tag historique ;
- `v0.8.3` : dernière baseline de conception formellement figée ;
- **v0.8.3+** : conception consolidée avec les décisions postérieures ;
- **PROTO-0 jouable** : état logiciel actuel, développé et playtesté sur `develop/proto-0.1-playable`.

Il n’existe pas encore de nouvelle version stable arbitrairement nommée `v0.9`.

## Phase actuelle

Le projet n’est plus dans la phase « construire un premier prototype logiciel ». Ce prototype existe.

La phase actuelle est :

**prototype intégré jouable → premiers playtests humains → ajustements → consolidation technique**.

Les premiers retours de jeu sont actuellement utilisés pour faire évoluer le PROTO-0. Les paramètres détaillés peuvent donc bouger rapidement.

## Ce que le PROTO-0 couvre déjà

- départ minimal du Corcite ;
- construction ;
- extraction et stockage ;
- transformation et fabrication ;
- énergie ;
- entretien ;
- population et travail ;
- recherches et découvertes ;
- fabrication et organisation TD ;
- cycle multi-vagues ;
- conséquences persistantes ;
- récupération ;
- économie de captation ;
- interface mobile/bureau ;
- carnet de playtest ;
- simulations reproductibles.

Le jalon technique déployé le 6 août 2026 valide **346 tests automatisés**, **0 erreur / 0 warning Svelte** et un **build production réussi**. Les simulations et tests automatisés constituent des contrôles techniques, pas un verdict sur l’intérêt du jeu.

## Jalon PROTO-0.1 — lisibilité et temporalité

- [x] vocabulaire joueur et identifiants techniques masqués dans l'usage normal ;
- [x] navigation unifiée en cinq sections ;
- [x] stocks visibles en permanence ;
- [x] énergie, entretien et stockage observables ;
- [x] population totale / affectée / disponible ;
- [x] chaînes et prérequis d'action explicités ;
- [x] recherches jouables sur un tour ;
- [x] rapport obligatoire du tour précédent ;
- [x] historique des rapports dans le Journal ;
- [x] construction planifiée puis achevée à la résolution du tour ;
- [x] fabrication défensive planifiée puis achevée à la résolution ;
- [x] utilisation d'une nouvelle construction seulement à partir du tour suivant ;
- [x] annulation des décisions planifiées avant résolution ;
- [x] conflits matériels sans arbitrage automatique caché ;
- [x] 346 tests PROTO-0 réussis ;
- [x] 0 erreur / 0 warning ;
- [x] build production réussi ;
- [x] déploiement public validé.

**Étape suivante : nouveau playtest humain sur cette version avant
toute nouvelle révision structurelle importante du moteur.**

## Gate actuelle : intérêt et lisibilité

Question principale :

> **Est-ce que les décisions produisent des situations qu’on veut comprendre, améliorer et expérimenter ?**

Les playtests doivent notamment vérifier :

- compréhension de la boucle globale ;
- intérêt des arbitrages TF ;
- utilité et lisibilité de la recherche ;
- préparation réelle du TD ;
- rythme des vagues ;
- conséquences et récupération ;
- clarté des informations ;
- adaptation à plusieurs styles et disponibilités de jeu ;
- accessibilité réelle et non seulement théorique.

## Si la boucle est validée

Faire une courte phase de consolidation avant d’augmenter fortement le contenu :

1. découper l’interface monolithique ;
2. faire évoluer contenu et équilibrage vers des datasets versionnés ;
3. désigner une source canonique de données ;
4. versionner états persistants et migrations ;
5. formaliser la future autorité serveur ;
6. ajouter CI test/check/build ;
7. ajouter tests E2E navigateur ;
8. structurer télémétrie métier et persistance PostgreSQL.

Ensuite seulement :

- vertical slice représentative ;
- production de contenu plus large ;
- équilibrage à plus grande échelle ;
- approfondissement UX/accessibilité ;
- monde persistant partagé et opérations serveur.

## Si la boucle n’est pas validée

Ne pas compenser en ajoutant du contenu ou en sur-architecturant.

1. identifier ce qui n’est pas intéressant ou lisible ;
2. corriger les mécaniques ;
3. rejouer une miniature cohérente ;
4. consolider l’architecture seulement une fois la direction de jeu suffisamment stable.

## Principes qui ne dépendent pas du prototype

Même si les chiffres et mécaniques précises évoluent, les axes suivants restent structurants :

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
- direction artistique onirique, féerique, organique et minérale, sans inventer de population/faune/flore non définie.
