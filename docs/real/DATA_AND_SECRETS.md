# Tableau réel — Données et secrets

## Principe

Le dépôt contient le **code**, les contrats de données, les valeurs publiques et des exemples de configuration. Il ne contient jamais les secrets ou détails d'exploitation nécessaires pour interroger les sources réelles.

Le `.gitignore` du dépôt exclut déjà `.env`, `.env.*` (hors `.env.example`), clés privées, runtime et logs. Cette politique s'applique au Tableau réel sans exception.

## Données autorisées dans Git

- types et schémas ;
- identifiants logiques génériques de sources ;
- données publiques déjà destinées à l'affichage ;
- valeurs initiales explicitement qualifiées ;
- facteurs d'émission publics avec leur source/version lorsqu'ils ont été vérifiés ;
- exemples factices ;
- documentation d'architecture sans IP, token ni identifiant privé.

## Données interdites dans Git

- mots de passe ;
- jetons d'API ;
- secrets PayPal ou webhook ;
- identifiants privés de prise ;
- comptes cloud du fabricant ;
- adresses IP privées d'exploitation ;
- noms DNS internes ;
- cookies et sessions ;
- données personnelles de donateurs ou joueurs ;
- exports bruts contenant des données personnelles ;
- détails classés « Cœur d'Avelune » ou autres recettes réservées.

## Variables d'environnement futures

Les noms définitifs seront fixés lorsque le modèle de prise et son API officielle seront connus. Les secrets réels devront être injectés côté serveur uniquement.

Exemple générique, **non contractuel tant que le matériel n'est pas identifié** :

```text
AVELUNE_REAL_SOURCE_HOST=<privé>
AVELUNE_REAL_SOURCE_CREDENTIAL=<secret>
AVELUNE_REAL_INGEST_TOKEN=<secret long aléatoire>
```

Ces valeurs ne doivent jamais être placées dans une variable publique exposée au navigateur.

## Provenance

Chaque source reçoit un identifiant logique non sensible, par exemple :

```text
lab_power_meter_01
manual_human_time
manual_hardware_cost
ademe_base_empreinte_electricity_fr
world_public_metrics
paypal_aggregate
```

Le mapping vers un appareil réel, une IP, un compte ou un secret reste dans la configuration privée du serveur.

## Événements

Contrat conceptuel minimal :

```json
{
  "timestamp": "2026-08-11T12:00:00+02:00",
  "family": "energy",
  "metric": "energy_wh_delta",
  "value": 142.0,
  "unit": "Wh",
  "status": "measured",
  "sourceId": "lab_power_meter_01",
  "scope": "lab_power_input",
  "note": null
}
```

Une donnée publique agrégée ne doit pas transporter les secrets ou les identifiants techniques nécessaires à la collecte.

## Carbone

Les événements carbone sont calculés depuis des données d'activité et des facteurs d'émission documentés. La provenance doit permettre de retrouver :

- l'événement énergétique ou matériel source ;
- le facteur d'émission utilisé ;
- la version/période du facteur ;
- le périmètre méthodologique ;
- le résultat en kgCO2e.

Le coût en euros ne constitue jamais à lui seul une provenance carbone suffisante.

Le carbone de l'IA reste `null` tant qu'une méthode robuste manque. Une valeur `null` est une information de qualité de données, pas une erreur à masquer.

## Données personnelles

Le Tableau réel est un tableau de projet et de monde, pas un outil de surveillance individuelle.

Les données publiques doivent être agrégées. Un donateur, un joueur ou un testeur ne doit pas devenir identifiable par la combinaison des métriques affichées.

## Sauvegarde et intégrité

À terme :

- les événements source sont append-only ;
- les corrections sont explicites ;
- les agrégats sont recalculables ;
- les facteurs carbone sont versionnés ;
- les sauvegardes du schéma `real_dashboard` rejoignent la politique de sauvegarde de la base existante ;
- aucune sauvegarde publique ne contient la configuration privée des sources.

## Règle de publication

Avant toute nouvelle métrique publique, vérifier :

1. qu'elle ne révèle aucun secret d'exploitation ;
2. qu'elle ne révèle aucun secret de conception réservé ;
3. qu'elle ne permet pas d'identifier une personne ;
4. que son statut de vérité est correct ;
5. que son périmètre de mesure est explicite ;
6. pour le carbone, que le facteur et son périmètre sont traçables et compatibles avec les agrégats auxquels la valeur est ajoutée.
