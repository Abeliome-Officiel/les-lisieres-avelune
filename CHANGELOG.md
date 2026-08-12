# Changelog

## Visuel du Cœur — contrat anti-réécriture et LAB VISUEL — 2026-08-13

- ajout de `docs/24_visuel_coeur_contrat_public.md` comme cahier de préproduction partageable ;
- autorisation d’avancer sur un LAB VISUEL avant achèvement complet du Cœur, uniquement via un sous-ensemble sémantique stable et versionné ;
- interdiction de prendre tables, classes, colonnes ou paramètres d’une révision R2.x comme API durable du visuel ;
- introduction d’un adaptateur de version entre Cœur/replays et contrat de représentation afin qu’une évolution interne soit absorbable sans réécriture de la grammaire ou des vues ;
- même contrat prévu pour fixtures synthétiques, replays de laboratoire et future instance canonique ;
- introduction de la mue comme cas de test précoce de continuité d’identité, sans prédéterminer la genèse des races ;
- découplage explicite des cadences du Cœur, de publication sémantique et de rendu ; rendu client par défaut et interpolation sans création de trajectoire canonique ;
- niveaux de qualité sobre / normal / riche avec le niveau normal comme cible, le riche comme bonus et le sobre comme mode fonctionnel ;
- budget du visuel à mesurer avec le jeu, le sonore et les autres charges pertinentes plutôt qu’isolément ;
- formalisation de gates avant investissement de production : contrat, replay, identité/mue, renderer remplaçable, évolution du Cœur absorbable par adaptateur, coût cumulé, accessibilité, dégradation et reconstructibilité ;
- ajout de références initiales à Algorithmic Botany/L-systems, Clades, réaction-diffusion, cohérence temporelle, Level of Detail, WCAG et documentation PixiJS ;
- mise à jour du contrat public du Cœur, de la roadmap, de l’index documentaire, du manifeste et des documents privés/lois correspondants ;
- maintien hors GitHub des correspondances exactes Cœur → morphologie, règles propriétaires d’héritage, seuils, seeds révélatrices, signatures de lignées et causalités réservées.

## Univers sonore — cadrage initial — 2026-08-13

- ajout du contrat partageable de l’univers sonore d’Avelune ;
- confirmation que le Cœur reste exclusivement le moteur d’évolution du vivant et que le sonore n’est qu’un interpréteur en aval de l’état canonique ;
- direction sonore initiale fixée à **satisfaisante · contemplative · onirique · féerique** ;
- séparation de la musique du monde, des sons du jeu et des signaux d’information ;
- accessibilité sensorielle conçue par réglages indépendants plutôt que par un unique « mode neuroA » ;
- moteur audio volontairement non choisi à ce stade et chantier maintenu hors du PROTO courant ;
- séparation documentaire entre contrat partageable et recettes internes : correspondances exactes, seuils, temporalités, motifs, signatures et causalités restent hors GitHub.

## Synchronisation Avelune — GitHub réouvert — 2026-08-12

- clôture du gel GitHub après nettoyage contrôlé de l’ancien historique ;
- ajout d’un état de pilotage partageable au 12 août 2026 ;
- ajout de l’état agrégé de validation du Cœur vivant jusqu’au diagnostic R2.10 ;
- maintien de l’implémentation détaillée du laboratoire CŒUR-0 hors GitHub ;
- migration vers GitHub du cadrage partageable du Tableau Réel ;
- Gate 0 TA3 reflété dans la documentation : runtime et stockage autonomes, aucune migration TA3 dans la base du PROTO ;
- correction du cadrage financier : date zéro officielle au 26 juillet 2026 et exclusion des paiements antérieurs de l’agrégat Avelune ;
- conservation de PROTO-0.2.2 sur `develop/proto-0.2.2-playtest` tant qu’une intégration explicite dans `main` n’a pas été décidée ;
- le brouillon historique de PR Tableau Réel est reclassé comme non fusionnable tel quel car son hypothèse d’intégration directe au runtime existant est dépassée par le Gate 0.

## PROTO-0.2 — cadrage actif et documentation publique — 2026-08-08

