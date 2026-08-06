# Avelune — PROTO-0 jouable miniature

Statut : cadre de développement issu du premier playtest humain.

## 1. Changement de finalité

P0 à P10 ont validé techniquement le fonctionnement et l'interaction des
moteurs TF, RPG et TD.

Le premier playtest humain a cependant montré que l'interface P10 exposait
davantage un banc de test qu'un jeu :

- chaîne TF déjà construite ;
- très peu de choix réels ;
- recherche unique ;
- TD insuffisamment lié à une véritable fabrication ;
- une seule vague ;
- rythme artificiellement fixé à dix tours ;
- activité du joueur trop souvent réduite à « terminer le tour ».

Le nouveau prototype doit répondre à une autre question :

> Est-ce qu'une version miniature d'Avelune produit déjà des choix,
> des arbitrages, des conséquences observables et l'envie d'adapter
> son Corcite ?

## 2. Principe directeur

Le prototype doit reproduire à échelle réduite le fonctionnement du jeu.

La réduction porte sur la QUANTITÉ de contenu :

- peu de ressources ;
- peu de bâtiments ;
- peu de recettes ;
- peu de recherches ;
- peu de modèles TD ;
- peu de vagues.

Elle ne doit pas supprimer les ÉTAPES fondamentales du jeu.

Une mécanique nécessaire à l'expérience ne doit pas être remplacée par une
automatisation uniquement parce qu'il s'agit d'un prototype.

## 3. Chaîne jouable minimale

Le prototype doit permettre de jouer réellement la chaîne suivante :

ressources du monde
→ extraction
→ stockage
→ transformation
→ fabrication
→ construction
→ énergie
→ entretien
→ population et travail
→ développement du Corcite
→ recherche et découvertes
→ fabrication des défenses
→ organisation du chemin TD
→ anticipation de la vague
→ vague
→ conséquences
→ récupération et adaptation
→ vague suivante.

Le RPG reste une couche transversale de progression, de connaissance,
de déblocages et de modificateurs. Il ne devient pas artificiellement
une boucle d'ordres symétrique au TF et au TD.

## 4. Départ du Corcite

Le Corcite doit commencer dans un état qui pourrait être celui du vrai jeu.

Le socle de départ contient uniquement ce qui est nécessaire pour permettre
les premiers choix :

- un Noyau du Corcite ;
- un stockage de base ;
- une petite population initiale ;
- une capacité énergétique vitale de base ;
- une capacité d'entretien vitale de base ;
- une capacité de travail cohérente avec la population ;
- un espace initial limité ;
- quelques ressources de départ.

Le Corcite ne commence PAS avec une chaîne productive complète.

En particulier, ne doivent pas être présents gratuitement au départ :

- tous les extracteurs nécessaires ;
- le transformateur ;
- le fabricateur ;
- les extensions énergétiques ;
- les extensions d'entretien ;
- les tours TD.

Les ressources initiales doivent permettre plusieurs premiers choix.
Elles ne doivent pas imposer une ouverture unique.

Les valeurs exactes relèvent de l'équilibrage et doivent être testées,
pas choisies arbitrairement comme règle définitive.

## 5. Construction

Le joueur doit construire lui-même le développement du Corcite.

Chaque construction doit exposer avant validation :

- son coût en ressources ;
- son besoin énergétique ;
- son besoin d'entretien ;
- son besoin en travail ;
- son occupation d'espace ;
- sa fonction.

Une construction doit pouvoir rendre une autre construction temporairement
impossible ou moins pertinente : le prototype doit créer de vrais arbitrages.

## 6. Extraction et stockage

Le joueur doit pouvoir :

- identifier les ressources accessibles ;
- construire les moyens d'extraction adaptés ;
- activer ou arrêter une extraction ;
- rencontrer une limite de capacité ;
- construire davantage de stockage ;
- constater les conséquences d'un stockage saturé.

Les unités de stockage restent individuelles.

## 7. Transformation et fabrication

Le joueur construit et pilote les unités de transformation et de fabrication.

Les chaînes déjà validées par le moteur doivent être conservées,
mais elles ne sont plus préinstallées comme état de départ.

Les buffers, priorités, répartitions et disponibilités N → N+1 restent
des propriétés du moteur.

## 8. Énergie

L'énergie doit devenir une contrainte réellement jouable.

Le joueur doit pouvoir voir :

- capacité normale ;
- consommation actuelle ;
- réserve courte ;
- coût énergétique prévisionnel d'une construction.

Le joueur doit pouvoir désactiver ou mettre en réserve des fonctions lorsque
le Corcite dépasse ce qu'il peut alimenter.

## 9. Entretien

L'entretien doit être une capacité réellement utilisée par les structures.

Le joueur doit pouvoir anticiper qu'une nouvelle construction risque de
dépasser les capacités d'entretien.

Les conséquences d'un déficit doivent être visibles et progressives,
sans introduire une micro-usure individuelle inutile dans ce prototype.

## 10. Population et travail

La population devient un état explicite du Corcite.

Le travail disponible dépend de cette population.

Une fonction nécessitant du travail ne démarre que lorsque son besoin complet
est satisfait.

