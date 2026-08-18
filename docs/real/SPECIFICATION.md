# AVELUNE — TABLEAU RÉEL
## Spécification fonctionnelle et architecture — v0.3

Statut : **Gate B validé — architecture v1 figée**.  
Date de synchronisation : 19 août 2026.

Le cahier des charges complet du jalon est maintenu dans [`CAHIER_DES_CHARGES.md`](CAHIER_DES_CHARGES.md).

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

TA3 est distinct du PROTO, du Cœur, de la Fenêtre sur la Lisière, du Tableau Monde et du Tableau Univers.

## 2. Statuts de vérité

Chaque donnée significative est qualifiée :

- **MESURÉE** : obtenue directement d’un instrument ou d’une source primaire ;
- **CALCULÉE** : déterminée à partir de faits connus ;
- **ESTIMÉE** : reconstruite par une méthode explicitée ;
- **SYMBOLIQUE** : information institutionnelle ou narrative qui n’est pas une mesure physique ou financière.

Une donnée inconnue reste `NULL`/inconnue. Un zéro signifie réellement zéro et ne sert jamais de valeur de remplacement.

## 3. Architecture autonome v1

L’audit du 19 août 2026 n’a identifié aucun socle TA3 persistant existant hors PROTO qu’il soit pertinent de détourner ou de partager.

La cible v1 est donc :

```text
sources externes / instruments / PROTO / saisies
                    ↓
             adaptateurs périodiques
                    ↓
           service TA3 autonome unique
                    ↓
             SQLite persistant TA3
                    ↓
            agrégats versionnés
                    ↓
             interface publique
```

Décisions :

- un seul service applicatif autonome ;
- SvelteKit/Node comme socle web initial ;
- SQLite comme registre persistant propre à TA3 ;
- aucune base PostgreSQL supplémentaire ;
- aucune base partagée avec un PROTO ou un autre service ;
- publication par le reverse proxy existant sans port hôte dédié requis en production v1 ;
- administration et corrections uniquement côté exploitation ;
- lecture publique sans authentification et sans capacité d’écriture.

Principes :

- chaque adaptateur lit une source, normalise les données utiles et les injecte avec date, statut et provenance ;
- un adaptateur peut être remplacé ou supprimé sans changer le contrat public ;
- une source indisponible rend sa donnée ancienne ou inconnue mais ne rend pas TA3 indisponible ;
- le rendu public ne lit jamais directement une prise, une base de PROTO ou une API externe ;
- TA3 conserve son propre historique après disparition d’une source ;
- **observer n’autorise pas à agir** : une source de mesure reste en lecture seule tant qu’une capacité de commande distincte n’a pas été explicitement conçue et autorisée.

## 4. Registre canonique

Le stockage persistant représente des événements atomiques, append-only par défaut.

Chaque événement contient au minimum :

- identifiant ;
- famille et métrique ;
- date ou période et précision temporelle ;
- valeur éventuelle ;
- unité ;
- statut de vérité ;
- source ;
- provenance ;
- date d’enregistrement ;
- clé d’idempotence lorsque la collecte est automatique ;
- référence de correction/annulation lorsqu’applicable ;
- version de méthode/facteur lorsqu’applicable.

Une correction référence ce qu’elle corrige ou annule au lieu de réécrire silencieusement l’histoire. Les coefficients d’attribution et facteurs externes sont versionnés par période.

## 5. Monde réel

### Date zéro

La date zéro officielle d’Avelune est le **26 juillet 2026**.

### Temps humain

Le temps humain est affiché uniquement comme quantité de temps. Il n’est pas valorisé en euros et n’est jamais transformé en dette financière.

### Matériel et dépenses initiales

Les faits établis au 19 août 2026 remplacent l’ancienne estimation globale de 270 EUR :

- machine AVLAB : **230 EUR** ;
- RAM AVLAB : **76 EUR**, 13 août 2026 ;
- prise de mesure électrique AVLAB : **13 EUR**, 13 août 2026.

Le **total matériel connu est 319 EUR**, statut **CALCULÉ**, à partir de ces trois faits primaires.

La date exacte d’acquisition de la machine AVLAB n’est pas artificiellement inventée : le registre doit accepter une précision temporelle partielle lorsque nécessaire.

Le registre matériel privé reste la source détaillée pour l’identité, les diagnostics, interventions et décisions de remplacement. TA3 ne reçoit qu’une projection minimale adaptée au cycle de vie.

Une alerte est fondée sur une mesure, une règle de maintenance ou une décision datée ; elle ne prétend pas prédire une panne.

### Énergie

Une source physique locale de mesure AvLab est active depuis le 13 août 2026. AvLab est mesuré au mur par une prise de mesure locale. La collecte actuelle est périodique, légère et strictement en lecture seule ; elle produit un historique local de staging indépendant de TA3.

Première baseline instantanée validée : **30,2 W au mur**. Cette valeur n’est pas une moyenne de régime et ne doit pas être utilisée comme consommation journalière représentative sans agrégation temporelle.

