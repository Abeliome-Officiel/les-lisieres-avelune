# TA3 — frontière entre surface publique et opérations privées

Statut : **partageable**.  
Synchronisation : 19 août 2026.

Ce document décrit uniquement la **frontière d’architecture publiable** du Tableau Réel. Il omet volontairement les coordonnées d’exploitation : adresses réseau, noms d’hôtes, ports réels, chemins locaux, identifiants de service, secrets d’authentification, paramètres du reverse proxy et procédures sensibles.

## 1. Deux surfaces, une seule vérité TA3

TA3 sépare deux surfaces :

- une **surface publique**, consultable sans authentification et strictement en lecture seule ;
- une **surface privée d’exploitation**, authentifiée, destinée à la consultation opérateur puis aux écritures contrôlées.

Cette séparation ne crée pas deux registres ni deux logiques canoniques. Les deux surfaces utilisent les mêmes contrats de domaine et le même registre TA3. La surface privée ne doit jamais devenir une voie de contournement des invariants du registre.

TA3 reste distinct du Cœur, du Tableau Monde et du Tableau Univers. La console privée TA3 administre uniquement les données du **projet réel** suivies par TA3 ; elle n’obtient aucun accès aux recettes, seeds, causalités, états biologiques privés ou contenus CODEX du Cœur.

## 2. Surface publique

La surface publique fournit uniquement :

- le rendu SSR du Tableau Réel ;
- l’API publique de lecture ;
- un contrôle de santé minimal.

Elle ne fournit :

- aucune authentification opérateur ;
- aucune route d’administration exploitable ;
- aucune mutation ;
- aucun import ;
- aucun secret ;
- aucun détail d’infrastructure nécessaire à l’exploitation.

Son montage du registre est réellement en lecture seule. Le processus web public ne réalise pas les migrations de schéma à son démarrage.

## 3. Surface privée d’exploitation

La surface privée est un service séparé du frontend public. Elle est authentifiée et n’est pas référencée par l’interface publique.

Son premier jalon est volontairement **lecture seule**. Il permet de consulter notamment :

- les agrégats TA3 ;
- les événements récents ;
- l’état des imports ;
- les sauvegardes connues ;
- les informations comptables déjà présentes dans le registre.

Les écritures ne sont activées qu’après validation spécifique de la frontière privée.

Lorsque cette activation sera faite, les opérations autorisées devront réutiliser les contrats existants :

- ajout d’un fait par événement ;
- correction par événement de supersession ;
- annulation traçable ;
- facteurs et coefficients versionnés ;
- imports idempotents ;
- provenance conservée.

Aucun `UPDATE` ou `DELETE` direct d’un fait canonique n’est accepté comme mécanisme normal d’administration.

## 4. Imports privés

Les imports sensibles, notamment les exports de conversation utilisés pour estimer le temps humain, suivent une politique stricte :

1. dépôt temporaire dans un espace privé ;
2. inspection avant import ;
3. sélection explicite des éléments autorisés ;
4. import via le contrat idempotent existant ;
5. persistance uniquement des résultats dérivés nécessaires et de leur provenance ;
6. suppression du matériau brut temporaire selon la politique de cycle de vie.

Le contenu brut des conversations n’appartient pas au registre canonique TA3 et ne doit pas être exposé publiquement.

## 5. SQLite et lecture seule

TA3 utilise SQLite comme registre propre. Le mode de journalisation retenu doit rester compatible avec deux exigences simultanées :

- écritures ponctuelles et contrôlées par les outils autorisés ;
- lecture du frontend public depuis un montage de fichier réellement non inscriptible.

Le journal `DELETE` est utilisé pour cette architecture. Le frontend public ouvre la base en lecture seule et avec `query_only` ; les opérations de migration restent hors de son démarrage normal.

## 6. Reverse proxy et coordonnées d’exploitation

La configuration du reverse proxy est une responsabilité d’exploitation externe au dépôt. Elle est administrée séparément et n’est pas générée ou modifiée par TA3.

Le dépôt ne versionne pas :

- adresses IP ou topologie réseau privées ;
- ports d’hôte réels ;
- noms de domaine réservés à l’administration ;
- mots de passe, hashes, secrets de session ou jetons ;
- chemins absolus d’exploitation ;
- configuration privée du reverse proxy.

Les valeurs nécessaires au déploiement sont fournies par configuration privée hors dépôt.

## 7. État du jalon au 19 août 2026

- la surface publique autonome est déployée et répond correctement ;
- son registre est monté en lecture seule ;
- la surface privée séparée est déployée dans son jalon de lecture seule ;
- les contrôles de type, accessibilité et tests applicatifs passent avant activation des écritures ;
- les opérations comptables/imports restent désactivées jusqu’à la gate dédiée ;
- aucune modification automatique du reverse proxy n’est autorisée ;
- la revue de frontière public/privé reste obligatoire avant toute publication de code ou documentation TA3.

## 8. Règle de publication

Une information peut être documentée ici si elle aide à comprendre ou maintenir l’architecture **sans donner les coordonnées ni les secrets nécessaires à l’exploiter contre l’installation réelle**.

Les détails d’exploitation, d’authentification, de réseau et les procédures sensibles restent dans les documents privés Drive/Coffre et dans la configuration locale protégée.
