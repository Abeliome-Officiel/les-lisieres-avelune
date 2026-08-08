# PROTO-0.2 — Sous-versions, rythme et jouabilité humaine

Date : 2026-08-08
Statut : **delta normatif actif à partir de PROTO-0.2.1**.

Ce document ne réécrit pas l’historique de `01_RULES_AND_SCOPE.md`, `02_UX_SPEC.md` et `04_ACCEPTANCE.md`. Il décrit ce qui change après la revue humaine de `proto-0.2.0-tech` et prévaut lorsqu’il existe une contradiction explicite.

## 1. Pourquoi des sous-versions

PROTO-0.2 doit rester traçable. Une phase suffisamment cohérente doit être :

1. testée ;
2. commitée ;
3. poussée sur `develop/proto-0.2-ux-rules` ;
4. taguée lorsqu’elle constitue un vrai point de référence ou de retour arrière.

Ne pas attendre une supposée « fin du prototype » pour pousser tout le travail d’un bloc. Inversement, ne pas taguer chaque correctif mineur.

Sous-jalons de travail :

| Sous-version | Objet | Critère de sortie |
|---|---|---|
| `proto-0.2.0-tech` | baseline technique avant refonte humaine | moteur, tests, build et Docker sains ; UX jugée insuffisante après revue visuelle |
| `PROTO-0.2.1` | structure UX et composition responsive par blocs | interface lisible à zoom 100 %, géométrie stable, blocs réutilisables desktop/mobile, vocabulaire et informations prioritaires corrigés |
| `PROTO-0.2.2` | ouverture, économie primaire et premier combat | le joueur peut entrer vite dans la boucle, produire une défense de base avec les matières primaires et vivre une première confrontation pédagogique |
| `PROTO-0.2.3` | croissance du Corcite et choix de développement | montée du débit économique/décisionnel, production plus lisible, progression compréhensible, choix réel entre quantité et qualité défensive |
| `PROTO-0.2.4` | rythme du run complet | début, montée de tension et fin cohérents ; rapports/transition de cycle ; équilibre multi-vagues mesuré |
| `PROTO-0.2.5` | candidate de playtest | polish, desktop/mobile, corrections issues de vrais runs humains, documentation à jour |

Les noms de tags intermédiaires pourront être plus précis (`proto-0.2.1-ux`, etc.) lors de la clôture effective du jalon.

## 2. But réel de PROTO-0.2

PROTO-0.2 doit valider simultanément :

- **interface** : organisation de l’information et navigation ;
- **plaisir visuel** : identité Avelune perceptible sans attendre la direction artistique finale ;
- **ergonomie** : compréhension et manipulation par un humain sans reconstruire le moteur mentalement ;
- **jouabilité** : décisions intéressantes et progression perceptible ;
- **mini-jeu** : un run possède un début, une montée en puissance et une fin.

La mention antérieure « environ 10–15 minutes » est une **intention de brièveté**, pas une contrainte chiffrée actuelle. La durée, le nombre de cycles et le nombre typique de vagues doivent être mesurés lors des runs humains avant d’être figés.

## 3. Principe de rythme inspiré du RTS, sans transformer Avelune en RTS

Ne pas réinventer artificiellement la progression d’une base : reprendre la grammaire éprouvée du genre RTS tout en conservant les mécaniques propres à Avelune.

Le rythme recherché est :

```text
ouverture lente et lisible
→ premières briques économiques
→ première défense rapidement utile
→ première confrontation précoce
→ augmentation progressive des capacités
→ davantage de productions et décisions possibles en parallèle
→ choix de développement
→ montée de la pression des vagues
→ victoire ou défaite du mini-jeu
```

Le début peut être plus lent parce que le joueur apprend, mais le Corcite doit ensuite **gagner en débit** : davantage de bâtiments, de ressources, de fabrications et de décisions utiles par cycle.

Ne pas créer un quota abstrait d’actions croissant avec les cycles. Cette accélération doit découler des capacités effectivement développées.

## 4. Première confrontation

Une confrontation doit apparaître assez tôt pour que le joueur comprenne concrètement :

- qu’une menace existe ;
- ce qu’est une vague ;
- ce que fait une défense ;
- ce qu’est la Puissance résiduelle ;
- pourquoi améliorer sa capacité défensive a un intérêt.

Elle doit être pédagogique et ne pas punir un joueur qui découvre encore l’interface.

Point encore à calibrer et tester : distinguer « impossible de perdre le run sur la première vague » de « première vague sans aucune conséquence ». La première option est actuellement préférée car elle enseigne mieux l’enjeu, mais elle doit être validée par le playtest et les simulations.

