# Tableau réel — Attribution des coûts partagés

## Principe

Un service ou une ressource peut être réellement payé par l'utilisateur sans être exclusivement consacré à Avelune.

Le Tableau réel conserve donc séparément :

1. le montant réellement facturé ;
2. la clé d'attribution Avelune applicable à la période ;
3. le coût calculé attribué à Avelune.

Cette règle s'applique notamment au serveur partagé, aux services numériques, aux abonnements et à tout futur outil utilisé pour plusieurs activités.

## ChatGPT Plus — période courante

Donnée actuellement connue :

```text
Paiement constaté : 23,00 EUR
Date : 24/07/2026
Attribution Avelune déclarée : 99 %
Coût Avelune calculé : 22,77 EUR
```

Le paiement est une donnée réelle. Le coefficient de 99 % est une estimation déclarée de l'usage actuel et peut être remplacé pour les périodes futures si la répartition d'usage change.

Les paiements du 24/05/2026 et du 24/06/2026 ne sont pas imputés à Avelune tant que la date zéro officielle du projet et l'attribution historique de ces périodes ne sont pas établies.

## Historisation

La clé d'attribution est **périodique**, pas globale et éternelle.

Exemple :

```text
2026-07-24 -> période courante : 99 %
2026-08-24 -> période suivante : coefficient alors constaté
```

Une modification future ne réécrit pas silencieusement l'historique.

## Pas de double comptage

Le total de coût Avelune utilise uniquement le **montant attribué**. Le montant brut de la facture reste visible dans le détail mais n'est pas ajouté une deuxième fois au total.

## Distinction carbone

Une clé d'attribution financière peut servir à répartir une ressource partagée lorsque sa donnée physique est connue, mais **les euros ne sont pas convertis directement en CO2e**.

Pour ChatGPT Plus, le fait de connaître `23,00 EUR × 99 % = 22,77 EUR` ne donne aucune valeur carbone fiable. Le carbone du service IA reste non quantifié tant qu'une donnée d'activité et un facteur d'émission suffisamment robustes ne sont pas disponibles.

Pour le serveur partagé, la quote-part carbone doit de préférence être appliquée à une donnée énergétique ou physique, pas au seul coût en euros.

## Statuts de vérité

- facture : **MESURÉ / constaté** ;
- coefficient d'attribution : **ESTIMÉ** ;
- coût attribué : **CALCULÉ** ;
- carbone du service : **NON QUANTIFIÉ** tant qu'une méthode robuste manque.
