# Avelune — Manifeste de conception « Faire Monde »

> **Statut : CADRE normatif révisable — version de production expurgée**  
> Mise à jour : 9 août 2026  
> Ce document fixe les principes nécessaires au développement courant. Les motivations cosmologiques, recettes systémiques et causalités propriétaires classées **Cœur d’Avelune** sont conservées hors du dépôt.

## 1. Étoile polaire : Faire Monde

Avelune doit permettre au joueur d'inventer une manière d'habiter un monde partagé, d'y trouver sa place, d'y poursuivre ses propres buts et de participer, avec les autres Corcites, à ce que devient ce monde.

Le jeu n'impose pas une victoire finale universelle. Le joueur doit pouvoir se dire « j'ai gagné ce que je voulais gagner », puis continuer avec le même Corcite, changer de but, expérimenter une autre stratégie ou recommencer autrement.

Le triangle de finalité est :

- **Comprendre** : découvrir les phénomènes, matières, vagues, territoires, histoire et causalités accessibles du monde.
- **Habiter** : construire une manière viable d'exister, produire, s'organiser, arbitrer, se spécialiser ou rester adaptable.
- **Coévoluer** : accepter que les actions des Corcites modifient les conditions du monde et que ces conditions évoluent à leur tour.
- **Faire Monde** : point de rencontre de ces trois dimensions.

## 2. Liberté du joueur

Le jeu propose des prises, des résistances, des possibilités et des conséquences ; il ne dicte pas ce que le joueur doit vouloir.

- La victoire personnelle appartient au joueur.
- Le joueur n'a pas à déclarer ni formaliser son objectif dans l'interface.
- Les familles d'intention et archétypes de pratique sont des outils internes de conception et de test, jamais des profils imposés au joueur.
- Le jeu peut constater un accomplissement objectif ou historique, mais ne prétend pas savoir ce que le joueur considère comme sa victoire.

## 3. Un monde partagé et systémique

Avelune est un monde persistant dont les états locaux et globaux peuvent évoluer dans le temps.

- Le monde ne personnalise pas ses règles à partir d'un profil comportemental individuel.
- Les actions collectives peuvent produire des conséquences globales.
- Le monde conserve une autonomie de fonctionnement même lorsque l'activité des joueurs est faible.
- Les changements doivent rester cohérents, progressifs et observables sans obliger le joueur à connaître les mécanismes internes.

Les explications profondes de cette autonomie et les mécanismes exacts qui la produisent relèvent du **Cœur d’Avelune** et ne sont pas documentés dans ce dépôt.

## 4. Un seul jeu

Le sujet principal est **le Corcite dans Avelune**.

TD, TF et RPG sont trois lentilles d'action et de compréhension du même sujet :

- **TF** : énergie, population, besoins, production, stockage, transport, espace, entretien, réseaux et transformations matérielles.
- **RPG** : race, classe, métier, compétences, mémoire, connaissance, relations, mues et progression.
- **TD** : recevoir, transformer, capter, laisser passer ou modifier ce qui vient du monde.

Le Monde et le Corcite ne constituent pas un quatrième sous-jeu parallèle.

## 5. Doctrine UX

**La difficulté doit être décisionnelle, jamais opératoire.**

Le jeu peut être profond et difficile, mais la difficulté ne doit pas venir de la mémorisation de menus, de l'organisation arbitraire de l'interface, de clics répétitifs ou de microgestion sans décision.

Trois niveaux d'information :

1. **Percevoir** : état général, changement important, opportunité, décision qui approche.
2. **Comprendre** : cause accessible, dépendance et système concerné.
3. **Expertiser** : valeurs, historiques, projections, statistiques et modificateurs autorisés à être exposés.

Règles :
- montrer visuellement/spatialement les relations importantes quand c'est possible ;
- simplifier l'interface sans automatiser la stratégie ;
- conserver des repères stables et permettre une reprise après interruption ;
- traiter accessibilité, TDAH, TSA, troubles dys et surcharge cognitive comme contraintes de conception ;
- ne jamais personnaliser règles ou contenu à partir d'une inférence comportementale individuelle.

## 6. Évolution du monde

