# PROTO-0.2 — Rapport d’implémentation

**Statut : REVIEW_READY**

## Lot

- Identifiant : `P02-001`
- Branche : `develop/proto-0.2-ux-rules`
- Base : `3cea8b9`
- Commit applicatif : `72442edca0b7997b442aff2870adb11fb5a63f60`
- Commit final : `HEAD` (commit contenant ce rapport)
- Statut : `REVIEW_READY`

## Diagnostic initial

Le parcours navigateur historique était concentré dans une page Svelte de 3 495 lignes et dépendait encore du réseau direct, de la matière de vague, de l’espace abstrait et des quatre familles défensives P01. Ces moteurs restent isolés dans `src/lib/proto0/` pour la régression historique, mais ils ne structurent plus la route joueur. Le worktree était propre et la branche conforme au démarrage.

## Résumé jouable

Le testeur peut démarrer sur un plateau de 19 hexagones vide, poser obligatoirement le premier stockage puis organiser les sept bâtiments du kit. Il peut extraire les deux sols, rechercher Transformation, fabriquer et poser un transformateur, façonner composants, bâtiments et tours, agrandir ses capacités, démonter/remonter ou recycler des objets, affecter population et activité, placer les tours sur huit positions, traverser des ondes impromptues puis gagner en annulant une Puissance ou perdre à zéro Intégrité.

Le HUD affiche ressources disponibles et engagées, stockage, énergie, population, entretien et Intégrité. Les sorties pleines restent sur leur producteur. La recherche globale expose ses coûts, durées, effets et sa limite cumulée. Le rapport d’onde est distinct du journal de cycles. Une sauvegarde locale versionnée est restaurée automatiquement et une nouvelle partie est explicite.

## Principaux changements

- nouvel état P02 minimal et explicite dans `src/lib/proto02/game.ts` ;
- plateau hexagonal avec sol, prévisualisation et une fonction par case ;
- kit initial physique, sans stockage natif ni espace abstrait ;
- inventaire global, réservations, productions multi-cycles et sorties bloquées ;
- énergie `utilisée/capacité`, population, entretien et stockage dérivés des bâtiments ;
- recherche Transformation et cinq améliorations utiles, dont Stockage amélioré, avec quatre niveaux répétés cumulés maximum ;
- défense physique Affaiblissement sur huit positions ;
- onde à Puissance unique, croissance stricte, résolution séquentielle et fins de run ;
- persistance locale `v2` avec rejet propre du JSON ancien ou corrompu ;
- reconstruction de la page principale selon la composition Gen3 corrigée ;
- palette prune/violet/lavande/opaline, silhouettes biomorphiques en CSS, Corcite non anthropomorphe et responsive sous 760 px ;
- ajout de tests P02 et d’une commande de simulation déterministe.

## Briques réutilisables créées ou renforcées

- `GameState` sérialisable et transitions métier indépendantes de Svelte ;
- catalogues explicites de bâtiments, recettes, recherches et paramètres de laboratoire ;
- réservation/consommation/libération de coût ;
- sortie locale `{ id, quantity }` commune aux producteurs ;
- rapport de vague séquentiel ;
- profils de simulation déterministes.

Ces briques sont volontairement locales à P02 : aucun framework, bus d’événements, moteur de graphe, arbre technologique générique ou nouvelle dépendance n’a été ajouté.

## Migrations et règles actives

- réseau, ports, connexions et ancien espace abstrait absents du parcours actif ;
- aucune réserve énergétique courte ;
- aucune capacité de stockage native ;
- aucun transformé ni composant au départ (`4` organique, `4` minéral) ;
- Recyclerie fabricable dès le départ ;
- déplacement uniquement par démontage puis remontage au cycle suivant ;
- stockage non démontable si la charge restante dépasse la capacité ;
- une seule famille défensive visible : Affaiblissement ;
- aucune matière/captation de vague ;
- pas de compte à rebours exact : seulement trois indices textuels de proximité ;
- aucune limite fixe du nombre d’ondes.

## Paramètres d’équilibrage retenus

| Paramètre | Valeur |
|---|---:|
| Intégrité initiale | 60 |
| Première onde | cycle 6 |
| Intervalle minimum | 5 cycles |
| Retard déterministe | 0 à 2 cycles |
| Puissance initiale | 18 |
| Croissance de base | +8 |
| Accélération | +1 par écart successif |
| Affaiblissement par tour | 9 |
| Extraction de base | 2 |
| Stockage de base | 16 par membrane |
| Stockage amélioré | +6 par niveau et membrane |