Ne pas figer immédiatement un cycle exact d’arrivée. Le critère est humain : la première confrontation doit survenir rapidement **après que le joueur a eu une possibilité réelle de préparer au moins une défense de base**.

## 5. Matières primaires et défense de base

Les matières organiques et minérales ne sont pas des ressources de tutoriel destinées à devenir rapidement inutiles.

À partir de PROTO-0.2.2 :

- les matières primaires doivent permettre de mettre en place l’économie fondamentale ;
- elles doivent permettre de fabriquer la **première défense d’Affaiblissement** sans exiger préalablement Transformation ;
- les matières transformées et composants constituent une montée de sophistication qui se mérite ;
- les recettes avancées peuvent continuer à consommer des matières primaires afin que celles-ci gardent une valeur.

Transformation ne doit plus être le ticket d’entrée vers la première action défensive intéressante.

## 6. Rythme défensif visé

Cible qualitative à simuler, pas chiffres canoniques :

- vague 1 : la défense de base est suffisante pour découvrir le combat et survivre ;
- vague 2 : une stratégie encore essentiellement primaire doit pouvoir survivre ; des signes de limite commencent à apparaître ;
- vague 3 : une défense d’ouverture restée statique devient clairement tendue ;
- vague 4 et suivantes : ne pas avoir développé sa capacité défensive doit produire de vrais dégâts et conduire à terme à la défaite.

Cette cible ne signifie **pas** que le jeu impose une technologie de défense précise.

## 7. Quantité ou qualité : choix du joueur

Le joueur choisit comment augmenter sa défense.

Deux stratégies doivent être réellement envisageables :

1. **multiplier les tours de base**, ce qui demande davantage de ressources, de fabrication, de capacité et d’emplacements ;
2. **améliorer l’efficacité**, via progression, économie secondaire et/ou défense plus performante.

Le jeu ne doit pas introduire un plafond arbitraire qui rend une tour de base inefficace simplement parce qu’une vague porte un numéro élevé.

La limite de la stratégie de quantité doit venir de coûts et contraintes réelles : temps de fabrication, débit de production, ressources, stockage, économie d’opportunité et nombre d’emplacements tactiques.

La stratégie d’amélioration doit gagner en **efficacité par ressource / par cycle / par emplacement**, pas devenir un verrou obligatoire.

Une stratégie mixte peut naturellement être très efficace, mais aucune voie ne doit être artificiellement déclarée correcte.

### Critère d’équilibrage

Les simulations doivent rechercher un espace où :

- le spam de tours de base est viable à court terme mais coûteux à soutenir ;
- l’amélioration augmente l’efficacité mais exige un investissement ;
- aucune stratégie n’est universellement dominante ;
- une défense d’ouverture laissée inchangée finit par être dépassée.

## 8. Durée et nombre de vagues : ne pas figer trop tôt

Le mini-jeu doit être **court, rejouable et assez long pour qu’une progression soit ressentie**.

Ne pas fixer encore :

- exactement 10 ou 15 minutes ;
- exactement N cycles ;
- exactement N vagues.

Mesurer lors des prochains playtests :

- durée jusqu’à la première action comprise ;
- durée jusqu’à la première défense ;
- durée jusqu’à la première vague ;
- nombre de décisions significatives par cycle ;
- nombre de vagues jusqu’à victoire/défaite ;
- durée totale du run pour un nouveau testeur et pour un joueur connaissant déjà les règles.

La règle de victoire reste pour l’instant : première vague réduite à `0` → victoire testeur ; Intégrité à `0` → défaite testeur. Si cette règle provoque des victoires pédagogiquement trop précoces malgré un équilibrage raisonnable, la décision devra être réouverte explicitement au lieu de tricher sur les coûts.

## 9. Kit initial : point à rouvrir

La baseline `proto-0.2.0-tech` donne sept fonctions gratuites à implanter. La revue humaine montre un risque important : le premier cycle ressemble à une checklist abondante, puis le cycle suivant paraît artificiellement vide.

Ne pas conserver automatiquement cette composition par inertie.

À étudier pour PROTO-0.2.2 :

- kit plus réduit ;
- certaines fonctions réellement construites avec les matières d’amorçage ;
- maintien d’un démarrage suffisamment rapide pour ne pas retarder excessivement la première confrontation.

La composition exacte du kit reste **ouverte** tant qu’une simulation + un run humain ne permettent pas de comparer.

## 10. Gisements : densité à tester

Les gisements sont non épuisables dans ce proto et la position hors extraction n’a pas d’effet.

Une trop forte densité surcharge visuellement l’espace sans créer de choix utile.

