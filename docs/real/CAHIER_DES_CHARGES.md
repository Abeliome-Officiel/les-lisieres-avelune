# AVELUNE — TABLEAU RÉEL (TA3)
## Cahier des charges complet — v1.0

**Statut :** cadrage fonctionnel et technique fermé après Gate B  
**Date :** 19 août 2026  
**Classification :** partageable — aucune donnée d’exploitation sensible ni recette propriétaire du Cœur

## 1. Objet

Le **Tableau Réel (TA3)** est le service public qui décrit, de façon traçable et sobre, ce qu’il faut réellement pour construire et faire vivre le projet Avelune dans le monde réel.

Il mesure, historise et présente notamment :

- l’âge du projet ;
- le temps humain consacré ;
- le matériel engagé et son cycle de vie ;
- l’énergie consommée ;
- les coûts attribuables au projet ;
- le soutien reçu et l’autofinancement ;
- l’empreinte carbone connue ;
- quelques signes de vie du projet et, temporairement, de ses prototypes.

TA3 est distinct :

- du PROTO jouable ;
- du Cœur vivant ;
- de la Fenêtre sur la Lisière ;
- du Tableau Monde ;
- du Tableau Univers ;
- de l’Observatoire scientifique privé.

TA3 n’est ni un outil de pilotage du Cœur, ni une console d’administration, ni une source canonique du monde fictif.

## 2. Principes obligatoires

### 2.1 Vérité des données

Toute valeur significative porte un statut de vérité :

- **MESURÉE** : issue directement d’un instrument ou d’une source primaire identifiable ;
- **CALCULÉE** : dérivée de faits connus par une règle déterministe documentée ;
- **ESTIMÉE** : reconstruite ou attribuée par une méthode explicitée ;
- **SYMBOLIQUE** : information institutionnelle ou narrative qui n’est pas une mesure physique ou financière.

Une donnée inconnue reste inconnue. Elle n’est jamais remplacée par zéro.

Un zéro n’est affiché que lorsqu’il signifie réellement zéro dans un périmètre dont la complétude est connue.

### 2.2 Événements avant agrégats

Les faits sont enregistrés avant les totaux. Les totaux publics sont calculés à partir de faits persistés.

Une correction ou annulation ne réécrit pas silencieusement l’histoire : elle référence le fait corrigé, remplacé ou annulé.

### 2.3 Provenance

Chaque fait doit être rattachable à une provenance suffisante pour expliquer son origine sans exposer une information privée ou exploitable.

Les sources et facteurs externes utilisés dans un calcul sont versionnés et datés.

### 2.4 Sobriété

L’instrumentation doit rester proportionnée au phénomène observé :

- aucune télémétrie à la seconde sans besoin démontré ;
- aucun WebSocket obligatoire ;
- aucun polling navigateur permanent ;
- aucun appel externe nécessaire au rendu de la page publique ;
- aucun nouveau service permanent si une tâche périodique ou une capacité existante suffit ;
- aucune conservation indéfinie de données brutes sans valeur durable.

### 2.5 Observation sans action

La collecte, le diagnostic, la synthèse et l’action sont des responsabilités distinctes.

TA3 n’autorise aucun pilotage électrique, aucune modification d’un PROTO et aucune action sur le Cœur. Les sources automatiques sont lues en sens unique.

## 3. Périmètre public v1

TA3 v1 est **public en lecture seule, sans authentification**.

Aucune écriture, administration ou correction n’est exposée au public.

L’interface comporte deux familles principales.

### 3.1 Monde réel

Doivent pouvoir être présentés :

1. âge du projet ;
2. temps humain consacré ;
3. coûts connus ;
4. répartition agrégée des coûts ;
5. matériel engagé ;
6. état synthétique du parc matériel ;
7. énergie AVLAB mesurée ;
8. énergie attribuable à d’autres infrastructures lorsque la méthode est défendable ;
9. empreinte carbone connue ;
10. soutien brut, frais, soutien net et autofinancement.

### 3.2 Vie d’Avelune

Doivent pouvoir être présentés uniquement des indicateurs agrégés et non sensibles de vie du projet ou de ses sources temporaires.

Pour le PROTO distribué actuel, les métriques admises sont :

- parties créées ;
- parties en cours.

Ces métriques sont des observations importées. Le rendu public ne dépend jamais de la disponibilité du PROTO.

