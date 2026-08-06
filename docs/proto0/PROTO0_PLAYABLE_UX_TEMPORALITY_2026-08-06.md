# PROTO-0.1 — Lisibilité et temporalité jouable

Date : 6 août 2026.

Statut : jalon validé pour reprise du playtest humain.

## Objet

Ce jalon corrige en priorité les problèmes de lisibilité et
d'observabilité constatés lors du premier playtest du PROTO-0,
puis aligne la temporalité réelle du moteur avec la durée affichée
des actions du prototype.

## Interface joueur

La navigation principale est désormais organisée autour de :

- **Corcite** ;
- **Ressources** ;
- **Développement** ;
- **Vague** ;
- **Journal**.

Les termes internes TF, TD et RPG restent des notions
d'architecture et ne constituent pas des modes présentés au joueur.

Les ressources utilisent des noms joueur ; leurs identifiants
techniques restent conservés dans le domaine et les tests.

L'interface expose notamment :

- stocks permanents ;
- population totale, affectée et disponible ;
- énergie ;
- entretien et dette d'entretien ;
- capacité de stockage ;
- conditions et blocages des actions ;
- chaînes de production ;
- coûts et conséquences lisibles ;
- rapport du tour précédent ;
- historique des rapports dans le Journal ;
- choix de l'identité de testeur.

## Durée des actions du PROTO-0

Dans le prototype jouable :

- extraction : 1 tour ;
- production : 1 tour ;
- construction/fabrication : 1 tour ;
- recherche : 1 tour.

Cette durée ne limite pas arbitrairement le nombre de décisions
que le joueur peut prendre pendant un tour.

## Construction et fabrication

Une décision matérielle suit maintenant la séquence :

**décision pendant le tour N**
→ **planification**
→ **réservation à la résolution**
→ **achèvement en fin du tour N**
→ **utilisation à partir du tour N+1**.

Une structure construite pendant un tour ne peut donc plus produire
durant ce même tour.

Les décisions planifiées peuvent être annulées avant résolution.

Lorsque plusieurs décisions concurrentes réclament des ressources
insuffisantes, aucune priorité cachée n'est choisie par le moteur :
le tour reste ouvert et le joueur doit modifier son plan.

## Recherche

Toutes les recherches du catalogue jouable ont une durée d'un tour.

La référence RPG historique à trois tours reste inchangée.

Une recherche achevée au tour N produit une découverte présentable
à partir du tour N+1 ; ses effets ne sont appliqués qu'après
validation de cette découverte.

## Rapports joueur

Chaque résolution de tour génère un rapport joueur distinct des
journaux techniques.

Le rapport reprend notamment :

- variations des ressources ;
- état des capacités avant/après ;
- extraction, transformation et fabrication ;
- progression de recherche ;
- constructions et fabrications achevées ;
- avertissements utiles.

Le rapport complet de vague reste un objet distinct.

## Validation automatisée

Le jalon a été validé avec :

- 346 tests PROTO-0 réussis ;
- 0 erreur Svelte/TypeScript ;
- 0 warning Svelte ;
- build de production réussi.

## Suite

La prochaine étape de conception est un nouveau playtest humain
sur cette version.

Une modification structurelle supplémentaire du moteur ne devra
être décidée qu'à partir d'un problème reproductible observé dans
cette version.
