# Tableau réel — Politique des données PROTO

## Décision

Tant qu'aucun monde de production persistant n'existe, le Tableau réel peut utiliser les **PROTO d'Avelune comme sources provisoires des métriques de jeu**.

Cette décision permet d'alimenter progressivement les compteurs sans attendre la production, tout en évitant de présenter des données de test comme des statistiques de production.

## Règle de qualification

Toute métrique issue d'un prototype porte :

- un `sourceId` identifiant la source logique ;
- `sourceEnvironment = proto` ;
- son statut de vérité habituel : MESURÉ, CALCULÉ, ESTIMÉ ou SYMBOLIQUE ;
- si nécessaire, le jalon du prototype dans les métadonnées de provenance.

`PROTO` n'est pas un statut de vérité. C'est l'environnement qui produit la donnée.

Exemple :

```text
Joueurs observés
sourceEnvironment = proto
status = calculated
sourceId = proto_public_metrics
```

## Agrégation de plusieurs prototypes

Le Tableau réel ne doit pas additionner aveuglément plusieurs bases de prototype si une même personne, Corcite ou session peut apparaître plusieurs fois.

Avant d'agréger plusieurs jalons :

1. définir ce que mesure le compteur ;
2. déterminer si les identités peuvent être dédupliquées sans exposer de données personnelles ;
3. sinon présenter les métriques par jalon ou n'utiliser qu'une source de référence.

## Passage en production

Le contrat public reste identique lors du passage à la production.

```text
PROTO source -> adaptateur de métriques -> contrat Tableau réel
PROD  source -> adaptateur de métriques -> contrat Tableau réel
```

La route `/reel` et les agrégats ne doivent pas dépendre du schéma interne d'un prototype particulier.

Lorsqu'une métrique de production devient disponible :

- elle remplace la source PROTO correspondante ;
- `sourceEnvironment` devient `production` ;
- l'historique PROTO peut rester consultable comme période préproduction s'il est utile ;
- les données PROTO ne sont jamais réétiquetées rétroactivement comme données de production.

## Données autorisées

Peuvent alimenter le Tableau réel si elles sont agrégées et non sensibles :

- nombre de testeurs/joueurs ayant réellement participé ;
- nombre de Corcites créées dans le périmètre défini ;
- sessions ou runs ;
- temps de jeu ou temps de vie lorsque la définition est stable ;
- vagues traversées ;
- autres métriques globales explicitement retenues.

Les données personnelles, codes testeurs, emails, IP, tokens de session et traces détaillées restent hors du Tableau réel public.