Les nombres de joueurs, de Corcites simulés, les états internes de partie et les retours détaillés ne sont pas publiés par défaut.

## 4. Date zéro et temps humain

### 4.1 Date zéro

La date zéro officielle du projet est le **26 juillet 2026**.

L’âge public du projet est calculé à partir de cette date.

### 4.2 Temps humain

Le temps humain est comptabilisé uniquement comme quantité de temps : heures et, lorsque pertinent, équivalent en jours.

Il n’est jamais :

- converti automatiquement en euros ;
- présenté comme dette ;
- ajouté aux dépenses financières ;
- transformé en coût salarial fictif.

Une reconstruction historique peut être `ESTIMÉE`. Les mesures futures peuvent devenir `MESURÉES` si une source primaire suffisamment fiable existe.

## 5. Baseline financière initiale

Les faits financiers connus au 19 août 2026 sont :

| Fait | Date | Montant | Statut |
|---|---|---:|---|
| machine AVLAB | date exacte non établie, postérieure ou attribuable au projet après J0 | 230 € | MESURÉE — source primaire déclarative |
| RAM AVLAB | 13/08/2026 | 76 € | MESURÉE — source primaire déclarative |
| prise de mesure électrique AVLAB | 13/08/2026 | 13 € | MESURÉE — source primaire déclarative |

Le **total matériel connu = 319 €**, statut `CALCULÉE` car il dérive des trois faits ci-dessus.

### 5.1 ChatGPT Plus

Le tarif connu déclaré est de **23 € par mois**, avec prélèvement le 24.

Le paiement du **24 juillet 2026** est antérieur à J0 et reste exclu des coûts Avelune.

Au 19 août 2026, aucun paiement ChatGPT postérieur à J0 n’a encore eu lieu. Aucune dépense future n’est créée par anticipation : un nouvel événement n’est enregistré qu’après prélèvement réel.

### 5.2 Soutien

Au 19 août 2026, aucun soutien financier n’a été reçu.

Aucun faux événement de don à zéro n’est créé. Lorsque le registre est explicitement complet sur une période, l’interface peut indiquer qu’aucun soutien n’a été reçu sur cette période.

### 5.3 Services partagés

Pour chaque service partagé, TA3 doit pouvoir distinguer :

- facture réelle ;
- coefficient d’attribution ;
- période de validité de ce coefficient ;
- coût Avelune calculé.

Une quote-part reste inconnue tant qu’une méthode défendable n’existe pas.

## 6. Énergie AVLAB

### 6.1 Source

Une source physique locale de mesure au mur est active pour AVLAB depuis le 13 août 2026.

La collecte existante est :

- locale ;
- périodique ;
- légère ;
- strictement en lecture seule ;
- indépendante du runtime TA3.

La baseline instantanée validée est **30,2 W au mur**. Elle ne constitue pas une moyenne de régime et ne doit jamais être extrapolée comme consommation journalière représentative.

### 6.2 Staging et ingestion

Le stockage du collecteur est un **staging non canonique**. TA3 ne le modifie pas et ne l’utilise jamais directement lors du rendu public.

Un adaptateur périodique :

1. lit uniquement les champs nécessaires ;
2. reprend toutes les observations nouvelles depuis son dernier curseur ;
3. tolère plusieurs exécutions sur la même fenêtre ;
4. produit des écritures idempotentes ;
5. conserve la fraîcheur et la couverture de la mesure ;
6. ne persiste aucune donnée réseau ou d’administration inutile à TA3.

L’adaptateur peut être exécuté toutes les **5 minutes** sans modifier la cadence du collecteur physique. Il reprend toutes les observations intermédiaires disponibles : sa cadence n’est donc pas une perte de résolution de la source.

### 6.3 Données énergétiques durables

TA3 ne doit pas conserver indéfiniment chaque ligne brute minute par minute.

La cible durable v1 est une synthèse horaire comprenant au minimum :

- début et fin de fenêtre ;
- disponibilité/couverture de la source ;
- puissance moyenne ;
- puissance minimale et maximale lorsque suffisamment de mesures existent ;
- énergie consommée sur la fenêtre lorsque calculable à partir de mesures fiables ;
- statut de vérité ;
- provenance ;
- version de la méthode d’agrégation.

Les agrégats journaliers, mensuels et cumulés sont dérivés de ces fenêtres horaires.

