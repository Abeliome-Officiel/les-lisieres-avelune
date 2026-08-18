# AVELUNE — TABLEAU RÉEL
## Plan d’exécution post-Gate B

Statut : **Gate B validé ; Gate C prête à démarrer**.  
Date de synchronisation : 19 août 2026.

Ce document complète `SPECIFICATION.md` et `CAHIER_DES_CHARGES.md`. Les détails d’exploitation privés restent dans la documentation interne.

## Contraintes

- ne pas coupler TA3 au runtime ou à la base éphémère d’un PROTO ;
- ne pas modifier le PROTO pour simplifier artificiellement TA3 ;
- un seul service TA3 autonome en v1 ;
- SQLite persistant propre à TA3 ;
- aucune base PostgreSQL supplémentaire pour TA3 v1 ;
- ne jamais remplacer une donnée inconnue par zéro ;
- conserver statut de vérité et provenance ;
- éviter WebSocket obligatoire, polling permanent et instrumentation excessive ;
- conserver les données internes hors des structures destinées à la publication ;
- ne pas détourner un partage NAS existant sans rapport pour la sauvegarde TA3 ;
- mesurer le coût permanent après déploiement.

## Phase A — audit Gate 0 — TERMINÉE

L’audit du 11 août 2026 a vérifié :

- le PROTO live est un runtime éphémère ;
- sa persistance PostgreSQL est dédiée au playtest ;
- ses compteurs de sessions sont exploitables comme **source temporaire** ;
- TA3 doit survivre à l’arrêt et à la suppression de ce PROTO ;
- une migration TA3 dans la base PROTO est donc exclue.

## Phase B — socle persistant autonome — TERMINÉE

L’audit des 19 août 2026 a établi :

- aucun socle TA3 persistant pertinent n’existe hors PROTO ;
- aucun serveur de base existant ne doit être détourné pour TA3 ;
- un service applicatif autonome unique suffit ;
- SQLite est proportionné au volume et à la concurrence attendus ;
- le reverse proxy peut joindre le futur service sans nécessiter un port hôte dédié en production ;
- une source électrique AVLAB locale existe déjà avec staging SQLite indépendant ;
- aucune destination de sauvegarde Avelune dédiée n’est actuellement disponible hors hôte.

**Gate B : PASS.**

Architecture retenue :

```text
sources / instruments / PROTO / saisies
                ↓
        adaptateurs périodiques
                ↓
         service TA3 unique
                ↓
        SQLite persistant TA3
                ↓
          interface publique
```

## Phase C — domaine et stockage — PROCHAINE

### C1. Workspace et runtime

- créer un workspace TA3 propre hors dépôts PROTO ;
- créer un stockage runtime persistant propre ;
- créer un service conteneurisé unique ;
- ne pas exposer de port hôte si le reverse proxy peut atteindre le service directement.

### C2. SQLite

- créer une base TA3 dédiée ;
- activer les réglages de sûreté adaptés ;
- créer des migrations versionnées ;
- fournir une commande de migration et une commande de vérification ;
- documenter une voie d’export indépendante du moteur.

### C3. Contrats de données

Implémenter :

- événements ;
- statuts de vérité ;
- provenance ;
- précision temporelle ;
- corrections et annulations ;
- idempotence des imports ;
- facteurs/coefficient versionnés ;
- agrégats financiers ;
- agrégats carbone ;
- projection de cycle de vie matériel ;
- métriques de vie du projet.

### C4. Baseline initiale

Charger uniquement les faits établis :

- date zéro : 26 juillet 2026 ;
- AVLAB : 230 EUR ;
- RAM AVLAB : 76 EUR le 13 août 2026 ;
- prise énergie AVLAB : 13 EUR le 13 août 2026 ;
- total matériel attendu : 319 EUR calculé ;
- ChatGPT Plus : 23 EUR/mois déclaré, paiement du 24 juillet exclu car antérieur à J0 ;
- aucun paiement ChatGPT post-J0 au 19 août ;
- aucun soutien reçu au 19 août ;
- aucune valeur inconnue transformée en zéro.

### C5. Sauvegarde locale

- produire une sauvegarde SQLite cohérente quotidienne ;
- ne pas se contenter d’une copie brute d’un fichier ouvert ;
- générer une somme de contrôle ;
- tester une restauration locale avant Gate C.

