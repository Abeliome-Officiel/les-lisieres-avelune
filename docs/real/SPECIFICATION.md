# AVELUNE — TABLEAU RÉEL
## Spécification fonctionnelle et architecture — v0.1

Statut : **Gate 0 validé — architecture autonome retenue**.  
Date de synchronisation : 12 août 2026.

## 1. Objet

Le Tableau Réel est l’instrument de télémétrie du projet Avelune dans le monde réel. Il mesure et historise notamment :

- l’âge du projet ;
- le temps humain consacré ;
- le matériel engagé et son cycle de vie ;
- l’énergie consommée ;
- les coûts et services attribuables ;
- le soutien reçu et l’autofinancement ;
- l’empreinte carbone connue ;
- des métriques globales de vie du projet et, temporairement, des PROTO.

Le ton reste simple, technique et lisible. La poésie peut accompagner les chiffres mais ne les remplace jamais.

## 2. Statuts de vérité

Chaque donnée significative est qualifiée :

- **MESURÉE** : obtenue directement d’un instrument ou d’une source primaire ;
- **CALCULÉE** : déterminée à partir de faits connus ;
- **ESTIMÉE** : reconstruite par une méthode explicitée ;
- **SYMBOLIQUE** : information institutionnelle ou narrative qui n’est pas une mesure physique ou financière.

Une donnée inconnue reste `NULL`/inconnue. Un zéro signifie réellement zéro et ne sert jamais de valeur de remplacement.

## 3. Architecture autonome

TA3 est une brique persistante indépendante du cycle de vie des PROTO.

```text
sources externes / PROTO / saisies
             ↓
      adaptateurs de source
             ↓
 registre canonique persistant TA3
             ↓
     agrégats versionnés
             ↓
      interface publique
```

Principes :

- chaque adaptateur lit une source, normalise les données utiles et les injecte avec date, statut et provenance ;
- un adaptateur peut être remplacé ou supprimé sans changer le contrat public ;
- une source indisponible rend sa donnée ancienne ou inconnue mais ne rend pas TA3 indisponible ;
- le rendu public ne lit jamais directement une prise, une base de PROTO ou une API externe ;
- TA3 conserve son propre historique après disparition d’une source.

Le service doit utiliser le plus petit runtime persistant approprié déjà disponible ou justifié sur le serveur partagé. Il ne doit pas être hébergé dans le conteneur ou la base éphémère du PROTO.

## 4. Registre canonique

Le stockage persistant doit représenter des événements atomiques, append-only par défaut.

Chaque événement contient au minimum :

- identifiant ;
- famille et métrique ;
- date ou période ;
- valeur éventuelle ;
- unité ;
- statut de vérité ;
- source ;
- provenance ;
- date d’enregistrement ;
- clé d’idempotence lorsque la collecte est automatique.

Une correction référence ce qu’elle corrige ou annule au lieu de réécrire silencieusement l’histoire. Les coefficients d’attribution et facteurs externes sont versionnés par période.

## 5. Monde réel

### Date zéro

La date zéro officielle d’Avelune est le **26 juillet 2026**.

### Matériel

Le coût machine/laboratoire initial retenu est **270 EUR**, statut **ESTIMÉ**, tant que le détail d’achat n’est pas enregistré.

Le registre matériel privé reste la source détaillée pour l’identité, les diagnostics, interventions et décisions de remplacement. TA3 ne reçoit qu’une projection minimale adaptée au cycle de vie :

- identifiant interne non sensible ;
- catégorie et rôle ;
- criticité ;
- état courant ;
- dernier/prochain contrôle ;
- tendance de santé ;
- horizon et motif de renouvellement ;
- coût prévisionnel éventuel ;
- disponibilité d’un secours.

Une alerte est fondée sur une mesure, une règle de maintenance ou une décision datée ; elle ne prétend pas prédire une panne.

### Énergie

Le laboratoire doit être mesuré par une prise locale lorsque le modèle installé est confirmé. Les kWh réellement observés sont `MESURÉS`. La quote-part du serveur partagé reste `ESTIMÉE` jusqu’à définition d’une méthode versionnée.

