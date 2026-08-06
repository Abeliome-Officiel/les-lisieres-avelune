# Tests, sécurité et persistance

Statut : stratégie de consolidation.

## 1. Tests actuels

La branche jouable dispose de tests de :

- configuration/session ;
- état Corcite ;
- réservations/arbitrage ;
- TF, buffers, réseau et N -> N+1 ;
- RPG/recherche/modificateurs ;
- TD/ordre/inventaire ;
- vague/prévision/cycle ;
- conséquences/récupération/captation ;
- contrôleur navigateur ;
- carnet ;
- simulations/stress.

Dernière exécution complète connue : 338 tests passants, `svelte-check` sans diagnostic et build de production valide.

## 2. CI cible

Sur chaque PR :

1. `npm ci`
2. `npm run test:proto0`
3. `npm run check`
4. `npm run build`
5. plus tard : E2E et migrations.

Le dépôt audité ne contient pas encore de workflow GitHub Actions ; la branche jouable n'impose pas de status checks.

## 3. E2E cible

Cas minimaux :

- créer une session ;
- construire/exploiter ;
- changer d'activité ;
- lancer/valider une recherche ;
- fabriquer/placer/déplacer une tour ;
- atteindre et résoudre trois vagues ;
- écrire/exporter une note ;
- viewport mobile et bureau.

## 4. Autorité serveur

Architecture future :

`client -> commande/intention -> validation serveur -> moteur -> transaction -> nouvel état -> réponse`

Le client ne fournit jamais comme vérité : stock, coût consommé, résultat TD, progression de recherche, gain de captation ou conséquence de vague.

## 5. Versionnement des états

Format cible :

```json
{
  "schema": "avelune.corcite",
  "schemaVersion": 1,
  "rulesetVersion": "...",
  "payload": {}
}
```

Chaque migration doit être :

- déterministe ;
- testée sur fixtures ;
- chaînable ;
- journalisée ;
- sauvegardée avant migration destructive.

## 6. Infrastructure actuelle

La conteneurisation possède déjà plusieurs bonnes pratiques : runtime non-root, filesystem application en lecture seule, `no-new-privileges`, base sur réseau interne, secrets via environnement et healthchecks.

À ajouter avant exploitation plus large : scan d'images/dépendances, SBOM/provenance, sauvegarde/restauration automatisée et supervision.
