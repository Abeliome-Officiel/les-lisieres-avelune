# PROTO-0.2 — Rapport d’implémentation

**Statut : REVIEW_READY**

## Lot et état Git

- Lot : `P02-001`
- Branche : `develop/proto-0.2-ux-rules`
- HEAD de base du présent correctif : `3331b1e`
- Livraison P02 initiale : `72442edca0b7997b442aff2870adb11fb5a63f60`
- Correctifs de consolidation : présents dans le worktree, non commités
- Push / merge / déploiement : aucun

Le commit local final n’a pas pu être créé dans le sandbox : l’index réel du worktree est sous `/SSD-Sata/Projets/Avelune-Officiel/repository/.git/worktrees/repository-proto02/`, hors racine inscriptible, et Git échoue sur `index.lock` avec `Read-only file system`. Le dossier utilisateur non suivi `.codex-runs/` a été préservé et n’appartient pas au lot.

## Diagnostic initial

La route active avait déjà été migrée vers un moteur P02 local et une page Svelte compacte. Les moteurs P01 (réseau, quatre familles défensives, captation et anciens champs d’onde) restent uniquement comme historique testé dans `src/lib/proto0/` ; ils ne sont ni importés ni exposés par la route P02.

La passe de consolidation a identifié puis corrigé : consommation possible de matières réservées par le transformateur automatique, désactivation/démontage dangereux des fournisseurs de capacité, blocage d’un objet neuf par un exemplaire démonté, validation trop permissive des sauvegardes, amélioration de fabrication répétable sans effet supplémentaire, sorties bloquées invisibles hors fabriques et rapport de fin incomplet.

## Parcours réellement jouable

Le testeur démarre avec un plateau de 19 hexagones vide. Le kit initial reste hors stockage ; la première membrane posée transfère les `4` organiques et `4` minéraux dans une capacité mécanique de `16`, sans stockage natif. Les six autres fonctions sont ensuite implantées librement.

Le parcours couvre extraction des deux sols, recherche Transformation, transformation automatique, fabrication de composants et bâtiments par l’Atelier, fabrication de tours par la Fabrique défensive, Recyclerie, inventaire global, réservations, annulation avant démarrage, sorties locales bloquées sans perte, démontage/remontage en un cycle, énergie utilisée/capacité, population, entretien, améliorations dont Stockage amélioré, puis placement de tours d’Affaiblissement sur huit positions.

Les ondes utilisent uniquement la Puissance. Elle croît strictement (`18, 26, 35, 45…`), les tours réduisent séquentiellement le résidu, un résidu nul donne immédiatement la victoire au testeur, et l’Intégrité nulle donne la victoire au jeu. Le rapport d’onde est séparé du journal et la fin de run résume cycles, ondes, tours et évolutions.

La sauvegarde locale P02 v3 est isolée pour chacun des cinq profils testeurs. Les formes incompatibles ou corrompues (ressources négatives, plateau/défenses invalides, identifiant de bâtiment inconnu, progression hors limite) sont rejetées proprement.

## Architecture retenue

- `app/src/lib/proto02/game.ts` : catalogues explicites, état sérialisable et transitions métier ;
- `app/src/lib/proto02/simulation.ts` : profils et balayage déterministes ;
- `app/src/lib/proto02/testers.ts` : sauvegardes locales versionnées par profil ;
- `app/src/routes/+page.svelte` : composition joueur et interactions ;
- `app/tests/proto0/p02-game.test.ts` : 17 scénarios mécaniques P02 ;
- `app/tests/proto0/p02-testers.test.ts` : isolation des profils.

Cette architecture reste volontairement locale : aucun ECS, bus d’événements, graphe, arbre technologique générique, couche de persistance universelle ou dépendance supplémentaire.

## Anciennes mécaniques retirées du parcours actif

- aucun réseau, port, câble, routage ou espace abstrait concurrent ;
- aucune réserve énergétique courte ;
- aucun stockage natif du Corcite ;
- aucune matière de vague ni captation ;
- aucune famille Captation, Déstructuration ou Stabilisation ;
- aucune caractéristique d’onde autre que Puissance ;
- aucun quota symétrique d’ordres ni nombre fixe de vagues.

## Équilibrage de laboratoire

Paramètres centralisés retenus : Intégrité `60`, première onde au cycle `6`, écart minimal `5` cycles, retard déterministe `0–2`, Puissance initiale `18`, croissance `+8` avec accélération `+1`, Affaiblissement `9` par tour, extraction `2`, stockage `16`, amélioration de stockage `+6` par niveau, quatre niveaux répétés cumulés au maximum.

Résultats reproductibles :

| Trajectoire | Résultat | Onde | Intégrité finale |
|---|---|---:|---:|
| développement raisonnable | victoire testeur | 3 | 34 |
| recherche puis défense | victoire testeur | 4 | 17 |
| extraction améliorée puis défense | victoire testeur | 4 | 17 |
| défense tardive | victoire jeu | 3 | 0 |
| économie sans défense | victoire jeu | 3 | 0 |
| surinvestissement économique | victoire jeu | 3 | 0 |

Balayage déterministe de `1 000` trajectoires proches du seuil : `491` victoires testeur, `509` victoires jeu, onde terminale moyenne `3,226`. Le même seed reproduit exactement le résultat. Ces simulations portent sur le rythme d’acquisition défensive face à la courbe d’onde ; elles ne prétendent pas remplacer un playtest humain de toute l’économie.

## UX, visuel, responsive et accessibilité