Le projet quitte la phase de simple analyse post-PROTO-0.1 et ouvre formellement le jalon **PROTO-0.2** sur `develop/proto-0.2-ux-rules`.

Documentation mise à jour pour refléter ce jalon sans présenter PROTO-0.2 comme déjà stable :

- `main` reste la baseline jouable et déployée de référence tant que PROTO-0.2 n’est pas revu et intégré ;
- la page principale du dépôt distingue clairement PROTO-0.1 stable et PROTO-0.2 actif ;
- `docs/index.md`, `docs/development/README.md` et `ROADMAP.md` pointent vers le cahier PROTO-0.2 ;
- le cahier actif formalise plateau hexagonal, économie physique simplifiée, stockage par bâtiments, recherche, défense `Affaiblissement`, vague à `Puissance` unique et conditions de victoire/défaite ;
- les anciennes caractéristiques `pression / structure / charge / matière capturable` restent historiques et ne sont plus considérées comme le canon futur de la vague ;
- Gen3 devient une référence de composition UX uniquement, corrigée par le brief visuel Avelune ;
- le run Codex long est documenté avec le worktree correct `repository-proto02`, `tmux`, journaux locaux et aucune autorisation de push/merge/déploiement ;
- la synchronisation locale/distante documente désormais le cas de branches divergentes avec fusion non destructive au lieu d’un reset.

Aucune publication de PROTO-0.2 n’est déclarée par cette entrée : tests, revue, push et déploiement restent à effectuer explicitement.

## post-PROTO-0.1 — nettoyage documentaire — 2026-08-06

Après fusion du PROTO-0.1 dans `main`, nettoyage des références devenues transitoires :

- `main` est désormais explicitement la source canonique du dépôt et du prototype intégré ;
- `develop/proto-0.1-playable` et les branches documentaires sont reclassées comme branches historiques de traçabilité ;
- la roadmap clôt le jalon PROTO-0.1 et place le projet en phase de discussion/analyse avant le prochain lot ;
- l’index documentaire ne présente plus de source parallèle à `main` ;
- la gate de playtest et le document UX/temporalité reflètent l’intégration finale ;
- la prochaine intervention de mise en page devra réduire la taille générale des polices d’un cran, de manière centralisée autant que possible.

Aucune mécanique ni mise en page du prototype n’est modifiée par ce nettoyage documentaire.

## proto-0-playable-audit - 2026-08-06

Audit du prototype jouable et remise à niveau de la documentation courante.

- branche courante explicitée : `develop/proto-0.1-playable` ;
- séparation documentaire entre état jouable actuel et historique P0-P10 ;
- audit de l'architecture réelle du coeur, de l'orchestration et de l'UI ;
- inventaire des paramètres configurables et des couplages encore compilés ;
- politique cible de données/rulesets versionnés ;
- architecture cible et règles de dépendances ;
- registre de dette technique priorisé ;
- stratégie tests/CI/E2E, sécurité serveur et versionnement des états ;
- ADR sur le coeur métier indépendant de l'UI et la cible data-driven ;
- manifeste transformé en inventaire sémantique, Git restant la source d'intégrité fichier par fichier.

Aucune mécanique de jeu n'est modifiée par ce jalon documentaire.

## PROTO-0 jouable - 2026-08-06

- Interface branchée sur les moteurs Lots 1-10.
- Cycle multi-vagues avec minimum de développement et retard variable.
- Carnet de test persistant et exportable.
- Simulations multi-graines automatisées.
- Parcours technique complet.
- Version préparée pour playtest humain.

## proto-0-spec.1 - 2026-08-04

Premier jalon de spécification du nouveau PROTO-0.