Tester une densité faible en PROTO-0.2.1/0.2.2. Une hypothèse de laboratoire de `2 organiques + 2 minéraux` sur la carte actuelle peut servir de point de départ, mais **ce nombre n’est pas canonique**.

La question à observer est : la croissance économique doit-elle principalement venir de davantage d’extracteurs ou de meilleurs extracteurs ?

## 11. Vocabulaire spatial

Ne pas utiliser « membrane » pour désigner l’espace général du Corcite.

Terme UX provisoire recommandé :

- navigation : **Structure** ;
- zone : **Structure du Corcite** ;
- cellule : **emplacement** ou **case** selon lisibilité.

Ce vocabulaire est fonctionnel et non canonique du lore. Il pourra évoluer si un terme de monde plus juste est défini.

## 12. Architecture UX par blocs

La composition ne doit plus être pensée comme une grande page desktop à comprimer ensuite.

Définir des blocs fonctionnels stables :

- **A — Identité / état du Corcite** : nom, cycle/vague, Intégrité, énergie, population, entretien ;
- **B — Ressources** : organique, minéral, transformé, composant, stockage, réservations pertinentes ;
- **C — Navigation** : Structure, Évolution, Production lorsqu’elle existe, Défenses, rapports/activité selon besoin ;
- **D — Espace de travail** : structure hexagonale, arbre, production ou défense ;
- **E — Contexte** : sélection, prévisualisation, action locale ;
- **F — Activité** : ordres, productions, progression du cycle, rapports, sauvegarde.

Desktop organise ces blocs spatialement. Mobile réutilise **les mêmes blocs et les mêmes données**, avec ordre différent, panneaux repliables, drawer ou bottom-sheet lorsque pertinent.

Ne pas maintenir une logique desktop et une logique mobile séparées.

## 13. Enseignements visuels de `proto-0.2.0-tech`

À corriger avant candidate de playtest :

- hexagones qui semblent se superposer ;
- géométrie qui bouge lors d’une implantation ;
- écran trop grand à zoom navigateur 100 % ;
- ressources supérieures trop volumineuses ;
- caractéristiques du Corcite trop petites et éloignées de son identité ;
- ressources d’amorçage invisibles avant la pose du premier stockage, donnant une impression de création ex nihilo ;
- pictogrammes insuffisamment explicites ;
- représentation visuelle du Corcite trop proche d’une sphère/planète magique et trop éloignée de l’ambiance souhaitée ;
- cartes de recherche trop grandes et sans lecture d’arbre/dépendances ;
- kit initial affiché hors de son contexte ;
- fonctions importantes de fabrication confinées dans un inspecteur trop petit ;
- absence de feedback suffisamment perceptible lors du passage d’un cycle au suivant.

## 14. Sauvegarde et passage de cycle

Conserver l’autosauvegarde. Ajouter une indication explicite de l’état de sauvegarde et, si utile, une action manuelle « Sauvegarder maintenant » sans en faire l’action principale du jeu.

Le passage de cycle doit produire un feedback visible : résumé des opérations et progression. Une courte transition/animation peut être utilisée si elle reste :

- rapide ;
- non bloquante ou skippable ;
- compatible `prefers-reduced-motion` ;
- purement représentative de la résolution, sans suggérer un faux temps réel.

Le rapport du cycle précédent doit rester consultable après la transition.

## 15. Principe de non-auto-validation

Aucun point n’est considéré bon parce qu’il a été implémenté ou parce que les tests passent.

À chaque sous-jalon, distinguer :

- **fonctionne techniquement** ;
- **est compréhensible** ;
- **est ergonomique** ;
- **produit une décision intéressante** ;
- **sert le rythme du mini-jeu**.

Une solution techniquement verte peut être rejetée après test humain, comme l’a montré `proto-0.2.0-tech`.

## 16. Zones d’ombre actives

Ne pas masquer les questions suivantes derrière des valeurs arbitraires :

1. composition exacte du kit initial ;
2. moment exact de la première confrontation ;
3. première vague : non létale seulement ou totalement sans dégâts ;
4. densité optimale des gisements ;
5. équilibre entre expansion horizontale (plus d’extracteurs/tours) et amélioration verticale ;
6. débit optimal des ateliers/fabriques pour que le nombre d’actions utiles augmente réellement ;
7. matérialisation de l’amélioration défensive : amélioration des tours existantes, niveau physique supérieur, ou combinaison des deux ;
8. nombre typique de vagues et de cycles d’un run ;
9. durée humaine réelle d’un run ;
10. si la victoire immédiate sur première annulation d’une vague reste compatible avec une progression intéressante.

Ces points sont à résoudre par combinaison de simulation, prototype et playtest, pas par goût arbitraire.
