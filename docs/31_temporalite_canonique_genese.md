# Temporalité canonique — genèse, Fenêtre et passage au jeu

> **Statut : contrat partageable — v0.1**  
> Date : 17 août 2026  
> Les valeurs de conversion, paramètres internes, rythmes réservés et causalités propriétaires du Cœur restent hors GitHub.

## 1. Objet

Avelune distingue explicitement :

1. le **temps de laboratoire**, utilisé pour accélérer les expériences et qualifier le Cœur ;
2. le **temps canonique**, qui porte l’âge et l’histoire réels d’Avelune ;
3. le **temps humain**, auquel le monde est présenté et auquel les futurs systèmes de jeu devront s’articuler.

Le présent document concerne le rapport entre **temps humain et temps canonique du Cœur** pendant la genèse et les grandes phases de développement. Il ne fixe pas les durées des actions de gameplay.

## 2. Âge canonique

L’instance canonique possède un **âge monotone**. Un changement de vitesse de déroulement ne remet pas cet âge à zéro et ne réécrit pas ce qui s’est déjà produit.

La Fenêtre sur la Lisière doit exposer un **âge d’Avelune** dérivé de cet âge canonique. La forme éditoriale et l’unité publique restent ouvertes. Cette information ne doit pas permettre de reconstruire les paramètres ou mécanismes privés du Cœur.

## 3. Facteur temporel global

La conversion entre temps réel et temps canonique est une propriété explicite et versionnée de l’époque de développement. Elle n’est pas une loi biologique et ne constitue pas un réglage de difficulté.

Lorsqu’elle est modifiée, elle agit **globalement sur le Cœur**. Elle ne sert pas à accélérer séparément une famille d’événements, une perturbation, la reproduction, la récupération ou une autre composante afin d’obtenir un résultat souhaité.

Le facteur temporel ne dépend jamais :

- du nombre d’inscrits ;
- du nombre de joueurs actifs ;
- de la croissance ou de la décroissance de la communauté ;
- de la présence ou de l’absence des joueurs ;
- de la charge instantanée d’un service.

## 4. Phases de genèse et de développement

### Phase A — construction de la Fenêtre

Pendant la création technique du premier interpréteur permanent, la progression canonique doit rester volontairement **lente**. L’objectif est d’éviter que l’instance canonique ne mûrisse excessivement pendant que la Fenêtre elle-même est encore en construction, tout en conservant une histoire réelle observable et qualifiable.

### Phase B — ouverture publique de la Lisière / Fenêtre

À l’ouverture publique, la conversion peut être réévaluée. La cible perceptive est qu’un observateur contemplatif puisse remarquer des changements d’un jour à l’autre et lire plus nettement une histoire à l’échelle d’une semaine, sans imposer au monde une maturation artificiellement rapide.

La valeur n’est pas choisie à partir d’un calendrier marketing : elle doit confronter les temporalités biologiques mesurées dans le Cœur et la perception humaine recherchée.

### Phase C — époques de test avec Corcites

Le facteur reste stable **à l’intérieur d’une même grande phase de test**. Une transition explicite entre deux époques de développement peut justifier une nouvelle valeur, à condition de préserver l’âge et l’histoire canonique.

Les comptes ou Corcites de test peuvent éventuellement être remis à zéro si une nécessité technique ou de game design le justifie. Cette possibilité ne concerne pas le Cœur : l’histoire canonique continue.

### Phase D — sortie publique du jeu

À la sortie publique, le facteur de l’époque de production est **fixé et stable par défaut**. La fréquentation du jeu ne le modifie pas.

Une éventuelle révision future reste une question ouverte réservée à une transition majeure explicitement actée — par exemple une nouvelle époque ou une extension structurante — et non à la variation du nombre de joueurs.

## 5. Fenêtre sur la Lisière

Une fois mise en ligne, la Fenêtre reste un module permanent pendant :

- la poursuite du développement ;
- les phases de test ;
- la sortie du jeu ;
- les évolutions ultérieures du produit.

Elle montre le même monde canonique et son âge. Sa permanence ne signifie pas que sa composition graphique ou son emplacement soient figés.

## 6. Arrêts et reprise

Deux situations doivent rester séparées :

- si le jeu ou un interpréteur est indisponible alors que le Cœur fonctionne correctement, le Cœur continue sa trajectoire ;
- si le Cœur lui-même est arrêté, la politique du temps écoulé reste **ouverte** jusqu’aux essais opérationnels.

Les essais devront notamment comparer une pause canonique pendant l’arrêt et un rattrapage déterministe à la reprise. Aucun choix n’est acté ici avant qualification.

## 7. Fondement scientifique et méthode

La littérature écologique et éco-évolutive ne fournit pas une vitesse universelle applicable à Avelune. Elle montre en revanche l’importance des **échelles de temps**, de leur articulation et de la possibilité que dynamiques écologiques et évolutives opèrent à des cadences comparables.

Les références utilisées pour cette réflexion — notamment Levin (1992), Paine & Levin (1981), Schoener (2011) et Yoshida et al. (2003) — sont consignées avec leur portée et leurs limites dans `docs/25_coeur_vivant_references_methode.md`.

La méthode retenue est donc :

**préserver les rapports biologiques internes → mesurer les temporalités propres du Cœur → tester plusieurs conversions perceptives → choisir la vitesse d’une époque → la versionner et conserver l’histoire.**

## 8. Frontière de publication

Ce document décrit uniquement la politique générale de temporalité. Il ne publie ni facteur numérique, ni rythme interne réservé, ni seuil, ni mécanisme permettant de reconstruire les recettes du Cœur.