- boucle cible TF -> RPG minimal -> préparation TD -> vague -> conséquences ;
- 10 tours, une vague, un Corcite joueur et quatre Corcites simulés ;
- suppression de toute contrainte structurelle « un ordre par axe » ;
- définition de la résolution de fin de tour et des conflits de ressources ;
- stockage TF par unité et buffers directs N -> N+1 ;
- RPG réduit aux mécanismes nécessaires au test ;
- TD interne à huit positions ordonnées ;
- familles N1 : Atténuation, Déstructuration, Captation, Stabilisation ;
- vague nominale : pression 50, structure 60, charge 20, matière capturable 16 ;
- variation seedée ±2 % ;
- prévisions T-3 ±10 %, T-2 ±6 %, T-1 ±3 % ;
- rapport joueur de fin de vague séparé des logs techniques ;
- moteur headless avant interface ;
- ajout de la spécification, du référentiel JSON, du backlog et du rapport de simulations ;
- l'ancien prototype v0.9-dev.3 reste historique et n'est pas réutilisé comme moteur de PROTO-0.

## v0.8.3 - 2026-08-04

Baseline consolidée pré-prototype couvrant les décisions jusqu'au 2 août 2026.

- consolidation de la vision et des principes transversaux ;
- articulation explicite du Corcite entre TD, TF et RPG ;
- consolidation du monde partagé et persistant ;
- gouvernance par lots, statuts et journal de delta ;
- accessibilité intégrée comme contrainte de conception ;
- séparation explicite entre décisions actées et paramètres encore ouverts ;
- nouvelle roadmap du prototype v0.9 ;
- avertissement explicite contre la réintroduction des simplifications obsolètes de v0.8.

## v0.8.2 - 2026-08-04

Consolidation rétrospective de l'identité, de la progression et du monde.

- confirmation du monde partagé unique ;
- structuration des races et des classes ;
- réintégration du métier dans le RPG ;
- définition de la première mue test ;
- structuration des compétences et de l'Érudition ;
- définition du flux de création du Corcite ;
- connaissance mondiale globale et non attribuée ;
- clarification de la lecture relative des anneaux ;
- remplacement de l'ancienne dormance à débit minimal par une suspension réelle.

## v0.8.1 - 2026-08-04

Consolidation rétrospective des décisions prises après v0.8.

- restructuration du TD entre traitement global et parcours interne ;
- clarification de la captation et de la résolution automatique/manuelle ;
- consolidation du TF : stockage local, tampons, bifurcations, énergie et entretien ;
- repositionnement du RPG comme couche narrative et évolutive ;
- abandon de la règle générale « un ordre TD + un ordre TF + un ordre RPG » ;
- formalisation des besoins de télémétrie et de rééquilibrage ;
- ajout du dossier `docs/conception/` et du journal de delta v0.8.x.

## v0.8 - 2026-07-27

- socle minimal des trois axes déclaré prêt pour mini-prototype ;
- monde partagé R7, Fracture F1, deux anneaux de confort ;
- plafond initial du corps-cité fixé à sept cases ;
- vague simple et absence de dissipation générique ;
- cycle Murmures, Veille, Scellement, Passage, Retombées ;
- Lisière locale avec cinq états d'Entame ;
- TF minimal et progression horizontale ;
- Trame d'Avelune d100 hybride, trois modes de fiche et Dissonance ;
- Échos territoriaux et internes ;
- La Genèse, Les Prémices et L'Éveil intégrés au background ;
- ajout du mini-prototype algorithmique intégré ;
- décisions DEC-122 à DEC-144 et mécanismes MEC-083 à MEC-100.

## v0.7

- simplification des symbioses ;
- grille hexagonale définitive ;
- revue structurée des décisions et interactions.

<!-- PROTO0_PLAYABLE_UX_2026_08_06 -->
## PROTO-0.1 jouable — lisibilité et temporalité — 2026-08-06

- navigation joueur restructurée ;
- ressources et capacités rendues lisibles ;
- choix de testeur restauré ;
- rapports joueur de tour ajoutés ;
- recherches jouables ramenées à un tour sans modifier la référence historique ;
- construction et fabrication réellement résolues sur un tour ;
- annulation des décisions matérielles avant résolution ;
- conflits de ressources explicites sans priorité automatique ;
- validation : 346 tests réussis, 0 erreur, 0 warning et build production réussi.

Voir `docs/proto0/PROTO0_PLAYABLE_UX_TEMPORALITY_2026-08-06.md`.
