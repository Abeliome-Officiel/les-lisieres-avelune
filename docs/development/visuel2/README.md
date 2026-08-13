# VISUEL-2 — gate du premier renderer

**Statut :** préparation technique, non canonique.  
**Dépend de :** VISUEL-0 contrat/projection puis VISUEL-1 plan de rendu neutre.  
**Renderer de contrôle :** Canvas 2D, sans dépendance externe.

## Objet

VISUEL-2 doit fournir la première preuve qu'un rendu effectivement dessiné dans un navigateur peut conserver les invariants architecturaux déjà validés, tout en produisant des mesures assez propres pour comparer ensuite une autre technologie.

Le but n'est pas de produire la direction artistique finale. Le but est d'établir un **témoin remplaçable et mesurable**.

## Pourquoi Canvas 2D en premier

Canvas 2D est utilisé comme contrôle parce qu'il :

- est disponible nativement dans les navigateurs ;
- n'ajoute aucune dépendance ni couche de framework ;
- permet de mesurer le coût d'un rendu simple ;
- donne un point de comparaison à un futur renderer accéléré ou shaderisé ;
- peut être jeté sans changer le contrat ou la grammaire amont.

Une bonne performance de Canvas ne le sélectionne pas automatiquement. Une mauvaise performance ne condamne pas non plus la grammaire : elle déclenche une comparaison de renderer.

## Périmètre du probe

Le probe doit montrer uniquement :

1. une silhouette organique reconstructible ;
2. une matière/surface simple ;
3. un micro-mouvement déterministe ;
4. une transformation présentationnelle avant→après ;
5. les profils sobre / normal / riche ;
6. mouvement réduit ;
7. charge synthétique 1 / 16 / 64 / 128 formes ;
8. métriques navigateur.

## Mesures obligatoires avant enrichissement artistique

Sur au moins un poste représentatif, relever pour les profils sobre, normal et riche :

- 1, 16, 64 et 128 formes ;
- frame interval p50/p95/p99 ;
- temps de préparation/interpolation ;
- temps CPU d'émission des commandes de rendu ;
- charge CPU processus navigateur ;
- charge GPU lorsque l'outil système permet de l'observer ;
- mémoire processus navigateur ;
- comportement après plusieurs minutes ;
- impact du mouvement réduit ;
- consommation système lorsque mesurable de façon reproductible.

Ne pas confondre temps d'appel Canvas et temps GPU réel.

## Gate GO / NO-GO vers un renderer plus riche

### GO pour poursuivre la grammaire

- identité stable entre frames ;
- transformation continue et reconnaissable ;
- profil sobre lisible ;
- mouvement réduit informatif ;
- absence de dépendance au format source ;
- charge qui augmente de façon intelligible avec le nombre de formes ;
- aucune régression VISUEL-0/VISUEL-1.

### Comparaison de renderer requise

- Canvas devient le goulot dominant à une charge plausible ;
- les effets utiles exigent des contournements disproportionnés ;
- l'absence de shaders/instancing empêche un gain perceptif important ;
- la qualité normale ne peut être obtenue dans l'enveloppe de ressources.

### NO-GO architecture

- le renderer exige une donnée non prévue par le contrat uniquement pour fonctionner ;
- l'identité dépend d'un cache non reconstructible ;
- le mode sobre change la vérité ou l'identité de la forme ;
- mouvement réduit supprime une information ;
- une optimisation oblige à modifier le Cœur.

Dans un NO-GO architecture, on corrige la frontière ; on ne compense pas par davantage d'effets.

## Étape suivante si la gate passe

Comparer le témoin Canvas à **un seul** renderer candidat, probablement PixiJS si ses capacités mesurées correspondent au besoin 2D/2,5D. La comparaison se fait à contrat et scène identiques, avec les mêmes profils et les mêmes métriques. Aucun choix n'est fondé sur une démo isolée ou sur la popularité d'une bibliothèque.