La composition suit le brief Gen3 corrigé : HUD haut, fiche Corcite gauche, plateau central, contexte droit, inventaire/ordres bas et vue tactique distincte. La palette prune/violet/lavande/opaline, les membranes, gemmes et formes biomorphiques donnent une identité Avelune sans humanoïde, médiéval générique ni usine sci-fi.

Les gisements restent visibles sous les bâtiments, les prévisualisations indiquent le rendement, et les formules extraction/transformation/stockage affichent base + évolution = résultat. Le HUD expose ressources engagées, stockage, énergie, population affectée/totale/disponible, entretien et Intégrité. Les sorties pleines ont un libellé joueur et une action de transfert. Les notices utilisent une région `aria-live`, les interrupteurs ont un focus visible et les boutons mobiles atteignent au moins `44px`. Le drag n’est jamais requis.

Desktop, tablette et mobile disposent de ruptures dédiées (`1150px`, `760px`). La vérification du responsive est statique dans ce sandbox ; un smoke visuel navigateur à `390px` reste recommandé avant mise en ligne.

## Contrôles finaux exécutés

Runtime : Node `v24.19.0` fourni par l’environnement Codex.

| Contrôle | Résultat |
|---|---|
| `npm run check` | PASS — 0 erreur, 0 avertissement |
| `npm run test:proto0`      | PASS — 366 tests, 0 échec                              |
| scénarios ciblés P02 | PASS — 17/17 moteur + 3/3 profils |
| `npm run simulate:proto02` | PASS — 6 profils + 1 000 runs |
| `npm run build` | PASS — client et SSR adapter-node |
| `git diff --check` | PASS |
| smoke HTTP local           | PASS — Docker, serveur Node et `/api/health` validés    |
| smoke navigateur           | À FAIRE — contrôle visuel humain desktop/mobile         |

## Relecture des gates A à J

- A démarrage/plateau : satisfaite.
- B économie : satisfaite ; réservations et sorties bloquées couvertes par tests.
- C inventaire/bâtiments : satisfaite ; stockage, démontage, délai et recyclage couverts.
- D recherche/RPG : satisfaite ; Transformation, cinq améliorations, niveau utile maximal et limite cumulée.
- E défense : satisfaite ; seule Affaiblissement est visible et active.
- F onde/victoire : satisfaite ; croissance stricte et deux fins de run testées/simulées.
- G équilibrage : satisfaite au niveau laboratoire ; playtest humain encore nécessaire pour affiner.
- H UX/visuel : satisfaite statiquement ; contrôle navigateur réel recommandé.
- I rapports/persistance : satisfaite.
- J stabilité : satisfaite pour check, tests, simulation et build ; smoke réseau bloqué par le sandbox.

## Simplifications et dette restante

Le parcours actif reste limité à trois modules P02 et une page, sans couche de compatibilité avec P01. Aucun nouveau fichier, sous-système ou paquet n’a été ajouté pendant la consolidation. Les paramètres restent peu nombreux et lisibles.

Dette restante : glyphes/CSS temporaires au lieu d’assets finaux ; smoke visuel desktop/mobile à effectuer hors sandbox ; simulation économique complète non modélisée statistiquement ; moteurs P01 conservés comme historique isolé. Aucune décision de game design P02 n’est requise.

## Commandes exactes de revue et de mise en ligne

Depuis la racine :

```bash
cd app
PATH=/SSD-Sata/CONTainers-Data/Codex_CLI/tools/node-v24.19.0-linux-x64/bin:$PATH npm run check
PATH=/SSD-Sata/CONTainers-Data/Codex_CLI/tools/node-v24.19.0-linux-x64/bin:$PATH npm run test:proto0
PATH=/SSD-Sata/CONTainers-Data/Codex_CLI/tools/node-v24.19.0-linux-x64/bin:$PATH npm run simulate:proto02
PATH=/SSD-Sata/CONTainers-Data/Codex_CLI/tools/node-v24.19.0-linux-x64/bin:$PATH npm run build
cd ..
git diff --check
git status --short
git diff -- app/src/lib/proto02 app/src/routes/+page.svelte app/tests/proto0/p02-game.test.ts docs/development/proto0.2/IMPLEMENTATION_REPORT.md
```

Commit local à effectuer hors sandbox après revue :

```bash
git add app/src/lib/proto02/game.ts app/src/lib/proto02/simulation.ts app/src/routes/+page.svelte app/tests/proto0/p02-game.test.ts docs/development/proto0.2/IMPLEMENTATION_REPORT.md
git commit -m "fix: consolider l alpha jouable PROTO-0.2"
```

Procédure de mise en ligne existante à exécuter uniquement après commit/revue humaine :

```bash
docker build -t avelune-proto02 ./app
docker run --rm -p 3000:3000 avelune-proto02
curl --fail http://127.0.0.1:3000/api/health
```

### Validation hors sandbox — 8 août 2026

La revue humaine hors sandbox a confirmé :

- `npm run check` : PASS — 0 erreur, 0 avertissement ;
- `npm run test:proto0` : PASS — 366 tests, 0 échec ;
- `npm run simulate:proto02` : PASS ;
- `npm run build` : PASS ;
- construction de l’image Docker : PASS ;
- démarrage du serveur Node dans un conteneur temporaire : PASS ;
- `/api/health` : PASS, réponse `{"status":"ok","prototype":"PROTO-0"}` avant correction finale du libellé ;
- le libellé du healthcheck a ensuite été corrigé en `PROTO-0.2` et les contrôles check/tests/build ont été rejoués avec succès.

Le contrôle visuel humain desktop/mobile reste le dernier contrôle avant publication.

Cette procédure est fournie pour la revue ; aucun push, merge ou déploiement public n’a été exécuté.
