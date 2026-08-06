# PROTO-0.2 — Charte de version

Date de cadrage : 2026-08-06

## But de la version

PROTO-0.2 n’a pas pour but d’ajouter beaucoup de contenu. Son objectif est de transformer le prototype actuel en **mini-jeu mécanique limité mais réellement jouable**, afin de tester deux choses :

1. une **nouvelle ergonomie d’interface joueur**, beaucoup plus visuelle et manipulatoire ;
2. l’**affinage des règles de jeu** à partir de cette nouvelle représentation.

La question centrale n’est plus seulement « les moteurs fonctionnent-ils ensemble ? », mais :

> Le joueur comprend-il rapidement ce que fait son Corcite, peut-il agir naturellement, prend-il des décisions intéressantes et a-t-il envie de continuer ou de recommencer ?

## Nature du prototype

- Petit jeu terminable en une session.
- Contexte narratif minimal ; pas besoin de background développé pour valider la boucle.
- Boucle centrale conservée : **production / développement / évolution / défenses / onde / conséquences / adaptation**.
- Le RPG reste transversal et significatif : il produit recherches, choix, modificateurs, accès et déblocages qui changent réellement la façon de jouer.
- La représentation doit montrer les relations plutôt que demander au joueur de les reconstruire mentalement.

## Ce que PROTO-0.2 doit permettre d’évaluer

### Lisibilité
Le joueur identifie rapidement : ressources, énergie, population, entretien, stockage, fonctions actives, réseau productif, évolution et défenses.

### Manipulation
Le joueur affecte, active, relie et place sans passer par des formulaires techniques inutiles.

### Décision
Le jeu doit produire au moins quelques arbitrages compréhensibles : capacité, population, orientation de développement, préparation défensive, adaptation après une onde.

### Plaisir
Le test doit permettre de distinguer :
- « je ne comprends pas » ;
- « je comprends mais je n’aime pas » ;
- « je comprends et j’ai envie d’essayer autrement ».

## Ce qui justifie PROTO-0.2

PROTO-0.1 expose encore largement le modèle de données sous forme de pages, tableaux et commandes textuelles. PROTO-0.2 teste une hypothèse différente :

> **Le joueur voit son Corcite fonctionner et manipule directement les relations utiles.**

Ce changement d’hypothèse d’interaction justifie une nouvelle version de prototype sans exiger une réécriture générale des moteurs.

## Principe de développement

- **Ne pas repartir de zéro côté moteur.** Réutiliser les blocs existants lorsqu’ils restent valides.
- Accepter de reconstruire fortement la couche de présentation si nécessaire.
- Toute nouvelle brique doit, autant que raisonnable, être réutilisable dans les versions ultérieures.
- Ne pas sur-concevoir le futur système complet : construire le minimum qui teste correctement l’hypothèse actuelle.
