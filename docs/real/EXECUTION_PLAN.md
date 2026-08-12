# AVELUNE — TABLEAU RÉEL
## Plan d’exécution post-Gate 0

Statut : **Gate 0 validé ; prêt pour Phase B**.  
Date de synchronisation : 12 août 2026.

Ce document complète `SPECIFICATION.md` et décrit l’ordre d’exécution. Les détails d’exploitation privés restent dans la documentation interne.

## Contraintes

- ne pas coupler TA3 au runtime ou à la base éphémère d’un PROTO ;
- ne pas modifier le PROTO pour simplifier artificiellement TA3 ;
- réutiliser SvelteKit/PostgreSQL uniquement lorsqu’ils restent appropriés ;
- conserver un runtime et un stockage persistants propres à TA3 ;
- ne jamais remplacer une donnée inconnue par zéro ;
- conserver statut de vérité et provenance ;
- éviter WebSocket obligatoire, polling permanent et instrumentation excessive ;
- conserver les données internes hors des structures destinées à la publication.

## Phase A — audit Gate 0 — TERMINÉE

L’audit lecture seule du 11 août 2026 a vérifié :

- le PROTO live est un runtime éphémère ;
- sa persistance PostgreSQL est dédiée au playtest ;
- ses compteurs de sessions sont exploitables comme **source temporaire** ;
- TA3 doit survivre à l’arrêt et à la suppression de ce PROTO ;
- une migration TA3 dans la base PROTO est donc exclue.

## Phase B — socle persistant autonome

1. auditer les capacités persistantes déjà disponibles hors PROTO ;
2. choisir le plus petit runtime approprié ;
3. choisir/créer le stockage persistant propre à TA3 ;
4. documenter le mécanisme de migration retenu ;
5. rendre les migrations réversibles et testables lorsqu’une base relationnelle est utilisée ;
6. démontrer que TA3 reste disponible lorsque le PROTO est arrêté.

**Gate B :** stockage autonome créé et validé sans toucher à la base du PROTO.

## Phase C — domaine et agrégation

Implémenter les contrats de données :

- événements ;
- statuts de vérité ;
- provenance ;
- corrections ;
- idempotence des imports ;
- facteurs/coefficient versionnés ;
- agrégats financiers ;
- agrégats carbone ;
- projection de cycle de vie matériel ;
- métriques de vie du projet.

Ajouter les tests unitaires avant l’interface publique.

## Phase D — présentation publique

Créer une interface dédiée à TA3 utilisant uniquement le registre/les agrégats persistants.

Deux groupes principaux :

- **Monde réel** ;
- **Vie d’Avelune**.

Chaque valeur affiche au minimum valeur, unité et statut de vérité. La provenance détaillée reste consultable sans surcharger la première lecture.

## Phase E — données initiales

Précharger uniquement les faits déjà établis :

- date zéro : 26 juillet 2026 ;
- coût laboratoire : 270 EUR `ESTIMÉ` ;
- aucun paiement ChatGPT Plus antérieur à cette date dans les coûts Avelune ;
- aucun soutien financier tant qu’aucun événement réel n’existe ;
- autres valeurs laissées inconnues en l’absence de source.

## Phase F — adaptateur PROTO

Implémenter une lecture unidirectionnelle :

- total des `playtest_sessions` ;
- sessions `status = 'active'` ;
- import horodaté dans TA3 ;
- idempotence ;
- conservation de l’historique après arrêt du PROTO.

Une future source de production doit pouvoir remplacer cet adaptateur sans modifier le contrat public.

## Phase G — énergie et carbone

Préparer les interfaces d’import :

- énergie mesurée du laboratoire ;
- facteur carbone versionné ;
- quote-part documentée du serveur partagé ;
- carbone incorporé lorsqu’une source physique défendable est disponible.

Ne coder aucun protocole spécifique de prise tant que le modèle réellement installé n’est pas confirmé.

## Phase H — acceptation et déploiement

Tests obligatoires :

- absence affichée comme inconnue ;
- statuts de vérité valides ;
- aucune dépense antérieure au 26 juillet 2026 dans les agrégats Avelune ;
- compteurs PROTO conformes à leur source ;
- réimport automatique idempotente ;
- correction historique traçable ;
- facteurs/coefficient versionnés sans réécriture silencieuse du passé ;
- carbone incorporé et carbone d’usage distincts ;
- aucune donnée interne dans le HTML ou les réponses publiques ;
- aucune dépendance à un polling permanent ;
- PROTO non régressé ;
- TA3 consultable si une source externe est indisponible ;
- TA3 consultable lorsque le PROTO est arrêté.

## Définition de terminé

TA3 est terminé pour ce jalon lorsque :

- il dispose de son runtime et stockage persistants propres ;
- son historique survit aux sources temporaires ;
- les données connues sont chargées avec le bon statut ;
- les inconnues restent explicites ;
- les tests et contrôles d’acceptation passent ;
- un court document d’exploitation explique l’ajout d’un fait manuel, d’un facteur, d’une règle d’attribution et d’une source de collecte.