### Services partagés

Pour chaque service partagé, TA3 distingue :

- facture réelle ;
- coefficient d’attribution ;
- coût Avelune calculé.

Les paiements ChatGPT Plus connus des **24 mai, 24 juin et 24 juillet 2026** sont tous antérieurs à la date zéro et restent donc hors total Avelune. Le coefficient d’attribution déclaré de 99 % peut servir uniquement aux périodes postérieures au 26 juillet 2026 ; il ne réécrit pas le passé.

### Financement

Soutien brut, frais, soutien net et autofinancement sont distincts. Aucun soutien n’est comptabilisé tant qu’il n’existe pas réellement. Le temps humain n’est pas transformé automatiquement en dette financière.

## 6. Carbone

Le carbone est comptabilisé séparément des euros.

TA3 distingue :

- carbone incorporé du matériel ;
- carbone d’usage ;
- **empreinte carbone connue**.

Tant que des postes significatifs restent non quantifiés, aucun « total exhaustif » n’est affiché.

L’électricité est calculée à partir des kWh mesurés et d’un facteur d’émission ADEME/Base Empreinte importé ponctuellement, contrôlé, versionné et conservé avec sa provenance. Le signal électrique temps réel peut être une information complémentaire mais ne remplace pas silencieusement le facteur de comptabilité choisi.

Le carbone incorporé n’est jamais déduit d’un prix en euros. Le carbone du service IA reste inconnu tant qu’une méthode suffisamment robuste manque.

## 7. Vie d’Avelune et métriques PROTO

Tant qu’il n’existe pas encore de source de production persistante, un PROTO peut fournir temporairement certaines métriques à TA3.

Pour le playtest distribué actuel :

- **parties créées** = nombre total de `playtest_sessions` ;
- **parties en cours** = sessions dont `status = 'active'`.

Ces valeurs sont lues à la source puis importées dans TA3 avec date et provenance. Le rendu public ne dépend pas de la disponibilité de la base du PROTO.

Les nombres de joueurs et de Corcites ne sont pas utilisés comme KPI principaux de ce prototype tant que leur signification peut inclure des éléments simulés ou dépendre du scénario.

## 8. Frontière de publication

La partie publique n’expose jamais :

- données personnelles ;
- détails d’infrastructure exploitables ;
- identifiants matériels sensibles ;
- informations d’administration ;
- paramètres propriétaires du moteur du monde ;
- contenu interne classé non publiable.

Les sources sensibles restent côté serveur et les journaux techniques ne recopient pas leur charge utile.

## 9. Sobriété

- pas de télémétrie à la seconde sans besoin réel ;
- pas de WebSocket obligatoire ;
- pas de polling navigateur permanent ;
- pas de dépendance à un appel externe au moment de l’affichage ;
- collecte périodique par timer/cron/tâche légère lorsque nécessaire ;
- pas de nouveau service permanent si une capacité existante répond proprement au besoin.

L’autonomie de TA3 vis-à-vis du PROTO est, en revanche, une nécessité d’architecture.

## 10. Lois

1. Le réel reste réel.
2. Une estimation se déclare.
3. La source doit pouvoir être retrouvée.
4. Les événements précèdent les totaux.
5. Une inconnue reste inconnue.
6. Le temps humain n’est pas une dette.
7. Les dons ne créent pas artificiellement un besoin.
8. L’autofinancement est une donnée.
9. Le projet réel et le monde de jeu restent distincts.
10. La précision ne doit jamais être inventée.
11. Le CO2e n’est pas déduit des euros.
12. Carbone incorporé et carbone d’usage restent distincts.
13. Tout facteur est sourcé et versionné.
14. Un total carbone incomplet est nommé comme tel.
15. L’instrumentation doit coûter moins de ressources qu’elle n’en observe raisonnablement.

## 11. État de sortie Gate 0

L’audit du 11 août 2026 a validé le passage à la Phase B avec la règle suivante :

> auditer d’abord les capacités persistantes disponibles hors PROTO, puis choisir le plus petit runtime et stockage autonomes adaptés à TA3 ; ne créer aucune migration TA3 dans la base du PROTO.
