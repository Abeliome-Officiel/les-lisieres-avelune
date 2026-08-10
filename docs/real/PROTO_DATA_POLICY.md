# Tableau réel — Politique des données PROTO

## Décision

Tant qu'aucun monde de production persistant n'existe, le Tableau réel peut utiliser les **PROTO d'Avelune comme sources provisoires des métriques de jeu**.

Cette décision permet d'alimenter progressivement les compteurs sans attendre la production, tout en évitant de présenter des données de test comme des statistiques de production.

## Métriques retenues pour le PROTO actuel

Pour le playtest distribué, le schéma PostgreSQL existant contient la table `playtest_sessions` avec un statut contraint à `active`, `finished` ou `archived`.

Les deux métriques publiques de base sont donc :

```sql
-- Parties créées : historique de toutes les sessions enregistrées.
SELECT COUNT(*) AS sessions_created
FROM playtest_sessions;

-- Parties en cours : définition stricte du schéma courant.
SELECT COUNT(*) AS sessions_active
FROM playtest_sessions
WHERE status = 'active';
```

Une session archivée reste une partie qui a été créée : elle reste donc incluse dans `sessions_created`.

`last_seen_at` n'est pas utilisé pour définir « en cours ». Une future métrique distincte comme « parties actives récemment » pourra l'utiliser avec une fenêtre temporelle explicitement choisie.

Le Tableau réel n'utilise pas, pour ce PROTO, le nombre de joueurs ni le nombre de Corcites comme métriques publiques principales : ces notions sont plus ambiguës pendant les essais et peuvent refléter des données simulées ou internes au scénario plutôt qu'une partie réellement créée.

## Règle de qualification

Toute métrique issue d'un prototype porte :

- un `sourceId` identifiant la source logique ;
- `sourceEnvironment = proto` ;
- son statut de vérité habituel : MESURÉ, CALCULÉ, ESTIMÉ ou SYMBOLIQUE ;
- si nécessaire, le jalon du prototype dans les métadonnées de provenance.

`PROTO` n'est pas un statut de vérité. C'est l'environnement qui produit la donnée.

## Passage en production

Le contrat public reste découplé du schéma interne du prototype.

```text
PROTO source -> adaptateur de métriques -> contrat Tableau réel
PROD  source -> adaptateur de métriques -> contrat Tableau réel
```

Lorsqu'une métrique de production devient disponible :

- elle peut remplacer ou compléter la métrique PROTO correspondante ;
- `sourceEnvironment` devient `production` ;
- l'historique PROTO peut rester consultable comme période préproduction s'il est utile ;
- les données PROTO ne sont jamais réétiquetées rétroactivement comme données de production.

## Données personnelles

Le Tableau réel ne lit que des agrégats pour cette fonction. Les codes de session, états de jeu JSON, feedbacks, IP, emails, tokens et autres données détaillées ne sont pas publiés.
