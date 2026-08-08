# PROTO-0.2 — Rapport d’implémentation

**Statut : P02-002 IMPLÉMENTÉ — REVIEW_READY TECHNIQUE, REVUE HUMAINE VISUELLE REQUISE AVANT TAG**

## Lot et état Git

- Lot : `P02-002` / `PROTO-0.2.1 structure UX et lisibilité`.
- Branche : `develop/proto-0.2-ux-rules`.
- HEAD local inspecté : `750f66ef3d59ace2c7f9420f1427f12c1021a200`; référence distante inspectée : `6f4e41282b4bf8e008ac560c3a88f06d5fb06cff`.
- Le contenu correctif des quatre commits distants a été comparé puis intégré au travail local plus avancé sans perdre la vue Production. Le fast-forward, le commit et le push restent bloqués parce que le sandbox interdit l’écriture dans les métadonnées Git du worktree : `git add` échoue sur `.git/worktrees/repository-proto02/index.lock` avec `Read-only file system`.
- Merge, tag et déploiement : aucun.
- Mécaniques : aucune famille, ressource, condition de victoire ou règle de vague ajoutée.

## Changements UX

L’interface active emploie désormais le vocabulaire **Structure / Structure du Corcite**. Les matières organiques et minérales d’amorçage (`4 + 4`) sont affichées dès l’ouverture avec la mention `amorçage · hors capacité`; la pose du stockage change leur statut de stockage sans suggérer leur création. Les quatre ressources tiennent dans une ligne compacte avec pictogramme, nom, disponible et réservé/total lorsque pertinent.

L’identité du Corcite regroupe maintenant Intégrité, énergie utilisée/capacité, population affectée/totale, entretien, stockage et cycle sous la forme icône + libellé + valeur. La représentation sphérique a été remplacée par une forme CSS asymétrique, biomorphique, opaline et cristalline, sans visage ni silhouette humanoïde.

Un jeu de pictogrammes SVG local distingue ressources, stockage, énergie, entretien, population, construction, extractions organique/minérale, défense, recyclage, recherche et production. Les pictogrammes restent toujours accompagnés d’un texte lorsqu’ils portent une information utile.

La vue Évolution utilise des cartes courtes. Chaque nœud montre icône, nom, effet, coût, durée, niveau/état et, seulement quand elle existe dans `RESEARCH`, la relation réelle vers `Transformation`. Aucune dépendance n’a été inventée.

La nouvelle vue **Production** agrège les fonctions réellement implantées : Atelier, Transformateur, Fabrique défensive et Recyclerie, ainsi que recettes, ordres, annulation avant démarrage et sorties bloquées. L’inspecteur conserve les actions locales mais n’est plus l’unique écran de fabrication.

Le vocabulaire joueur emploie `Fabriquer 1 composant`. La description de l’Atelier indique explicitement qu’il fabrique les bâtiments économiques, notamment de nouveaux extracteurs. La vue Défenses relie graphiquement les huit positions dans l’ordre `Fracture → 1 → … → 8 → Corcite`, tout en conservant les interactions clic/tap existantes.

Le kit initial complet n’est rendu que dans Structure. Les autres vues affichent un rappel compact renvoyant à Structure, puis le kit disparaît après déploiement. La fin de cycle produit une surcouche dédiée et fermable avec numéro de cycle, variations de ressources et d’objets, recherches terminées et synthèse d’onde; le rapport d’onde détaillé reste distinct des Échos. La transition dure 220 ms, ne bloque aucune mécanique et respecte `prefers-reduced-motion`.

L’autosauvegarde par profil est conservée. Son état est explicitement visible et une action secondaire `Sauvegarder maintenant` est disponible.

## Architecture des six blocs

- A — identité/état : `.corcite-card` et `.corcite-stats` ;
- B — ressources : `.block-resources` ;
- C — navigation : `.block-navigation` ;
- D — espace de travail : `.stage`, avec Structure, Évolution, Production ou Défenses ;
- E — contexte : `.context`, sélection et actions locales ;
- F — activité : `.block-activity`, inventaire, résumé de cycle, notice et commandes.

Desktop et mobile rendent exactement ces mêmes blocs et utilisent le même état. Seuls CSS Grid/Flex, ordre, densité et dimensions des hexagones changent aux breakpoints. Aucun moteur de layout ni seconde interface mobile n’a été créé. La seule primitive ajoutée est `AveluneIcon.svelte`, utilisée dans plusieurs blocs réels.

## Structure et géométrie