Résultats des quatre profils déterministes :

- développement raisonnable : victoire testeur à l’onde 3, Intégrité 34 ;
- recherche puis défense : victoire testeur à l’onde 4, Intégrité 17 ;
- défense tardive : défaite à l’onde 3 ;
- économie sans défense : défaite à l’onde 3.

Puissances observées : `18, 26, 35, 45`; elles sont strictement croissantes. Les profils sans annulation terminent donc sans run neutre infini.

## Contrôles exécutés

Runtime utilisé : Node `v24.19.0`, dépendances installées par `npm ci --ignore-scripts` depuis le lockfile.

| Contrôle | Résultat | Détail |
|---|---|---|
| `npm run check` | PASS | 0 erreur, 0 avertissement |
| `npm run test:proto0` | PASS | 38 fichiers de tests passants, historiques inclus |
| Tests ciblés P02 | PASS | 9 scénarios regroupés dans `p02-game.test.ts` |
| `npm run simulate:proto02` | PASS | 4 profils, deux victoires et deux défaites attendues |
| `npm run build` | PASS | build SSR et client Vite/SvelteKit |
| Relecture desktop/mobile | PASS STATIQUE | grilles desktop, rupture tablette et layout mono-colonne/tap à 760 px |
| Smoke HTTP | NON EXÉCUTABLE | le sandbox refuse `listen(127.0.0.1)` avec `EPERM` |
| E2E navigateur | NOT_RUN | aucun navigateur/Playwright installé ; pas d’infrastructure ajoutée |

## Passe finale de simplification

- remplacement de la page P01 de 3 495 lignes par une page P02 ciblée ;
- suppression de quatre composants Svelte devenus sans appel (`CapacityDelta`, `FlowDiagram`, `ResourceCostPreview`, `TurnReportPanel`), soit 473 lignes ;
- aucune couche de compatibilité entre états P01 et P02 dans le parcours actif ;
- aucune abstraction à usage spéculatif ni nouvelle dépendance ;
- catalogues et paramètres rassemblés dans le seul module métier nécessaire ;
- recherche textuelle finale sans terme/mécanique P01 dans la route active ou `lib/proto02`.

## Écarts / dette volontaire

- les formes de bâtiments sont des glyphes/CSS temporaires, pas des assets finaux ;
- le smoke visuel dans un vrai navigateur reste à faire hors sandbox ;
- la Recyclerie rend une formule volontairement simple (`1 organique + 1 minéral`, bonus organique par niveau) ;
- les moteurs P01 et leurs tests restent dans le dépôt comme historique isolé, mais ne sont plus accessibles depuis la route principale.

## Décisions nécessaires

Aucune décision humaine nécessaire pour P02. Les questions futures listées dans `DECISIONS_NEEDED.md` restent hors périmètre.

## Fichiers ou zones particulièrement sensibles à revoir

- `app/src/lib/proto02/game.ts` : économie et paramètres de laboratoire ;
- `app/src/routes/+page.svelte` : parcours complet et responsive ;
- `app/tests/proto0/p02-game.test.ts` : critères mécaniques P02 ;
- `app/src/lib/proto02/simulation.ts` : profils de calibration.

## Instructions de test humain

1. Depuis `app/`, lancer `npm run dev` avec Node 24.
2. Choisir la membrane de stockage, une case libre, puis confirmer ; poser ensuite tout le kit.
3. Lancer Transformation dans Évolution et terminer un cycle.
4. Dans l’Atelier, fabriquer un Transformateur, le poser, puis façonner un composant.
5. Fabriquer une membrane supplémentaire si le stock approche de sa limite.
6. Dans la Fabrique défensive, fabriquer des tours et les placer dans Défenses.
7. Traverser les cycles, lire le rapport de chaque onde, puis adapter jusqu’à victoire ou défaite.
8. Recharger la page pour vérifier la restauration, puis utiliser Nouvelle partie.
9. Refaire le parcours vers 390 px de large pour contrôler les interactions tap et l’absence de scroll horizontal structurel.

## Revue et déploiement

Commandes de revue :

```bash
cd app
npm ci
npm run check
npm run test:proto0
npm run simulate:proto02
npm run build
```

Aucun push, merge, déploiement ou healthcheck public n’a été effectué.