Une lacune de mesure reste une lacune. Elle n’est jamais interpolée silencieusement comme énergie mesurée.

### 6.4 Panne de source

Si la source énergie devient indisponible :

- TA3 reste consultable ;
- la dernière valeur valide peut rester visible avec sa date ;
- la fraîcheur indique que la source est ancienne ou indisponible ;
- aucune consommation n’est inventée pendant la lacune.

## 7. Carbone

Le carbone est comptabilisé séparément des euros.

TA3 distingue :

- carbone incorporé du matériel ;
- carbone d’usage ;
- empreinte carbone connue.

Les règles obligatoires sont :

1. ne jamais déduire des kgCO2e d’un prix en euros ;
2. calculer le carbone d’usage à partir de kWh mesurés ou calculés à partir de mesures ;
3. utiliser un facteur d’émission sourcé, daté et versionné ;
4. conserver la période à laquelle le facteur s’applique ;
5. ne pas appeler « empreinte totale » une somme dont des postes significatifs restent inconnus ;
6. laisser le carbone des services IA inconnu tant qu’une méthode suffisamment robuste n’est pas disponible.

## 8. Matériel

Le registre matériel privé conserve le détail technique : identité, diagnostics, numéros de série, stockage, contrôles et décisions.

TA3 ne reçoit qu’une projection minimale publiable :

- catégorie ;
- rôle général ;
- criticité synthétique ;
- état courant ;
- tendance de santé ;
- date du dernier contrôle ;
- prochain contrôle lorsqu’il est défini ;
- horizon de renouvellement ;
- motif synthétique ;
- coût prévisionnel lorsqu’il existe ;
- disponibilité d’un secours sous forme non sensible.

Aucune alerte publique n’est une prédiction de panne. Elle doit être fondée sur une mesure observée, une règle de maintenance documentée ou une décision datée.

## 9. Architecture technique v1

### 9.1 Décision Gate B

L’audit du 19 août 2026 n’a identifié aucun socle TA3 persistant existant hors PROTO qui justifierait une réutilisation.

La cible retenue est donc la plus petite architecture autonome appropriée :

```text
sources / instruments / saisies
          ↓
adaptateurs périodiques
          ↓
service TA3 unique
          ↓
SQLite persistant TA3
          ↓
agrégats / vues
          ↓
interface publique en lecture seule
```

### 9.2 Runtime

TA3 v1 utilise **un seul service applicatif autonome**.

Le socle web retenu est SvelteKit/Node afin de rester cohérent avec les compétences et outils déjà employés par le projet, sans en faire une dépendance conceptuelle durable.

Le service doit être conteneurisable et remplaçable.

### 9.3 Stockage

Le registre TA3 utilise **SQLite**.

Motifs :

- volume attendu faible ;
- écritures périodiques et peu concurrentes ;
- un seul service écrivain suffit ;
- sauvegarde/export simples ;
- absence de serveur de base supplémentaire ;
- coût CPU/RAM/maintenance inférieur à un PostgreSQL dédié ;
- migration future vers un autre moteur possible à partir d’un schéma et d’exports documentés.

TA3 ne partage aucune base avec un PROTO, Forgejo, une solution d’observabilité ou un autre service.

### 9.4 Réseau

Le service public est joint par le reverse proxy existant sur un réseau Docker partagé approprié.

Aucun port hôte dédié n’est requis en production v1 tant que le reverse proxy peut atteindre directement le service.

### 9.5 Indépendance du PROTO

Le PROTO est uniquement une source temporaire.

L’arrêt, la suppression, la migration ou le remplacement du PROTO ne doit provoquer :

- ni arrêt de TA3 ;
- ni perte d’historique TA3 ;
- ni erreur de rendu générale ;
- ni suppression des dernières observations valides.

## 10. Registre de données

Le modèle est événementiel et append-only par défaut.

Chaque événement doit pouvoir représenter au minimum :

- `event_id` ;
- `metric_key` ;
- `scope` ;
- `event_kind` (`fact`, `correction`, `cancellation`) ;
- date ou période observée ;
- précision temporelle ;
- valeur typée ;
- unité ;
- statut de vérité ;
- source logique ;
- référence de provenance non sensible ;
- clé d’idempotence lorsqu’applicable ;
- événement remplacé/corrigé lorsqu’applicable ;
- version de méthode ou facteur lorsqu’applicable ;
- métadonnées allowlistées ;
- date d’enregistrement.