Les 19 cases gardent une position absolue dérivée uniquement de leurs coordonnées `q/r`. La largeur, la hauteur et les pas axial/diagonal utilisent les proportions d’une tessellation à sommet plat : deux voisines partagent une arête complète, sans gouttière ni triangle vide. Pose, gisement, bâtiment, preview et sélection sont des couches internes; survol et sélection ne changent plus le `transform`, la taille ou les coordonnées d’une case. La version mobile recalcule les mêmes proportions dans une largeur `100%`, sans translation latérale.

Les bâtiments restent au centre et au premier plan des cases occupées. Le gisement demeure dans un marqueur secondaire plus petit, moins opaque et sans halo dominant.

L’hypothèse de laboratoire autorisée `2 organiques + 2 minéraux` est appliquée pour réduire le bruit visuel. Les coordonnées utilisées par le scénario économique existant restent compatibles. Un test en verrouille l’état de laboratoire sans déclarer cette densité canonique; D-004 reste ouverte pour P02.2.

## Desktop et mobile

Desktop a été densifié : HUD 66 px, gouttières/paddings réduits, colonnes `220 / fluide / 255`, scène compacte et structure continue de 520 px occupant réellement le centre. L’inventaire est plus court. La composition est exploitable à zoom 100 % sur une largeur desktop courante selon revue CSS et build; la validation perceptive finale reste humaine.

Sous 1150 px, le contexte passe sous l’espace principal. Sous 760 px, les mêmes blocs sont empilés, les ressources passent en deux colonnes, l’état en trois colonnes, les hexagones descendent à 76 px de large en conservant leur contiguïté, recettes/recherches/inventaire passent sur une colonne et le contexte devient un bloc vertical. `overflow-x` est neutralisé au niveau de la page et de la scène. Toutes les actions restent tap/clic, sans drag obligatoire; les commandes interactives mobiles ont une hauteur minimale de 44 px.

## Accessibilité

- informations critiques toujours texte + icône ;
- labels explicites sur Structure, Corcite et bouton de fermeture ;
- régions `aria-live` pour sauvegarde, notices et résumé de cycle ;
- focus clavier conservé, sélection distincte sans déplacement ;
- `prefers-reduced-motion` neutralise animations et transitions ;
- aucun hover-only ni drag-only ;
- cibles mobiles de 44 px minimum.

## Contrôles exécutés

Runtime : Node `v24.19.0`.

| Contrôle | Résultat |
|---|---|
| `npm run check` | PASS — 0 erreur, 0 avertissement |
| `npm run test:proto0` | PASS — 39 entrées de suite, 0 échec, test de densité inclus |
| `npm run simulate:proto02` | PASS — 6 profils, 1 000 runs; 491 victoires testeur / 509 jeu |
| `npm run build` | PASS — client, SSR et adapter-node |
| `git diff --check` | PASS après rapport final |
| smoke Docker | BLOQUÉ PAR SANDBOX — accès refusé à `/var/run/docker.sock` |
| smoke serveur local | BLOQUÉ PAR SANDBOX — `listen EPERM 127.0.0.1:4173` |
| navigateur desktop/mobile | NON EXÉCUTABLE ICI — aucun Chromium/Playwright installé; revue humaine obligatoire |

## Dette restante et décisions ouvertes

La dette visuelle se limite aux SVG/CSS procéduraux temporaires et à la revue humaine réelle desktop/mobile. Aucun asset final n’était requis. Les smokes sont empêchés par les permissions Docker/réseau local du sandbox; le build serveur est vert.

Les décisions D-001 à D-008 de `DECISIONS_NEEDED.md` restent ouvertes selon leur jalon. P02-002 ne ferme notamment ni le kit initial définitif, ni la cadence/forme des premières vagues, ni la densité canonique des gisements, ni la forme de l’amélioration défensive. L’architecture continue d’autoriser quantité de tours, amélioration technologique ou stratégie mixte.

## Commandes exactes de revue

Depuis la racine du dépôt :

```bash
cd app
npm run check
npm run test:proto0
npm run simulate:proto02
npm run build
cd ..
git diff --check
git status --short
git diff -- app/src/lib/proto02 app/src/routes/+page.svelte app/tests/proto0/p02-game.test.ts docs/development/proto0.2/IMPLEMENTATION_REPORT.md
```

Revue humaine hors sandbox :

```bash
cd app
npm run dev -- --host 127.0.0.1
```

Contrôler à zoom navigateur 100 % au minimum à `1440×900`, `1024×768`, `390×844` et `360×800` : déploiement initial, stabilité des 19 cases avant/après pose, amorçage avant/après stockage, quatre vues, Production avec ordre/sortie bloquée, résumé de cycle, sauvegarde et absence de scroll horizontal structurel.
