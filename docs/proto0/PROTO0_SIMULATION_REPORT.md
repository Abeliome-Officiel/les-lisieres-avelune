# Avelune — PROTO-0 — Rapport de simulations de conception

Statut : rapport préalable à l'implémentation du moteur headless.

Ce document ne prétend pas contenir des résultats produits par le futur code
PROTO-0.

Il conserve les conclusions utilisées pour figer le protocole expérimental.

---

# 1. But

Les simulations de conception servent à vérifier que le noyau choisi mérite
d'être implémenté.

Elles portent principalement sur :

- sensibilité à l'ordre des tours ;
- interaction des variables de vague ;
- robustesse à de petites variations ;
- absence d'une stratégie universellement dominante ;
- lisibilité des conséquences.

---

# 2. Configuration nominale

Vague de référence :

| Variable | Valeur |
|---|---:|
| Pression | 50 |
| Structure | 60 |
| Charge | 20 |
| Matière capturable | 16 |

Chemin TD :

- 8 positions ;
- positions ordonnées ;
- effets successifs.

Familles N1 :

- Atténuation ;
- Déstructuration ;
- Captation ;
- Stabilisation.

---

# 3. Variabilité

Deux types de simulation ont été retenus :

## A — Nominale

Tous les paramètres utilisent leurs valeurs de référence.

## B — Bornée

Les paramètres sont tirés à partir d'une graine dans des plages bornées autour
des valeurs nominales.

Amplitude de référence :

**±2 %**

L'objectif n'est pas de créer un aléatoire spectaculaire, mais de vérifier que
les conclusions ne disparaissent pas dès qu'un paramètre varie légèrement.

---

# 4. Prévision

La simulation distingue l'état réel de la vague et l'information disponible
avant son arrivée.

Référence :

- T−3 : ±10 % ;
- T−2 : ±6 % ;
- T−1 : ±3 %.

Cela permet de tester la préparation sous information imparfaite.

---

# 5. Ordonnancement des tours

Un ensemble de **60 ordonnancements/configurations** a été comparé pendant la
phase de conception.

Conclusion retenue :

1. l'ordre des tours modifie le résultat ;
2. les effets successifs créent des interactions ;
3. différentes configurations favorisent différents objectifs ;
4. aucune configuration ne doit être considérée comme dominante sur tous les
   critères ;
5. l'implémentation devra reproduire cette propriété et signaler toute
   régression.

Le futur moteur devra enregistrer suffisamment de données pour comparer ces
configurations automatiquement.

---

# 6. Critères de comparaison

Les simulations du moteur devront au minimum comparer :

- pression finale ;
- structure finale ;
- charge finale ;
- matière capturable restante ;
- matière effectivement captée ;
- ressources consommées ;
- coût de préparation ;
- conséquences sur le Corcite ;
- résultat global de la vague.

Une stratégie peut donc être meilleure selon un critère et moins bonne selon un
autre.

C'est un comportement recherché.

---

# 7. Scénarios de stress à reproduire

La batterie headless devra inclure des situations telles que :

- ressources insuffisantes ;
- plusieurs opérations réclamant la même ressource ;
- stockage saturé ;
- chaîne N → N+1 bloquée ;
- bifurcation avec priorité ;
- ordre TD défavorable ;
- forte pression résiduelle ;
- forte structure résiduelle ;
- charge mal traitée ;
- captation trop précoce ou trop tardive ;
- absence d'effet RPG utile ;
- choix RPG modifiant réellement TF ou TD ;
- graines différentes dans les bornes autorisées.

---

# 8. Tests de robustesse

Pour chaque scénario pertinent :

1. exécuter la configuration nominale ;
2. exécuter une ou plusieurs variantes seedées ;
3. comparer les métriques ;
4. vérifier qu'aucune boucle infinie n'apparaît ;
5. vérifier l'absence de création gratuite de ressources ;
6. vérifier que les conflits sont explicitement résolus ;
7. vérifier la reproductibilité.

---

# 9. Rapport joueur attendu

Le moteur devra produire deux sorties distinctes.

## Rapport joueur

Résumé compréhensible de :

- prévision ;
- réalité ;
- succession des traitements ;
- état avant/après ;
- matière captée ;
- consommations ;
- conséquences ;
- résultat.

## Journal technique

Trace détaillée permettant de reproduire tous les calculs.

Le rapport joueur ne doit pas être une simple présentation brute du journal.

---

# 10. Statut des conclusions

Les résultats ci-dessus sont des conclusions de conception.

Ils devront être vérifiés par le moteur PROTO-0.

Si le moteur démontre qu'une hypothèse est fausse, la donnée doit être corrigée
dans le référentiel avec traçabilité plutôt que masquée par un ajustement
silencieux.

---

# 11. Critère de réussite des simulations

La batterie de tests est satisfaisante si elle permet de répondre clairement aux
questions suivantes :

- l'ordre TD compte-t-il réellement ;
- le TF crée-t-il des arbitrages utiles ;
- le RPG modifie-t-il une décision ;
- la vague reste-t-elle compréhensible ;
- les variations seedées restent-elles maîtrisées ;
- les conséquences persistent-elles ;
- le joueur peut-il comprendre le résultat ;
- le développeur peut-il reconstruire le calcul.