Le monde peut évoluer en réponse aux états globaux, aux actions agrégées des Corcites et à ses propres dynamiques autonomes.

Exigences de comportement :
- absence de réponse punitive artificielle ;
- changements suffisamment progressifs pour rester jouables ;
- possibilité d'historiser et d'expliquer les conséquences accessibles ;
- absence de calendrier global trivialement exploitable ;
- stabilité à long terme vérifiable par simulation et observabilité.

Les fonctions de transition, mémoires, pondérations, seuils, sources de variabilité et relations latentes sont **restreintes au Cœur d’Avelune**.

## 7. Vagues

Les vagues constituent un phénomène majeur de l'interaction entre le Corcite et le monde.

Exigences de production :
- leurs caractéristiques peuvent varier dans le temps ;
- leur évolution ne doit pas créer de rupture arbitraire instantanément ingérable ;
- leur cadence n'est pas obligatoirement fixe ;
- les joueurs doivent disposer d'indices et de moyens suffisants pour préparer, observer et comprendre ce qui leur est accessible ;
- les résultats doivent être traçables pour les outils de développement et d'administration.

La recette de composition, d'évolution et de naissance des vagues est **secrète et conservée hors GitHub**.

## 8. Diversité des stratégies

Avelune doit permettre plusieurs manières légitimes d'habiter le monde.

Le système ne casse pas volontairement une « méta » parce qu'elle est populaire. La progression qualitative est privilégiée à l'escalade numérique et à l'obsolescence artificielle.

## 9. Architecture technique

- état du monde et états des Corcites séparés mais reliés ;
- TD/TF/RPG alimentés par des interfaces de données stables ;
- séparation données / logique / UI ;
- composants réutilisables ;
- calcul serveur des états et agrégats globaux nécessaires ;
- transferts réseau limités aux états et deltas utiles ;
- moteurs versionnables, testables, simulables et auditables ;
- recettes propriétaires injectées au runtime sans être exposées dans la documentation ou le client.

## 10. Contrôle de dérive

À partir de ce manifeste, la préproduction doit principalement **remplir, tester et rendre productible** le cadre.

- Une idée nouvelle n'est pas une décision.
- Les idées périphériques vont au pool.
- Une proposition doit être challengée contre le système global, l'UX, la technique et le scope.
- Aucun propos de l'utilisateur ou de l'assistant n'est auto-validé.
- Une modification du CADRE nécessite un motif explicite.
- Aucun changement silencieux de doctrine.

## 11. Politique de secret

Deux niveaux documentaires sont désormais distingués :

### Dépôt de production
Contient les contrats, interfaces, exigences, règles visibles, décisions nécessaires au travail d'équipe et résultats de validation pouvant être partagés avec les personnes autorisées au dépôt.

### Cœur d'Avelune
Contient les vérités narratives réservées, recettes mécaniques, fonctions exactes, coefficients, seuils, causalités cachées et principes dont la révélation réduirait le mystère ou la valeur propriétaire du jeu.

Aucun secret d'exploitation (mots de passe, clés API, clés SSH) ne doit être stocké dans l'un ou l'autre ; ils relèvent d'un gestionnaire de secrets dédié.

## 12. Piliers non négociables

1. Faire Monde.
2. Liberté de victoire.
3. Complexité utile.
4. Monde systémique partagé.
5. Évolution progressive.
6. Un seul jeu.
7. Accessibilité structurelle.
8. Histoire et conséquences.
9. Pas de personnalisation comportementale individuelle du monde.
10. Pas de dérive silencieuse.
11. Séparation stricte entre documentation de production et Cœur d'Avelune.

## 13. Compatibilité documentaire

Les référentiels TD / TF / RPG restent valides en tant que spécifications détaillées lorsqu'ils ne contredisent pas ce manifeste et ne réexposent pas une information désormais classée Cœur d'Avelune.

Les anciens prototypes sont conservés pour traçabilité, sous réserve d'une future purge d'historique lorsque des contenus devenus secrets y ont été committés.

Le pool d'idées est une source permanente d'inspiration et un parking ; il n'a aucune force normative par lui-même.