Le staging existant n’est pas le registre canonique TA3. L’adaptateur TA3 peut fonctionner toutes les **5 minutes** et reprendre toutes les observations nouvelles depuis son curseur, avec idempotence.

La cible durable v1 est une synthèse horaire versionnée ; les agrégats journaliers, mensuels et cumulés sont dérivés de ces fenêtres. Une lacune reste une lacune et n’est jamais interpolée silencieusement comme mesure réelle.

Voir [Source énergie AvLab — télémétrie locale](AVLAB_POWER_TELEMETRY.md).

La quote-part du serveur partagé reste `ESTIMÉE` ou inconnue jusqu’à définition d’une méthode versionnée.

### Services partagés

Pour chaque service partagé, TA3 distingue :

- facture réelle ;
- coefficient d’attribution ;
- période de validité ;
- coût Avelune calculé.

ChatGPT Plus est déclaré à **23 EUR/mois**, prélèvement le 24. Le paiement du **24 juillet 2026** est antérieur à la date zéro et reste hors total Avelune. Au 19 août 2026, aucun paiement ChatGPT post-J0 n’a encore eu lieu ; aucune dépense future n’est créée avant prélèvement réel.

### Financement

Soutien brut, frais, soutien net et autofinancement sont distincts. Au 19 août 2026, aucun soutien financier n’a été reçu. Aucun faux événement de soutien à zéro n’est créé.

## 6. Carbone

Le carbone est comptabilisé séparément des euros.

TA3 distingue :

- carbone incorporé du matériel ;
- carbone d’usage ;
- **empreinte carbone connue**.

Tant que des postes significatifs restent non quantifiés, aucun « total exhaustif » n’est affiché.

L’électricité est calculée à partir des kWh mesurés et d’un facteur d’émission importé ponctuellement, contrôlé, versionné et conservé avec sa provenance.

Le carbone incorporé n’est jamais déduit d’un prix en euros. Le carbone du service IA reste inconnu tant qu’une méthode suffisamment robuste manque.

## 7. Vie d’Avelune et métriques PROTO

Tant qu’il n’existe pas encore de source de production persistante, un PROTO peut fournir temporairement certaines métriques à TA3.

Pour le playtest distribué actuel :

- **parties créées** = nombre total de `playtest_sessions` ;
- **parties en cours** = sessions dont `status = 'active'`.

Ces valeurs sont lues à la source puis importées dans TA3 avec date et provenance. Le rendu public ne dépend pas de la disponibilité de la base du PROTO.

Les nombres de joueurs et de Corcites ne sont pas utilisés comme KPI principaux de ce prototype tant que leur signification peut inclure des éléments simulés ou dépendre du scénario.

## 8. Sauvegarde

TA3 produit des sauvegardes SQLite cohérentes ; une simple copie d’un fichier ouvert n’est pas considérée suffisante.

Avant clôture du jalon public :

- sauvegarde locale cohérente et contrôlée ;
- copie hors hôte ;
- destination de sauvegarde Avelune dédiée plutôt que détournement d’un partage sans rapport ;
- test réel de restauration ;
- contrôle d’intégrité et recalcul des agrégats.

Politique cible minimale : 7 quotidiennes, 5 hebdomadaires, 12 mensuelles.

## 9. Frontière de publication

La partie publique n’expose jamais :

- données personnelles ;
- détails d’infrastructure exploitables ;
- identifiants matériels sensibles ;
- adresses réseau locales ou topologie d’administration ;
- informations d’administration ;
- paramètres propriétaires du moteur du monde ;
- contenu interne classé non publiable.

Les sources sensibles restent côté serveur et les journaux techniques ne recopient pas leur charge utile.

## 10. Sobriété

- pas de télémétrie à la seconde sans besoin réel ;
- pas de WebSocket obligatoire ;
- pas de polling navigateur permanent ;
- pas de dépendance à un appel externe au moment de l’affichage ;
- collecte périodique par timer/tâche légère lorsque nécessaire ;
- pas de nouveau service permanent si une capacité plus simple répond proprement au besoin ;
- rétention brute bornée lorsqu’une granularité fine n’a plus de valeur utile.

L’autonomie de TA3 vis-à-vis du PROTO reste une nécessité d’architecture.

## 11. Lois d’application TA3

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
16. Mesurer n’autorise pas à piloter : collecte et action sont des capacités distinctes.

## 12. État de sortie Gate B

Gate B est validé au 19 août 2026.

Sont désormais figés :

- runtime autonome unique ;
- SQLite persistant propre à TA3 ;
- aucune dépendance de stockage au PROTO ;
- publication via reverse proxy sans port hôte dédié requis ;
- staging énergie qualifié comme source non canonique ;
- sauvegarde hors hôte dédiée exigée avant clôture du jalon public.

La prochaine étape est **Gate C : domaine, schéma SQLite, migrations, événements, provenance, corrections, idempotence et chargement des faits initiaux**.
