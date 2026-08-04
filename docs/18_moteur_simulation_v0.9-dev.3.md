# Moteur intégré de simulation v0.9-dev.3

## Périmètre

Le moteur reste limité au cœur fonctionnel :

- quatre corps-cités par défaut ;
- extension technique possible à six ;
- un ordre TD, un ordre TF et un ordre RPG par corps-cité et par tour ;
- résolution RPG, puis TF, puis TD ;
- dix tours de préparation au maximum ;
- révélation au tour 7, 8 ou 9 ;
- un tour de pré-vague ;
- progression de la vague depuis la Fracture vers la Lisière ;
- journal technique continu et exportable.

## Interactions testées

- le TF produit les ressources utilisées par les défenses TD ;
- le RPG augmente la production TF ;
- le RPG renforce ou répare le TD ;
- le RPG peut aider un autre corps-cité ;
- les vagues endommagent le corps-cité, le terrain ou les bâtiments ;
- l’interférence modifie la production et les compétences RPG.

## Modes de vague

### Comparaison

Chaque corps-cité reçoit la même puissance initiale. Les résidus sont conservés
séparément afin de comparer les stratégies.

### Trajectoire

Seuls les corps-cités du secteur traversé sont touchés. Le résidu transmis par
un corps-cité devient la puissance reçue par le suivant.

## Déterminisme

La seed et un curseur pseudo-aléatoire déterministe servent à choisir les
défenses, bâtiments ou compétences touchés lorsque plusieurs cibles sont
possibles. Une session rejouée avec les mêmes choix et la même seed produit les
mêmes sélections.

## Journal

Chaque événement possède :

- un numéro de séquence ;
- un tour ;
- une phase ;
- un code stable ;
- un corps-cité éventuel ;
- un message lisible ;
- des données techniques.

L’export rassemble l’en-tête de session, le journal intégral, l’état final des
corps-cités et l’état de la Lisière.
