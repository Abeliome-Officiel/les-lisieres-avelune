# Méthode de développement jeu vidéo - Avelune

Statut : cadre de pilotage.

## 1. Séquence

1. Vision et piliers.
2. Boucles principales.
3. Prototypes de systèmes.
4. Prototype intégré jouable.
5. Playtests et validation de l'intérêt.
6. Consolidation architecture/pipeline.
7. Vertical slice.
8. Production de contenu.
9. Équilibrage/UX/accessibilité à grande échelle.
10. Monde persistant, opérations serveur et montée en charge.
11. Alpha/bêta/production.

## 2. Position actuelle

Le PROTO-0 jouable a terminé la validation technique de l'étape 4 : chaîne miniature, trois vagues, conséquences, adaptation, instrumentation, simulations et interface.

**Étape ouverte : 5 - playtest humain.**

Le Lot 14 technique n'est pas le Lot 14 expérientiel. La réussite des tests ne prouve pas que le jeu est intéressant.

## 3. Gate actuelle

Question :

> Est-ce que les décisions produisent des situations qu'on veut comprendre, améliorer et expérimenter ?

Si non : corriger les boucles avant l'architecture de production.

Si oui : courte consolidation technique, puis vertical slice.

## 4. Discipline de développement

Pour chaque ajout :

1. préciser le problème de jeu ;
2. classer le statut `[acté]`, `[déduit]`, `[proposé]`, `[ouvert]`, `[remisé]` ou `[hors périmètre]` ;
3. déterminer invariant vs balance vs contenu ;
4. implémenter la règle hors UI ;
5. écrire les tests/invariants ;
6. brancher l'orchestration ;
7. exposer en UI ;
8. simuler si pertinent ;
9. playtester ;
10. documenter le delta.

## 5. Ce qu'il faut éviter

- produire beaucoup de contenu avant validation de la boucle ;
- optimiser sans profiling ;
- transformer une contrainte de prototype en règle définitive ;
- laisser une valeur d'équilibrage apparaître dans plusieurs sources ;
- modifier une mécanique uniquement pour rendre un test vert sans revenir au besoin de jeu ;
- faire porter au client la vérité d'un monde persistant.
