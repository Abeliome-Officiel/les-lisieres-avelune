# Tableau Réel — source énergie AvLab

Statut : **source locale de télémétrie active — lecture seule**.  
Date : 13 août 2026.

Ce document décrit la partie **partageable** de l’instrumentation électrique d’AvLab. Les identifiants réseau, adresses locales, identifiants matériels et détails d’administration restent dans la documentation privée d’exploitation.

## 1. Source physique

AvLab est alimenté au travers d’une **Shelly Plug M Gen3** capable de fournir localement les mesures électriques nécessaires au Tableau Réel.

La source fournit notamment :

- puissance active en watts ;
- tension ;
- courant ;
- fréquence ;
- énergie cumulée ;
- température interne de la prise ;
- disponibilité de la source et qualité de liaison utiles au diagnostic.

Les mesures reçues directement de cette source sont qualifiées **MESURÉES** lorsqu’elles sont ingérées par TA3 avec leur horodatage et leur provenance.

## 2. Collecte actuelle

La collecte est effectuée localement sur le serveur d’infrastructure par un collecteur léger et périodique.

Décisions actées :

- interrogation de l’API locale de la prise ;
- cadence cible : **une mesure par minute** ;
- conservation locale d’un historique brut léger ;
- publication d’un état courant en JSON pour les consommateurs locaux ;
- vérification de l’identité attendue de la source avant d’accepter une mesure ;
- aucun appel cloud nécessaire au chemin normal de collecte ;
- aucun service lourd ajouté pour cette instrumentation.

La première mesure de référence après mise en place du collecteur est de **30,2 W au mur** pour AvLab. Il s’agit d’une mesure instantanée de baseline, pas encore d’une moyenne représentative d’un régime de travail.

## 3. Frontière lecture / pilotage

La phase actuelle est **strictement en lecture seule**.

Aucune commande d’allumage, d’arrêt ou de bascule du relais n’est installée dans la chaîne TA3. Le fait qu’un dispositif physique puisse techniquement être piloté ne transforme pas la télémétrie en fonction de contrôle.

Une éventuelle capacité future de pilotage devra être conçue, sécurisée et autorisée séparément. Elle ne fait pas partie de ce jalon.

## 4. Relation avec TA3

L’historique local du collecteur est une **source/staging remplaçable**, pas le registre canonique du Tableau Réel.

L’intégration TA3 cible doit passer par un adaptateur qui produit des événements persistants avec au minimum :

- métrique ;
- horodatage ;
- valeur ;
- unité ;
- statut `MESURÉE` ;
- identifiant de source non sensible ;
- provenance ;
- clé d’idempotence.

Le rendu du Tableau Réel ne doit jamais interroger directement la prise. Une perte temporaire de la source rend les nouvelles mesures indisponibles ou anciennes ; elle ne doit pas rendre TA3 indisponible.

## 5. Sobriété et rétention

La télémétrie électrique brute est une donnée réelle dérivée, distincte de l’état canonique du monde d’Avelune.

La conservation à la minute n’est pas une obligation éternelle. TA3 pourra définir une politique d’agrégation et de rétention par horizon tout en conservant les agrégats nécessaires aux bilans d’énergie, de coût et de carbone.

L’instrumentation doit continuer à coûter nettement moins de ressources que le système qu’elle observe.

## 6. Frontière de publication

La documentation et l’interface partageables peuvent exposer les métriques agrégées utiles : puissance, énergie, tendances et disponibilité de mesure.

Elles n’exposent pas :

- adresse IP locale ;
- adresse MAC ;
- SSID ou détails du réseau ;
- chemins d’administration ;
- secrets ou identifiants de connexion ;
- topologie interne exploitable.

## 7. Prochaines validations

Avant de déclarer cette source prête pour ingestion TA3 permanente :

1. confirmer la régularité du timer sur plusieurs cycles et après redémarrage ;
2. rendre la résolution de la prise robuste à une adresse locale susceptible de changer ;
3. définir la politique de rétention/agrégation ;
4. définir l’adaptateur d’ingestion TA3 et ses tests d’idempotence ;
5. conserver le pilotage hors périmètre tant qu’il n’est pas explicitement conçu et autorisé.