Le joueur doit pouvoir :

- affecter du travail ;
- retirer du travail ;
- choisir quelles fonctions sont actives lorsque tout ne peut pas fonctionner ;
- développer progressivement la capacité humaine du Corcite.

## 11. Recherche et découvertes

Le prototype doit proposer plusieurs recherches.

Une recherche terminée ne doit pas appliquer silencieusement son résultat.

Cycle attendu :

recherche en cours
→ progression terminée
→ découverte en attente
→ début du tour suivant
→ présentation au joueur
→ explication du résultat
→ validation
→ application de l'effet
→ nouveau choix de recherche.

Les choix de recherche doivent pouvoir orienter plusieurs domaines :
production, Corcite, connaissance de la vague et défense.

## 12. Défenses TD

Une défense ne doit pas apparaître gratuitement sur le chemin.

Cycle attendu :

modèle accessible
→ fabrication
→ défense possédée
→ placement
→ organisation des huit positions
→ résolution de vague.

Le nombre de modèles reste volontairement réduit, mais doit permettre
plusieurs stratégies.

## 13. Plusieurs vagues

Une partie de prototype doit comprendre plusieurs vagues.

Une seule vague ne permet pas de tester l'adaptation du joueur.

La boucle recherchée est :

préparation
→ vague
→ observation
→ conséquences
→ adaptation
→ nouvelle préparation
→ vague suivante.

Le nombre de vagues doit être paramétrable.

Une configuration de laboratoire peut utiliser plusieurs vagues de référence,
mais ce nombre ne constitue pas une règle définitive du jeu.

## 14. Information sur la vague

La règle historique « vague révélée uniquement dans les trois derniers tours
d'une partie de dix tours » n'est plus une contrainte du prototype jouable.

Le principe conservé est uniquement :

> plus une vague approche, plus l'information disponible peut devenir précise.

La recherche, la connaissance et les capacités du Corcite doivent pouvoir
influer sur cette information.

## 15. Conséquences et récupération

Une vague ne produit pas seulement un rapport.

Elle modifie la situation du cycle suivant.

Le prototype doit rendre jouables au minimum :

- l'état du Corcite après la vague ;
- les conséquences résiduelles pertinentes ;
- la récupération ;
- les besoins supplémentaires éventuels ;
- la matière captée ;
- la connaissance produite.

## 16. Captation

La matière captée doit revenir dans l'économie du jeu.

Elle doit pouvoir contribuer à au moins une progression réelle :

- fabrication ;
- construction ;
- amélioration ;
- recherche ;
- ou déblocage.

Elle ne doit pas rester uniquement un compteur de rapport.

## 17. Interface

L'interface doit être conçue pour téléphone ET bureau.

Sur téléphone, elle ne doit pas simplement empiler le tableau de bord desktop.

Les vues principales doivent être explicites, par exemple :

- Corcite ;
- Ressources et construction ;
- Production ;
- Recherche ;
- Défense ;
- Vague ;
- Carnet de test.

Une synthèse persistante peut montrer les états critiques :

- temps / cycle ;
- énergie ;
- entretien ;
- population / travail ;
- stockage ;
- proximité de la vague.

## 18. Carnet de test

Le testeur doit disposer d'une zone de notes intégrée.

Le carnet doit permettre au minimum :

- texte libre ;
- conservation pendant la session ;
- repérage du moment de la partie.

Des catégories rapides pourront être ajoutées :

- incompréhensible ;
- intéressant ;
- frustrant ;
- idée ;
- bug.

## 19. Critère de réussite

Le prototype n'est pas validé parce que toutes ses fonctions s'exécutent.

Il est validé comme support d'équilibrage si le joueur peut expliquer une
séquence du type :

> J'ai construit A plutôt que B.
> Cela m'a donné un avantage et créé une faiblesse.
> La vague l'a révélée.
> J'ai modifié mon Corcite ou ma recherche.
> La vague suivante s'est donc déroulée différemment.

Le bouton « terminer le tour » ne doit jamais constituer l'essentiel de
l'activité du joueur.

## 20. Ordre de développement

Les lots portent désormais des noms fonctionnels.

1. Départ du Corcite
2. Construction et ressources
3. Extraction et stockage
4. Transformation et fabrication
5. Énergie, entretien et population
6. Recherche et découvertes
7. Fabrication et organisation TD
8. Cycle des vagues
9. Conséquences et récupération
10. Économie de la captation
11. Interface mobile et bureau
12. Carnet de test
13. Équilibrage et simulations
14. Playtest complet

Chaque lot doit être construit en réutilisant les composants P0–P10 déjà
validés lorsqu'ils correspondent toujours au fonctionnement du jeu.

<!-- PROTO0_DURATION_RULE_2026_08_06 -->
## Règle de durée retenue pour le prototype jouable

Extraire, produire, construire/fabriquer et rechercher utilisent
une durée de référence d'un tour dans le PROTO-0.1.

Pour les décisions matérielles :

`décision N → réservation à la résolution → achèvement fin N → utilisation N+1`

Cette durée n'introduit aucun quota arbitraire d'actions par axe.