Les contraintes doivent empêcher :

- deux imports automatiques identiques ;
- une chaîne de correction incohérente ;
- l’usage d’un statut ou d’une unité inconnus ;
- la suppression silencieuse d’un fait historique.

## 11. Saisie et administration

TA3 v1 ne possède pas d’interface d’administration publique.

Les faits manuels, facteurs, corrections et règles d’attribution sont ajoutés par commandes d’exploitation locales ou import de fichiers contrôlés.

Chaque commande d’écriture doit :

- valider le schéma ;
- afficher le fait qui sera créé ;
- exiger une provenance ;
- refuser une date ou unité incohérente ;
- produire un identifiant durable ;
- permettre une correction ultérieure sans réécriture de l’historique.

## 12. Interface publique

### 12.1 Première lecture

La page principale doit privilégier la lisibilité et non l’exhaustivité brute.

Chaque donnée importante affiche :

- valeur ;
- unité ;
- statut de vérité ;
- fraîcheur ou date de référence.

La provenance et la méthode sont accessibles en second niveau.

### 12.2 Inconnues et lacunes

Une inconnue est affichée comme telle.

Une source indisponible est distinguée d’une valeur nulle.

Une valeur ancienne doit pouvoir être présentée comme « dernière mesure connue » avec date, jamais comme valeur actuelle implicite.

### 12.3 Accessibilité

Les informations critiques ne reposent pas uniquement sur :

- une couleur ;
- une animation ;
- un graphique ;
- une icône.

Les graphiques éventuels disposent d’une alternative textuelle ou numérique.

## 13. Frontière de publication et sécurité

La partie publique n’expose jamais :

- données personnelles ;
- identifiants matériels sensibles ;
- adresses réseau ;
- noms ou chemins d’administration internes ;
- topologie privée ;
- credentials ;
- payloads détaillés de PROTO ;
- état interne du Cœur ;
- paramètres, recettes, coefficients secrets ou causalités propriétaires ;
- contenu du CODEX/Coffre non publiable.

La protection ne repose jamais sur le simple masquage côté interface : une donnée privée inutile au navigateur n’est pas envoyée au navigateur.

## 14. Sauvegarde et restauration

### 14.1 Sauvegarde locale

TA3 doit produire au moins une sauvegarde SQLite cohérente quotidienne au moyen d’un mécanisme de sauvegarde en ligne ou équivalent sûr ; une simple copie d’un fichier potentiellement ouvert n’est pas suffisante.

Les sauvegardes sont contrôlées par intégrité et accompagnées d’une somme de contrôle.

### 14.2 Sauvegarde hors hôte

Une copie hors hôte doit exister avant de considérer le jalon public comme complètement exploitable.

Aucun partage existant sans rapport avec Avelune ne doit être détourné uniquement parce qu’il est déjà monté. Une destination de sauvegarde Avelune dédiée est préférable.

Politique cible minimale :

- 7 sauvegardes quotidiennes ;
- 5 sauvegardes hebdomadaires ;
- 12 sauvegardes mensuelles.

Le faible volume attendu permet cette rétention sans coût significatif.

### 14.3 Test de restauration

Au moins une restauration complète est testée avant ouverture publique puis périodiquement après évolution significative du schéma ou du mécanisme de backup.

Le test doit vérifier :

- ouverture de la base ;
- intégrité SQLite ;
- présence des événements ;
- recalcul des agrégats ;
- démarrage du service sur la copie restaurée.

## 15. Fraîcheur et disponibilité

Chaque source automatique possède une politique de fraîcheur versionnée.

TA3 distingue au minimum :

- disponible et fraîche ;
- disponible mais ancienne ;
- source indisponible ;
- donnée jamais observée.

La panne d’une source ne doit pas devenir une panne de TA3.

## 16. Tests obligatoires

Avant ouverture publique :