**Gate C :** domaine, stockage, migrations et restauration locale validés sans toucher au PROTO.

## Phase D — adaptateurs

### D1. Énergie AVLAB

La source physique et son staging existent déjà.

L’adaptateur TA3 doit :

- fonctionner en lecture seule ;
- lire uniquement les champs nécessaires ;
- reprendre toutes les lignes nouvelles depuis un curseur ;
- être idempotent ;
- pouvoir tourner toutes les 5 minutes ;
- ne pas imposer sa cadence au collecteur physique ;
- produire une synthèse horaire durable ;
- conserver couverture, fraîcheur et lacunes ;
- ne jamais interpoler silencieusement une période manquante.

### D2. PROTO

Implémenter une lecture unidirectionnelle :

- total des `playtest_sessions` ;
- sessions `status = 'active'` ;
- import horodaté dans TA3 ;
- idempotence ;
- conservation de l’historique après arrêt du PROTO.

Une future source de production doit pouvoir remplacer cet adaptateur sans modifier le contrat public.

### D3. Saisie manuelle

Créer des commandes locales contrôlées pour :

- fait manuel ;
- correction ;
- annulation ;
- facteur ;
- coefficient d’attribution.

Aucune interface d’administration publique en v1.

## Phase E — énergie et carbone

- agréger l’énergie AVLAB ;
- intégrer un facteur carbone versionné ;
- conserver la quote-part serveur partagé inconnue tant que la méthode n’est pas défendable ;
- intégrer le carbone incorporé uniquement lorsqu’une source physique défendable existe ;
- ne pas estimer le carbone IA sans méthode suffisamment robuste.

## Phase F — présentation publique

Créer une interface dédiée à TA3 utilisant uniquement le registre et ses agrégats persistants.

Deux groupes principaux :

- **Monde réel** ;
- **Vie d’Avelune**.

Chaque valeur affiche au minimum :

- valeur ;
- unité ;
- statut de vérité ;
- fraîcheur ou date de référence.

La provenance détaillée reste consultable sans surcharger la première lecture.

## Phase G — sauvegarde hors hôte

Avant clôture du jalon public :

- créer ou désigner une destination de sauvegarde Avelune dédiée hors hôte ;
- ne pas réutiliser un partage thématique existant uniquement par commodité ;
- copier les sauvegardes cohérentes ;
- politique cible minimale : 7 quotidiennes, 5 hebdomadaires, 12 mensuelles ;
- tester une restauration réelle à partir de la copie hors hôte.

## Phase H — acceptation et déploiement

Tests obligatoires :

- absence affichée comme inconnue ;
- vrai zéro conservé comme zéro ;
- statuts de vérité valides ;
- total matériel initial = 319 EUR calculé depuis les faits ;
- aucune dépense antérieure au 26 juillet 2026 dans les agrégats Avelune ;
- paiement ChatGPT du 24 juillet exclu ;
- compteurs PROTO conformes à leur source ;
- réimport automatique idempotent ;
- correction historique traçable ;
- facteurs/coefficient versionnés sans réécriture silencieuse du passé ;
- carbone incorporé et carbone d’usage distincts ;
- aucune donnée interne dans le HTML ou les réponses publiques ;
- aucune dépendance à un polling permanent ;
- PROTO non régressé ;
- TA3 consultable si une source externe est indisponible ;
- TA3 consultable lorsque le PROTO est arrêté ;
- lacunes énergie non interpolées comme mesures ;
- sauvegarde locale restaurable ;
- sauvegarde hors hôte restaurable ;
- CPU, RAM et stockage permanent de TA3 mesurés.

## Définition de terminé

TA3 est terminé pour ce jalon lorsque :

- il dispose de son runtime et stockage persistants propres ;
- son historique survit aux sources temporaires ;
- les données connues sont chargées avec le bon statut ;
- les inconnues restent explicites ;
- l’énergie AVLAB est importée sans dépendance directe du rendu ;
- les sauvegardes locale et hors hôte sont opérationnelles et testées ;
- les tests et contrôles d’acceptation passent ;
- un court document d’exploitation explique l’ajout d’un fait manuel, d’une correction, d’un facteur, d’une règle d’attribution et d’une source de collecte.
