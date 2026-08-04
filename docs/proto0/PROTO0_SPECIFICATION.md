# Avelune — PROTO-0 — Spécification expérimentale

Statut : spécification fonctionnelle figée pour implémentation.

Jalon : `proto-0-spec.1`

Date de consolidation : 4 août 2026.

Cette spécification constitue le contrat de travail du premier prototype
réellement destiné à valider les mécanismes consolidés d'Avelune.

Elle ne décrit pas le jeu définitif.

---

# 1. Objectif

PROTO-0 doit valider la boucle :

**TF → RPG minimal → préparation TD → vague → conséquences**

Le prototype doit permettre d'observer réellement les interactions entre les
trois axes plutôt que de construire une démonstration de contenu.

Les questions principales sont :

1. à quel moment une vague devient-elle difficile ou ingérable ;
2. la combinaison TF + TD produit-elle une boucle intéressante ;
3. le RPG modifie-t-il réellement les décisions ;
4. la gestion de plusieurs Corcites reste-t-elle lisible ;
5. quelles conséquences persistent après une défense imparfaite.

---

# 2. Contraintes impératives

PROTO-0 respecte les contraintes suivantes :

- pas de temps réel ;
- pas de combat direct ;
- pas de PvP ;
- pas de commerce ;
- résolution déterministe à graine fixe ;
- paramètres numériques explicites et modifiables ;
- une session doit pouvoir être reproduite conceptuellement dans un tableur ;
- une même version du moteur doit pouvoir exécuter plusieurs parties
  indépendantes avec des configurations différentes.

---

# 3. Hors périmètre

PROTO-0 n'a pas pour objectif de valider :

- un challenge final ;
- l'équilibrage définitif ;
- le volume définitif de contenu ;
- les systèmes sociaux avancés ;
- le commerce ;
- le PvP ;
- le combat direct ;
- la progression longue ;
- l'économie définitive ;
- l'interface finale ;
- l'ensemble des races, classes, métiers, compétences et mues.

Les anneaux peuvent être visibles dans la représentation du monde, mais ils
n'appliquent aucun coefficient mécanique dans PROTO-0.

Il n'existe pas de « mode ermite » comme mécanique particulière. Un joueur peut
adopter un comportement très autonome sans que cela constitue un mode de jeu
séparé.

---

# 4. Session de référence

La session expérimentale de référence utilise :

- 10 tours ;
- 1 vague principale ;
- 1 Corcite réellement piloté ;
- 4 Corcites simulés ;
- une graine de simulation enregistrée ;
- des paramètres entièrement sérialisables.

Les comptes courts prévus pour les essais sont :

- IRFI ;
- AUBE ;
- BRUM ;
- ORBE ;
- SILE.

Ces identifiants sont des identifiants de test et non des éléments de lore.

---

# 5. Tour de jeu

Le joueur ne reçoit pas un quota arbitraire du type :

- 1 ordre TD ;
- 1 ordre TF ;
- 1 ordre RPG.

La phase joueur reste ouverte jusqu'à ce qu'il choisisse de terminer son tour.

La fin de tour déclenche la résolution.

Les limites doivent venir des mécanismes réels :

- ressources disponibles ;
- capacités ;
- prérequis ;
- durées ;
- disponibilité des unités ;
- stockage ;
- énergie ou entretien lorsqu'ils sont effectivement testés ;
- conflits entre demandes concurrentes.

Lorsqu'une même ressource est requise simultanément par plusieurs opérations :

1. le moteur détecte le conflit ;
2. les réservations déjà valides sont respectées ;
3. lorsqu'un arbitrage humain est nécessaire, le joueur choisit l'affectation ;
4. le moteur ne résout pas silencieusement un choix ambigu important.

---

# 6. Ordre de résolution cible

L'ordre fonctionnel de résolution du moteur headless est :

1. verrouillage des choix du tour ;
2. préparation des décisions des Corcites simulés ;
3. calcul des caractéristiques et modificateurs effectifs ;
4. vérification des capacités et contraintes ;
5. calcul des besoins ;
6. extraction ;
7. production, transformation et fabrication ;
8. résolution des tampons et flux directs ;
9. constructions ;
10. recherches et évolutions RPG minimales ;
11. commit des opérations ;
12. déficits et conséquences internes ;
13. mise à jour de la connaissance ;
14. mise à jour de l'état du monde ;
15. préparation ou résolution de la vague lorsqu'elle intervient ;
16. conséquences ;
17. journalisation ;
18. sauvegarde de l'état.

