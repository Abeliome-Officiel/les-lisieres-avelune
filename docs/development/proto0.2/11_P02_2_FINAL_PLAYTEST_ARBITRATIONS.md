# PROTO-0.2.2 — Arbitrages finaux du playtest distribué

**Statut : ACTÉ POUR PROTO-0.2.2 PLAYTEST**  
**Branche : `develop/proto-0.2.2-playtest`**

Ce document complète et prévaut sur `10_P02_2_DISTRIBUTED_PLAYTEST_SPEC.md` pour les points ci-dessous.

## 1. Sessions de playtest

- Aucun quota artificiel de sessions ou de testeurs n'est introduit.
- Le serveur crée autant de sessions que nécessaire.
- Chaque session possède un identifiant interne unique indépendant du code public.
- Le code public reste numérique sur 4 chiffres (`0000` à `9999`) pour ce playtest.
- Un code ne peut désigner qu'une session accessible à la fois ; en cas de collision lors de la création, le serveur choisit un autre code.
- Ce mécanisme reste explicitement un dispositif de playtest, pas une authentification de production.

## 2. Stockage et inventaire global

Le grand inventaire permanent affiché en bas de l'interface disparaît.

Il existe toujours **un seul stock global du Corcite**. Les bâtiments de stockage augmentent sa capacité ; ils ne possèdent pas d'inventaire individuel.

Deux accès ouvrent exactement la même vue globale `Stock` :

1. cliquer/taper sur n'importe quelle unité de stockage implantée ;
2. utiliser l'entrée `Stock` de la navigation principale.

La vue `Stock` est structurée, pas une liste brute.

Ordre de présentation :

1. **Matières primaires — niveau 0 / brut** : Organique, Minéral ;
2. **Matières transformées — niveau 1** : Transformé ;
3. **Composants — niveau 2** : Composant ;
4. **Fonctions / bâtiments** ;
5. **Défenses**.

Pour chaque entrée, afficher selon pertinence : pictogramme, nom, quantité en stock, quantité engagée/réservée, quantité posée/implantée. Ne pas inventer de niveau pour les bâtiments ou défenses qui n'en ont pas réellement.

Sur une case vide de Structure, le contexte `Implanter` affiche les bâtiments réellement présents dans le stock et donc posables. Le stock complet reste consultable via `Stock`.

## 3. Production

Chaque carte de fabrication affiche au minimum :

- pictogramme et nom ;
- quantité déjà possédée en stock ;
- quantité déjà posée/implantée lorsque l'objet est plaçable ;
- coût ;
- durée ;
- ordre en cours si pertinent.

Toute fabrication impossible reste visible mais désactivée/grisée et explique précisément la ou les causes : matière et quantité manquantes, recherche manquante, producteur occupé, sortie bloquée/stockage insuffisant, fonction inactive ou non peuplée lorsque pertinent.

Le gris seul n'est jamais l'unique information de blocage.

## 4. Identité économique Organique / Minéral

Constat du playtest P02.1 : Organique et Minéral sont presque interchangeables, avec des coûts globalement symétriques. Cette symétrie réduit les arbitrages et rend les deux ressources artificiellement équivalentes.

Pour PROTO-0.2.2, on introduit une **asymétrie économique légère et lisible**, sans nouvelle ressource et sans nouvelle mécanique.

### 4.1 Rôle provisoire de laboratoire

- **Organique** : matière plutôt liée au vivant, au soutien, à l'enveloppe, au stockage, à l'entretien et au recyclage.
- **Minéral** : matière plutôt liée à la structure, à l'énergie, à la fabrication technique et à la défense.
- **Transformation** : reste une fonction de jonction utilisant les deux matières.

Ces rôles sont des hypothèses de playtest, pas le canon définitif du futur jeu.

### 4.2 Coûts de référence P02.2

Conserver le stock initial `4 Organique + 4 Minéral`, les gisements actuels et les rendements d'extraction actuels afin d'isoler l'effet de la demande.

Modifier les recettes du prototype comme suit :

| Fabrication | Organique | Minéral | Transformé | Composant |
|---|---:|---:|---:|---:|
| Composant | 0 | 1 | 1 | 0 |
| Membrane de stockage | 3 | 0 | 1 | 0 |
| Gemme énergétique | 0 | 3 | 1 | 0 |
| Nodule d'entretien | 3 | 0 | 1 | 0 |
| Transformateur opalin | 2 | 2 | 0 | 0 |
| Recyclerie | 3 | 1 | 0 | 0 |
| Extracteur organique | 2 | 1 | 1 | 0 |
| Extracteur minéral | 1 | 2 | 1 | 0 |
| Tour d'Affaiblissement | 0 | 1 | 1 | 1 |

