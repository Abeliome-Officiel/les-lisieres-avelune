# VISUEL-0 — contract lab

Ce répertoire est un banc d’essai **sans renderer réel et sans dépendance externe**.

Il sert à vérifier trois choses avant tout investissement graphique :

1. un payload public non prévu est rejeté ;
2. l’identité de projection peut survivre à une transformation majeure ;
3. une perte de séquence mène à une resynchronisation, jamais à l’invention d’un état.

## Exécuter

Pré-requis cible : Node.js 24.x, cohérent avec le socle applicatif du dépôt.

```bash
cd labs/visuel0
npm test
```

Aucune installation de paquet n’est nécessaire à ce stade.

## Fichiers

- `src/public-profile.mjs` : guard exécutable de la projection publique VISUEL-0 ;
- `src/sequence.mjs` : décision minimale d’application/resynchronisation des frames ;
- `src/fake-renderer.mjs` : consommateur factice indépendant du Cœur et de tout moteur graphique ;
- `test/contract.test.mjs` : tests de frontière, continuité et resynchronisation ;
- `../../docs/contracts/visuel0/visual-scene-v0.schema.json` : profil JSON Schema documentaire ;
- `../../docs/contracts/visuel0-fixtures/` : états entièrement synthétiques.

## Règle de sécurité

Les fixtures sont inventées pour le LAB. Elles ne doivent jamais être remplacées par un export brut du Cœur dans GitHub.

Un futur adaptateur réel restera du côté privé et ne publiera que les champs autorisés par la projection.

## Ce que ce lab ne fait pas

- aucune simulation biologique ;
- aucune décision canonique ;
- aucune connexion au Cœur ;
- aucune inférence de règle privée ;
- aucune direction artistique finale ;
- aucun choix définitif de renderer.