Cet ordre est une règle de PROTO-0 et peut être révisé à partir des tests.

---

# 7. TF minimal

Le TF doit fournir les conditions matérielles nécessaires au TD.

Le prototype doit gérer au minimum :

- ressources de base ;
- ressources transformées ;
- ressources de niveau supérieur ;
- extraction ;
- transformation ;
- fabrication ;
- construction ;
- stockage ;
- connexions directes entre unités.

## 7.1 Stockage

La capacité n'est pas un stock global abstrait ajouté au Corcite.

Les unités de stockage possèdent leurs propres capacités.

## 7.2 Connexions et tampons

Une connexion directe entre une unité N et une unité N+1 peut créer
automatiquement le tampon nécessaire au fonctionnement de l'unité aval.

Le tampon doit être observable par le moteur.

## 7.3 Bifurcations

Lorsqu'un flux peut alimenter plusieurs destinations, le prototype doit pouvoir
porter une priorité ou une répartition.

## 7.4 Ressources N+2

Le prototype doit permettre qu'une ressource issue d'une transformation serve à
une transformation ou fabrication de niveau supérieur.

Il ne doit donc pas être limité à une seule relation matière brute → produit.

---

# 8. RPG minimal

Le RPG n'est pas une file d'ordres symétrique du TD et du TF.

PROTO-0 n'implémente que les éléments nécessaires pour vérifier qu'une évolution
RPG peut modifier les choix mécaniques.

Il peut notamment produire :

- modificateurs ;
- accès ;
- déblocages ;
- recherche ;
- amélioration de capacité ;
- information supplémentaire ;
- changement de rendement ou de possibilité.

Le prototype doit pouvoir démontrer au moins une situation où un choix RPG
modifie réellement une décision TF ou TD.

---

# 9. TD interne

PROTO-0 utilise un chemin interne composé de **8 positions ordonnées**.

Les tours sont placées sur ces positions.

L'ordre des tours doit modifier le résultat.

Une tour ne se contente pas de soustraire une quantité unique à la vague : elle
peut transformer plusieurs caractéristiques de manière progressive et
anticipable.

Les quatre familles N1 retenues sont :

- atténuation ;
- déstructuration ;
- captation ;
- stabilisation.

Leurs coefficients exacts sont des valeurs de laboratoire configurables.

La simulation doit permettre de comparer différents ordonnancements.

---

# 10. Vague minimale

La vague transporte au minimum quatre variables :

- pression ;
- structure ;
- charge ;
- matière capturable.

Valeurs nominales de référence :

| Variable | Valeur |
|---|---:|
| Pression | 50 |
| Structure | 60 |
| Charge | 20 |
| Matière capturable | 16 |

Ces nombres ne constituent pas l'équilibrage final du jeu.

Ils constituent la configuration nominale de laboratoire de PROTO-0.

---

# 11. Variabilité

Une simulation à graine fixe est déterministe.

Pour le test de robustesse, les paramètres peuvent être perturbés dans une plage
bornée de **±2 %** autour de leurs valeurs de référence.

Deux familles de simulations doivent être distinguées :

1. paramètres nominaux ;
2. paramètres tirés dans les plages bornées à partir d'une graine.

L'objectif est de mesurer la robustesse des conclusions, pas de rendre le moteur
imprévisible.

---

# 12. Prévision de vague

L'information sur la vague devient progressivement plus précise.

Référence de PROTO-0 :

- T−3 : incertitude ±10 % ;
- T−2 : incertitude ±6 % ;
- T−1 : incertitude ±3 %.

La prévision et la valeur réellement générée doivent toutes deux être conservées
dans les données de session.

---

# 13. Résolution TD

La vague traverse les positions internes dans leur ordre.

Pour chaque étape, le moteur doit pouvoir enregistrer :

- état entrant ;
- tour appliquée ;
- effets calculés ;
- consommations ;
- état sortant.

