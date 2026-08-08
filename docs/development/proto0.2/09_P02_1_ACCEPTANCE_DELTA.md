# PROTO-0.2.1 — Critères d’acceptation delta

Statut : **actif pour le prochain lot**.

Ce document complète `04_ACCEPTANCE.md`. Il ne valide pas encore les nouveaux arbitrages mécaniques de PROTO-0.2.2 ; il cible la structure UX issue de la revue humaine de `proto-0.2.0-tech`.

## A. Composition en blocs

- les données du Corcite sont regroupées avec son identité ;
- les ressources sont compactes, lisibles et accompagnées d’un vocabulaire/pictogramme cohérent ;
- la navigation, l’espace principal, le contexte et l’activité sont des blocs séparables ;
- aucun bloc n’est dupliqué uniquement pour le mobile ;
- desktop et mobile utilisent les mêmes sources de données et composants métiers.

## B. Desktop à zoom 100 %

Sur une fenêtre desktop courante :

- la structure générale reste utilisable à zoom navigateur 100 % ;
- l’utilisateur n’a pas à dézoomer pour comprendre ou manipuler l’écran ;
- les zones importantes ne sont pas écrasées par du chrome ou des cartes surdimensionnées ;
- le contenu peut défiler lorsqu’il est réellement long, mais la composition ne doit pas dépendre d’un écran exceptionnellement haut ou large.

## C. Structure du Corcite

- abandon du terme joueur « Plateau » dans la navigation principale ;
- terme provisoire : `Structure` / `Structure du Corcite` ;
- géométrie des hexagones stable avant, pendant et après implantation ;
- aucune superposition visuelle involontaire ;
- la sélection ou l’implantation ne doit pas provoquer un déplacement temporaire des cases ;
- les gisements restent distinguables des bâtiments ;
- une densité de gisements plus faible peut être testée sans figer encore le nombre canonique.

## D. Démarrage et ressources d’amorçage

- les matières primaires initiales sont visibles dès le départ comme ressources d’amorçage ;
- poser le premier stockage ne doit pas donner l’impression que les ressources viennent d’être créées ;
- l’interface distingue explicitement l’existence d’une ressource et sa capacité de stockage ;
- aucune matière transformée/composant n’apparaît gratuitement.

Ce lot ne tranche pas encore la composition finale du kit initial.

## E. Icônes et lecture

- stockage, énergie, entretien, construction, extraction organique, extraction minérale et fabrication défensive ont des pictogrammes suffisamment distincts ;
- une icône ne porte jamais seule l’information critique ;
- les mêmes symboles et libellés sont réutilisés dans HUD, structure, production, recherche et rapports lorsque pertinent.

## F. Évolution

- les cartes de recherche sont densifiées ;
- chaque recherche affiche au minimum nom, effet, coût/durée/état de façon compacte ;
- une représentation des relations/déblocages est visible ;
- ne pas inventer de dépendances mécaniques qui n’existent pas seulement pour faire joli ;
- le joueur doit pouvoir comprendre ce qu’un choix ouvre ou améliore.

## G. Production / fonctions importantes

- une fonction de production majeure ne doit pas être confinée à un petit inspecteur ;
- préparer une zone/navigation `Production` réutilisable lorsque les fonctions pertinentes existent ;
- l’inspecteur reste adapté à la sélection locale et aux actions contextuelles ;
- le lot peut préparer cette séparation sans inventer de nouveaux systèmes économiques.

## H. Déploiement initial

- le kit initial n’occupe pas un bandeau permanent dans les vues où il n’est pas pertinent ;
- hors de la vue Structure pendant le déploiement, afficher au plus une indication compacte et un moyen de retourner au bon endroit ;
- une fois le déploiement terminé, le kit disparaît de l’interface courante.

## I. Corcite et ambiance visuelle

- la représentation du Corcite ne doit plus ressembler principalement à une planète, un atome ou un héros ;
- privilégier une forme abstraite, asymétrique, biomorphique, organique/minérale et non anthropomorphe ;
- conserver l’identité prune/violet/lavande/opaline ;
- augmenter la sensation de matière et de profondeur sans sacrifier la lisibilité.

## J. Passage de cycle

- une fin de cycle produit un feedback perceptible ;
- le joueur sait clairement qu’il est passé au cycle suivant ;
- un résumé des opérations résolues est disponible ;
- toute animation est courte, skippable/non bloquante et compatible `prefers-reduced-motion` ;
- ne pas introduire un faux temps réel mécanique.

## K. Sauvegarde

- autosauvegarde conservée ;
- état de sauvegarde explicite ;
- possibilité d’une action manuelle si cela améliore la confiance du joueur ;
- pas de gros bouton dominant si l’autosauvegarde rend l’action manuelle secondaire.

## L. Responsive mobile

À largeur mobile représentative :

- mêmes blocs fonctionnels que desktop ;
- ordre adapté à la priorité mobile ;
- pas de scroll horizontal structurel ;
- aucun drag obligatoire ;
- panneaux contextuels utilisables en drawer/bottom-sheet ou bloc vertical ;
- cibles tactiles suffisamment grandes ;
- pas de perte de fonction essentielle par rapport à desktop.

## M. Interdictions du lot 0.2.1

Ne pas profiter de cette passe UX pour :

- créer de nouvelles familles de tours ;
- réintroduire réseaux/ports/câbles ;
- ajouter une nouvelle ressource ;
- fixer arbitrairement le nombre final de vagues/cycles ;
- réécrire l’équilibrage complet avant PROTO-0.2.2 ;
- construire une design system générique ou un moteur de layout abstrait ;
- modifier la condition de victoire sans décision explicite.

## N. Sortie du jalon

PROTO-0.2.1 peut être considéré suffisamment cohérent pour push/tag lorsque :

- check/tests/build sont verts ;
- structure desktop contrôlée humainement à 100 % de zoom ;
- responsive mobile contrôlé humainement ;
- géométrie hexagonale stable ;
- ressources d’amorçage compréhensibles ;
- blocs fonctionnels réutilisés desktop/mobile ;
- progression/recherche plus lisible ;
- retour utilisateur documenté ;
- aucune régression mécanique P02 introduite.

Le tag recommandé à ce moment sera `proto-0.2.1-ux` ou un nom équivalent reflétant le contenu effectivement livré.
