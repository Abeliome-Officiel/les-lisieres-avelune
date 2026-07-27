# Prototype navigateur des Lisières d’Avelune

Application SvelteKit du prototype P1 de la version 0.9.

## Objectif

Rendre jouable un cycle déterministe complet :

1. Murmures ;
2. Veille ;
3. Scellement ;
4. Passage ;
5. Retombées.

Le premier périmètre comprend un joueur réel, quatre corps-cités simulés,
une carte hexagonale R7/F1, trois ressources, la Trame RPG, la Dissonance
et une sauvegarde persistante.

## Développement

Le projet utilise Node.js 24 dans Docker. Node.js n’a pas besoin d’être
installé sur le serveur hôte.

Commandes principales :

```sh
npm ci
npm run check
npm run build
npm run start
```

## Endpoint de contrôle

```text
GET /api/health
```

## Déploiement

La configuration Docker Compose se trouve dans `../infra/`.

L’application rejoint :

- le réseau interne `avelune-proto-internal` ;
- le réseau externe `nginxpm_default`.

PostgreSQL reste uniquement sur le réseau interne.

## Accès

Le prototype est privé et ne doit pas être indexé publiquement.
