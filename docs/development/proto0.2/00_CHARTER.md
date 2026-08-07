# PROTO-0.2 — Charte de version

Date de cadrage consolidé : 2026-08-07

## But

PROTO-0.2 transforme le prototype existant en **mini-jeu mécanique borné et réellement jouable**, afin de tester :
1. l’ergonomie visuelle/manipulatoire du Corcite ;
2. la boucle économique et de progression ;
3. la préparation défensive ;
4. un challenge simple à vagues croissantes ;
5. l’envie de recommencer avec une autre organisation.

La question de test est :
> Le joueur comprend-il son Corcite, peut-il l’organiser naturellement, progresser assez vite pour annuler une onde avant que l’Intégrité tombe à zéro, et a-t-il envie d’essayer autrement ?

## Nature du prototype

- Petit jeu terminable en une session.
- Contexte narratif minimal.
- Boucle : `implantation → économie → recherche/évolution → défense → onde → conséquences → adaptation`.
- Plateau économique hexagonal simple, sans réseau direct actif.
- RPG transversal via recherches, choix, modificateurs et déblocages.
- Défense simplifiée autour d’une seule famille `Affaiblissement`.
- Onde simplifiée à une `Puissance` pour le challenge P02.
- Victoire testeur : première onde ramenée à `0`.
- Victoire jeu : Intégrité du Corcite à `0`.

## Ce que PROTO-0.2 doit permettre d’évaluer

### Lisibilité
Ressources, énergie, population, entretien, stockage, bâtiments, recherche, inventaire, défenses, Intégrité et état du run.

### Manipulation
Poser, sélectionner, activer, staffer, fabriquer, démonter/remonter, rechercher et placer les défenses sans formulaires techniques inutiles.

### Décision
Arbitrages de ressources, stockage, énergie, population, progression et préparation défensive face à une menace qui augmente.

### Plaisir / challenge
Le test doit distinguer : incompréhension, manque d’intérêt, mauvaise stratégie, difficulté excessive, et envie de retenter.

## Principe de développement

- Ne pas repartir de zéro côté moteur lorsque la logique historique reste compatible.
- Retirer du parcours actif les mécaniques explicitement abandonnées au lieu d’entretenir deux vérités concurrentes.
- Accepter une reconstruction importante de la présentation.
- Construire proprement les primitives réutilisables.
- Faire une vraie passe visuelle provisoire cohérente avec Avelune, sans prétendre fixer la DA finale.
- Utiliser simulations et playtests pour les valeurs numériques de laboratoire.