La résolution doit rester explicable.

Un même ensemble de tours placé dans un ordre différent doit pouvoir produire
un résultat différent lorsque les fonctions des tours interagissent.

---

# 14. Rapport joueur de fin de vague

Le rapport joueur est distinct du journal technique.

Il doit présenter de manière lisible au minimum :

- vague prévue ;
- vague réellement rencontrée ;
- état initial de la vague ;
- effets successifs des tours ;
- pression avant et après traitement ;
- structure avant et après traitement ;
- charge avant et après traitement ;
- matière capturable avant et après traitement ;
- matière effectivement captée ;
- consommations pertinentes ;
- conséquences sur le Corcite ;
- résultat de la défense ;
- connaissance produite ou révélée lorsque pertinente.

Le rapport doit proposer un résumé lisible, avec détails accessibles à la
demande.

---

# 15. Journal technique et télémétrie

Le journal technique doit permettre de reconstruire les calculs.

Il doit notamment enregistrer :

- identifiant de session ;
- version ;
- graine ;
- tour ;
- phase ;
- acteur ;
- action ;
- paramètres entrants ;
- paramètres sortants ;
- réservations ;
- conflits ;
- consommations ;
- productions ;
- transformations ;
- modificateurs RPG ;
- configuration TD ;
- progression de la vague ;
- conséquences ;
- erreurs ou décisions impossibles.

La télémétrie doit servir à comparer les résultats et à rééquilibrer le jeu.

Elle ne remplace pas le rapport joueur.

---

# 16. Sauvegarde et reproductibilité

Une sauvegarde de PROTO-0 doit permettre de reprendre ou rejouer une session.

Les données nécessaires comprennent au minimum :

- version ;
- graine ;
- configuration ;
- état des Corcites ;
- stocks ;
- productions ;
- structures ;
- recherches ou modificateurs ;
- préparation TD ;
- état de vague ;
- journal ;
- état du monde nécessaire au test.

Une même configuration et une même graine doivent produire le même résultat en
l'absence d'entrée joueur différente.

---

# 17. Simulations de conception

La conception de PROTO-0 a déjà utilisé :

- des simulations nominales ;
- des simulations avec paramètres bornés ;
- des comparaisons d'ordonnancement des tours ;
- des scénarios de stress.

Un lot de **60 ordonnancements/configurations de tours** a été comparé.

Conclusion de conception :

- l'ordre produit des différences observables ;
- plusieurs stratégies sont viables ;
- aucune configuration ne doit être considérée comme supérieure sur tous les
  critères ;
- les valeurs restent des hypothèses de laboratoire à valider dans le moteur.

---

# 18. Architecture d'implémentation

Ordre retenu :

1. moteur headless ;
2. tests et simulations reproductibles ;
3. sauvegarde, logs et rapport ;
4. interface de pilotage.

L'interface ne doit pas imposer la structure du moteur.

Le moteur doit être utilisable sans interface graphique afin de permettre :

- tests automatisés ;
- simulations massives ;
- comparaison de graines ;
- comparaison d'ordonnancements ;
- détection des régressions.

---

# 19. Critère de sortie de PROTO-0

PROTO-0 est considéré comme concluant lorsque le moteur permet de tester
réellement et de manière reproductible :

- la boucle TF → RPG minimal → TD → vague → conséquences ;
- l'effet de l'ordre des tours ;
- la dépendance du TD aux productions TF ;
- l'effet mécanique d'au moins un choix RPG ;
- la variabilité bornée des vagues ;
- les conséquences d'une défense imparfaite ;
- la lisibilité des résultats pour le joueur ;
- l'observabilité technique des calculs.

Le challenge final, le contenu définitif et l'équilibrage définitif ne sont pas
des critères de sortie.

---

# 20. Points encore ouverts

Restent volontairement ouverts pour implémentation ou test :

- coefficients définitifs des quatre familles de tours ;
- équilibre définitif des recettes TF ;
- valeurs définitives d'énergie et d'entretien ;
- activation exacte de certaines tours hors phase de vague ;
- volumes finaux de contenu ;
- paramètres définitifs après simulations du moteur.

Ces points ne doivent pas être remplis arbitrairement pour donner une apparence
de complétude.