- une inconnue reste inconnue ;
- un vrai zéro reste zéro ;
- les statuts de vérité sont contrôlés ;
- les agrégats correspondent exactement aux événements ;
- les corrections sont traçables ;
- les imports sont idempotents ;
- aucun coût antérieur au 26/07/2026 n’entre dans les totaux Avelune ;
- le total matériel initial est calculé à 319 € à partir des faits établis ;
- le paiement ChatGPT du 24/07/2026 reste exclu ;
- les métriques PROTO correspondent à leur source au moment de l’import ;
- TA3 reste consultable PROTO arrêté ;
- TA3 reste consultable source énergie indisponible ;
- une lacune de mesure énergétique n’est pas interpolée comme mesure réelle ;
- les facteurs et coefficients sont versionnés ;
- carbone incorporé et carbone d’usage restent distincts ;
- aucune donnée privée n’apparaît dans le HTML, les réponses réseau ou les logs publics ;
- aucun polling navigateur permanent n’est nécessaire ;
- une sauvegarde cohérente est produite ;
- une restauration complète passe ;
- le coût CPU/RAM/stockage permanent de TA3 est mesuré après déploiement.

## 17. Gates d’exécution

### Gate A — audit et architecture — PASS

- autonomie vis-à-vis du PROTO actée ;
- J0 fixé ;
- sources initiales identifiées ;
- frontière public/privé définie.

### Gate B — socle cible — PASS

- audit du serveur partagé hors PROTO réalisé ;
- absence de socle TA3 préexistant pertinent établie ;
- service autonome unique retenu ;
- SQLite retenu ;
- publication sans port hôte dédié possible ;
- staging énergie existant identifié et qualifié comme non canonique ;
- absence de destination de backup Avelune dédiée identifiée comme dette d’exploitation à fermer avant fin de jalon.

### Gate C — domaine et stockage

À réaliser :

- créer workspace et stockage propres ;
- créer migrations SQLite ;
- implémenter événements, corrections, provenance et idempotence ;
- charger les faits initiaux ;
- tester sauvegarde/restauration locale.

### Gate D — adaptateurs

À réaliser :

- adaptateur énergie ;
- adaptateur PROTO temporaire ;
- saisie manuelle contrôlée ;
- facteurs et coefficients versionnés.

### Gate E — interface publique

À réaliser :

- Monde réel ;
- Vie d’Avelune ;
- statuts de vérité ;
- fraîcheur ;
- détails de méthode/provenance non sensibles ;
- accessibilité.

### Gate F — exploitation

À réaliser :

- reverse proxy ;
- sauvegarde hors hôte dédiée ;
- test de restauration ;
- mesure CPU/RAM/stockage ;
- preuve PROTO arrêté ;
- preuve source énergie arrêtée ;
- revue de frontière public/secret.

## 18. Définition de terminé pour le jalon TA3 v1

TA3 v1 est considéré terminé lorsque :

1. son runtime et son stockage sont indépendants du PROTO ;
2. ses données initiales sont chargées et sourcées ;
3. les inconnues, zéros et estimations sont correctement distingués ;
4. les imports sont idempotents ;
5. l’historique survit à la disparition des sources temporaires ;
6. les dépenses post-J0 et exclusions pré-J0 sont correctes ;
7. l’énergie AVLAB est intégrée sans dépendance au rendu ;
8. la publication ne révèle aucune donnée interne ;
9. les sauvegardes locale et hors hôte sont opérationnelles ;
10. une restauration complète est démontrée ;
11. le service reste disponible PROTO arrêté ;
12. le coût permanent de TA3 est mesuré et jugé proportionné ;
13. un document d’exploitation explique l’ajout d’un fait, d’une correction, d’un facteur, d’un coefficient et d’une nouvelle source.

## 19. Hors périmètre v1

Ne font pas partie de TA3 v1 :

- contrôle électrique de la prise ;
- contrôle du Cœur ;
- administration du PROTO ;
- Tableau Monde ;
- Tableau Univers ;
- Observatoire scientifique ;
- collecte de données personnelles ;
- valorisation monétaire du temps humain ;
- estimation spéculative du carbone IA ;
- prédiction de panne matérielle ;
- temps réel à la seconde ;
- infrastructure de messages/broker ;
- architecture distribuée ou haute disponibilité non justifiée par des mesures.

## 20. Règle d’évolution

TA3 peut évoluer, changer de framework, de moteur de stockage ou de méthode de collecte si l’évolution :

- préserve les événements et leur provenance ;
- conserve l’historique utile ;
- ne transforme pas une estimation en mesure ;
- ne couple pas TA3 au cycle de vie d’un PROTO ;
- maintient la frontière public/privé ;
- reste proportionnée au besoin réel et aux ressources mesurées.
