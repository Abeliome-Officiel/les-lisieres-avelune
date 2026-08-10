# Tableau réel — Architecture v0.1

## Décision d'hébergement

Le **Tableau réel est hébergé sur le serveur principal**, pas sur le lab.

Cette décision ne signifie pas que l'électricité du serveur est imputée intégralement à Avelune. Le serveur est une infrastructure partagée qui héberge de nombreux autres services.

Motifs d'hébergement :

- le serveur est permanent et central ;
- le lab doit pouvoir être arrêté, isolé, réinstallé ou indisponible sans perdre la télémétrie ;
- l'application SvelteKit et PostgreSQL existent déjà sur le serveur : la charge marginale du Tableau réel peut rester quasi nulle ;
- les secrets de collecte restent côté serveur et ne sont jamais envoyés au navigateur.

Le lab est la principale **source physique mesurée**. Le serveur est à la fois l'hôte du Tableau réel et une **source de coût partagé estimé**.

## Organigramme physique

```text
Réseau électrique
      |
      v
[ Prise connectée ]
      |
      v
[ LAB Avelune ]
      |
      +---- consommation du lab MESURÉE

[ Serveur principal partagé ]
      |
      +---- Avelune + nombreux autres services
      +---- quote-part électrique Avelune ESTIMÉE
      +---- héberge le Tableau réel
```

Conséquence :

- la prise aux fesses du lab mesure **le lab** ;
- cette mesure peut être qualifiée **MESURÉE** ;
- le serveur ne doit jamais être présenté comme entièrement consommé par Avelune ;
- sa contribution au coût électrique d'Avelune est une **quote-part ESTIMÉE**, fondée sur une méthode documentée ;
- le pourcentage de quote-part n'est pas fixé tant qu'une méthode raisonnable n'a pas été choisie.

## Organigramme logique cible

```text
                  ┌────────────────────┐
                  │  Prise connectée   │
                  │  mesure du LAB     │
                  └─────────┬──────────┘
                            │ LAN / protocole vérifié
                            v
┌───────────────┐   ┌─────────────────────────┐
│ Lab Avelune   │   │ Collecte / ingestion    │
│ instrumenté   │   │ sur le serveur partagé  │
└──────┬────────┘   └────────────┬────────────┘
       │ événements facultatifs  │
       └────────────────────────>│
                                v
                     ┌────────────────────────┐
                     │ PostgreSQL existant    │
                     │ schéma real_dashboard │
                     └───────────┬────────────┘
                                 │ lecture agrégée
                                 v
                     ┌────────────────────────┐
                     │ SvelteKit existant     │
                     │ route /reel            │
                     └───────────┬────────────┘
                                 │ HTML SSR / CSS
                                 v
                            Navigateur

[ Coût serveur partagé ]
        |
        +--> estimation périodique / quote-part documentée
        +--> événement ESTIMÉ dans real_dashboard
```

## Principe de consommation minimale

La v0.1 ne crée **aucun nouveau service permanent**.

- l'interface est une route supplémentaire de l'application existante ;
- les agrégats sont calculés côté serveur ou lors du rendu ;
- aucun polling navigateur n'est requis ;
- aucun WebSocket n'est requis ;
- aucun rafraîchissement seconde par seconde n'est requis ;
- le collecteur de prise doit de préférence être lancé par timer ponctuel plutôt qu'en démon permanent, si le protocole du matériel le permet ;
- PostgreSQL existant est réutilisé avec un schéma dédié au lieu d'ajouter une nouvelle base ou un nouveau conteneur.

Cible initiale de collecte électrique : **un relevé toutes les 5 minutes au maximum**, à ajuster après observation. Le Tableau réel n'a pas besoin d'une télémétrie à la seconde.

## Prise connectée : règle d'intégration

Le modèle exact de la prise n'est pas encore documenté dans le dépôt. **Aucun protocole n'est supposé.**

À réception du matériel :

1. relever marque, modèle et version matérielle/firmware ;
2. consulter la documentation officielle du fabricant ;
3. déterminer si une API locale documentée existe ;
4. préférer la lecture locale sur le LAN lorsqu'elle est officiellement supportée ;
5. n'utiliser un service cloud que si le matériel l'impose ou si son API locale n'est pas exploitable proprement ;
6. écrire un petit adaptateur isolé du reste du Tableau réel ;
7. enregistrer la portée physique du capteur : **alimentation du lab Avelune**.

Le reste du système ne doit connaître que le contrat générique suivant :

```text
timestamp
source_id
scope = lab_power_input
power_w (optionnel)
energy_wh_total ou energy_wh_delta
status = MESURÉ
provenance
```

Ainsi, un changement de prise ne demande pas de réécrire l'interface ou le modèle métier.

## Quote-part électrique du serveur partagé

Le serveur n'est pas dédié à Avelune. Sa consommation ne doit donc pas être ajoutée intégralement.

La v0.1 prévoit une donnée distincte :

```text
shared_server_allocation_percent
shared_server_electricity_cost
status = ESTIMÉ
method = description de la méthode
```

Le pourcentage reste `null` jusqu'à décision.

Méthodes envisageables à évaluer ultérieurement : part fixe conventionnelle, part fondée sur les services Avelune actifs, ou autre méthode mesurable. Une méthode choisie doit être stable, compréhensible et documentée ; elle n'a pas besoin de prétendre à une précision impossible.

## Données du lab

La mesure électrique du lab et la collecte logique sont découplées.

Le lab ne doit pas maintenir une connexion permanente au Tableau réel. Quand une métrique logicielle du lab devient utile, deux mécanismes légers sont acceptables :

1. **événement poussé ponctuellement** vers une API interne authentifiée ;
2. **import différé** depuis un fichier d'événements produit localement.

Le lab peut donc fonctionner hors ligne ou être arrêté sans impact sur la consultation du tableau.

## Stockage cible

Le schéma PostgreSQL dédié doit conserver des événements append-only.

Tables minimales futures :

- `real_event` : faits élémentaires ;
- `real_source` : source et portée d'une donnée ;
- `real_funding_need` : besoin futur concret ;
- `real_contribution` : contribution financière ;
- vues ou requêtes d'agrégation pour l'interface.

La v0.1 du code n'active pas encore cette migration : elle prépare les types et l'interface sans imposer un schéma avant que les premières sources réelles soient vérifiées.

## Flux futur des dons

Phase 1 : saisie/import manuel des contributions nettes.  
Phase 2 : automatisation seulement si le volume le justifie.  
Phase 3 éventuelle : webhook PayPal authentifié et vérifié côté serveur.

Aucun identifiant PayPal, secret webhook ou information personnelle de donateur ne doit être exposé dans le client ou le dépôt.

## Frontière publique / privée

### Peut être public

- valeurs agrégées ;
- statut MESURÉ/CALCULÉ/ESTIMÉ/SYMBOLIQUE ;
- description générique de la source (« prise lab », « quote-part serveur ») ;
- méthode de calcul non sensible ;
- chiffres de financement agrégés ;
- métriques globales du monde.

### Reste privé

- adresse IP du matériel ;
- identifiants et jetons ;
- topologie réseau détaillée ;
- noms DNS internes ;
- chemins d'exploitation précis ;
- données personnelles de joueurs ou donateurs ;
- secrets narratifs, mécaniques ou opérationnels d'Avelune.

## Décision v0.1

**Serveur partagé = hébergement et source de vérité.**  
**Prise = capteur de la consommation du lab.**  
**Lab = équipement instrumenté et producteur facultatif d'événements.**  
**Serveur électrique = quote-part estimée, jamais coût intégral.**  
**Navigateur = lecture uniquement.**