Ne pas ajouter ce soir de bonus intrinsèque à une ressource, de pénalité, de double matière transformée ou de nouvelle chaîne.

Les recherches restent sur leur structure et coûts P02.1 sauf impossibilité démontrée par simulation. Les asymétries déjà présentes dans `Fabrication améliorée` et `Recyclerie améliorée` sont conservées.

### 4.3 Critères de validation

La modification est acceptée seulement si les simulations et runs de contrôle montrent :

- aucune impasse structurelle créée par le nouveau tableau de coûts ;
- Organique et Minéral ont des demandes perceptiblement différentes ;
- aucune des deux matières n'est systématiquement inutile ou systématiquement bloquante ;
- plusieurs trajectoires restent jouables ;
- le changement ne nécessite aucune nouvelle mécanique pour être compris.

Codex ne doit pas réinventer ces rôles. Si un coût exact rend le run manifestement impossible, il peut effectuer un ajustement numérique minimal, documenté dans `IMPLEMENTATION_REPORT.md`, sans modifier la logique ci-dessus.

## 5. Cycles vides

Décision inchangée : ne pas ajouter de nouvelle action uniquement pour occuper les cycles vides avant collecte des données distribuées.

Instrumenter `forced_wait`, `voluntary_wait`, nombre d'actions et causes de blocage.

## 6. Temporalité des actions

Le prototype ne doit pas donner l'impression qu'une règle abstraite « tout prend un cycle » gouverne toutes les opérations.

Le moteur supporte déjà des durées différentes ; P02.2 doit rendre cette temporalité explicite et cohérente sans complexifier artificiellement le mini-jeu.

### 6.1 Grammaire temporelle P02.2

- **Immédiat** : actions de gestion et implantation d'un objet déjà fabriqué et disponible en stock, sous réserve des contraintes d'énergie, entretien, population et emplacement.
- **1 cycle** : fabrication légère/composant et première recherche structurante lorsque la donnée de recette/recherche le prévoit.
- **2 cycles** : fabrication des bâtiments économiques, extracteurs, défense de base et améliorations ordinaires, sauf valeur différente explicitement justifiée par simulation.
- **Production continue** : extraction et transformation produisent à chaque résolution de cycle lorsque leurs conditions sont réunies ; elles ne reçoivent pas artificiellement un ordre répétitif d'un cycle.
- **Démontage/remontage** : conserver la logique de délai déjà présente ; ne pas rendre instantané un remontage qui est explicitement différé.

Ne pas introduire de durée de 3 cycles ou plus uniquement pour créer de la variété. Une durée plus longue n'est acceptable que si les simulations montrent qu'elle sert le rythme sans augmenter excessivement les `forced_wait`.

### 6.2 Lisibilité de la durée

Toute action non immédiate doit afficher avant validation :

- sa durée en cycles ;
- le cycle estimé de disponibilité lorsque cela est calculable.

Pendant un ordre : afficher une information du type `1 cycle restant` / `prêt fin cycle N`.

Le rapport de cycle doit signaler démarrage, progression pertinente et achèvement. La télémétrie doit conserver la durée prévue et la durée réellement observée.

### 6.3 Fabrication améliorée

Conserver le principe existant de `Fabrication améliorée` qui réduit la durée des fabrications, avec plancher à 1 cycle. Cette amélioration doit devenir perceptible dans l'interface ; elle ne doit pas créer de fabrication à durée nulle.

## 7. Pictogrammes de ressources

Les quatre ressources doivent avoir des pictogrammes stables et clairement distincts :

- Organique ;
- Minéral ;
- Transformé ;
- Composant.

Principe d'affichage : **pictogramme + nom + valeur** pour toute lecture importante. Le pictogramme peut être utilisé seul comme repère secondaire seulement si un libellé accessible explicite reste disponible.

Les mêmes pictogrammes doivent être réutilisés sans variation arbitraire dans :

- HUD/zone de ressources compacte ;
- vue `Stock` ;
- coûts de Production ;
- coûts de Recherche/Évolution ;
- prévisualisation d'implantation lorsque pertinent ;
- rapports de cycle ;
- rapports d'onde lorsque des ressources y sont mentionnées ;
- feedback ou contexte technique visible au joueur lorsque pertinent.

L'objectif est de permettre une reconnaissance visuelle rapide des coûts et stocks, pas de remplacer le texte par une iconographie cryptique.

## 8. Statut de ces décisions

Ces règles sont figées pour **PROTO-0.2.2 Playtest** afin d'obtenir une version cohérente à diffuser pendant plusieurs semaines.

Elles ne constituent pas automatiquement le canon de la prochaine vertical slice. Les résultats du playtest serviront précisément à décider ce qui est conservé, modifié ou supprimé lors de la phase de cahier des charges suivante.
