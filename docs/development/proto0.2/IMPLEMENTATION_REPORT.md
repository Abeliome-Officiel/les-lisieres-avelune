# PROTO-0.2 — Rapport d’implémentation

**Statut : PARTIAL**

## Lot

- Identifiant : P02-001, checkpoint énergie / onde / persistance
- Branche : `codex/proto02-bootstrap`
- Commit : checkpoint courant (voir historique de la branche)
- Base : `develop/proto-0.2-ux-rules` à `e259cac`
- Statut : PARTIAL

## Résumé jouable

Le parcours navigateur existant reste assemblé. Il utilise désormais une lecture énergétique unique `utilisée / capacité`, ne montre plus de réserve courte dans le bandeau ni les rapports, masque le calendrier et les valeurs exactes de l’onde avant son arrivée, et restaure automatiquement la partie locale après rechargement. Une nouvelle partie remplace la sauvegarde au changement d’état suivant.

Les fonctions distinguent aussi désormais ON/OFF et affectation de population : OFF conserve le personnel mais libère l’énergie, tandis que le retrait du personnel libère le travail et suspend la production. Les connexions directes se créent par sélection d’une sortie puis d’une entrée compatible, sans sélection manuelle de ressource.

## Principaux changements

- Réserve courte neutralisée dans l’état PROTO-0.2 et retirée des validations d’activation, construction et résolution.
- Dépassement de capacité énergétique refusé immédiatement.
- Extension énergétique limitée à son gain de capacité normale existant, sans conversion arbitraire de l’ancien bonus de réserve.
- Prévision joueur rendue qualitative, sans nombre de tours ni caractéristiques chiffrées gratuites.
- Sauvegarde navigateur versionnée avec restauration sûre et rejet des données invalides.
- Tests énergie adaptés et tests roundtrip/corruption de sauvegarde ajoutés.
- Affectation de population explicite dans l’état des structures, le contrôleur et l’interface.
- Production suspendue pour une fonction ON non staffée.
- Sélecteur de connexions limité aux cibles compatibles avec ressource déduite.

## Briques réutilisables créées ou renforcées

- `browser-persistence.ts` : sérialisation/version/validation minimale indépendante de `localStorage`.
- `TurnReportPanel` : rapport joueur sans seconde jauge énergétique.
- Helpers `getStructureAssignedWork` / `isStructureOperational` et transition `setPlayableStructureStaffed`.

## Règles modifiées

- L’énergie jouable est uniquement `used / normalCapacity` ; les champs historiques de réserve restent à zéro pour compatibilité de schéma.
- Une fonction ne peut pas être activée et un tour ne peut pas être résolu au-delà de la capacité.
- La mécanique déterministe d’onde reste interne, mais son calendrier n’est plus exposé.

## Contrôles exécutés

| Contrôle | Résultat | Détail |
|---|---|---|
| Typecheck / svelte-check | PASS | 0 erreur, 0 warning. |
| Tests PROTO-0 | PASS | 39 fichiers de tests, 0 échec (`--test-concurrency=1`). |
| Tests ciblés | PASS | Énergie 4 habitants, persistance et contrôle population. |
| Build | PASS | Build SvelteKit/adapter-node terminé. |
| Diff statique | PASS | `git diff --check`. |
| E2E | NOT_RUN | Infrastructure non engagée avant stabilisation du cœur. |

## Écarts / dette volontaire

- Les champs de réserve restent dans les types historiques et certains rapports techniques pour préserver P0-P10, mais sont neutralisés dans l’état jouable.
- La recherche historique de récupération de réserve reste dans le moteur de compatibilité ; elle est filtrée du catalogue navigateur et son effet est neutre.
- Le geste drag/pointer n’est pas encore ajouté ; les alternatives clic/tap fonctionnelles sont présentes.
- Le découpage de la page monolithique et une représentation SVG des liens restent à renforcer.
- Le lancement Docker n’est pas requis pour ce checkpoint ; Node 24 est disponible directement.

## Décisions nécessaires

- Aucune pour ce checkpoint.

## Fichiers ou zones particulièrement sensibles à revoir

- `app/src/lib/proto0/corcite/sustainability.ts`
- `app/src/lib/proto0/corcite/construction.ts`
- `app/src/routes/+page.svelte`
- compatibilité des tests historiques liés à la réserve

## Instructions de test humain

1. Lancer l’application et créer une partie.
2. Vérifier le bandeau énergie et l’absence de réserve courte.
3. Construire/activer des fonctions jusqu’à la capacité et vérifier le refus compréhensible d’une surcharge.
4. Vérifier que l’écran Onde ne donne ni compte à rebours ni caractéristiques exactes avant l’arrivée.
5. Effectuer une action, recharger la page et vérifier la restauration ; utiliser « Nouvelle partie » pour repartir.

## Déploiement

- environnement : aucun
- URL : aucune nouvelle URL
- commande / procédure utilisée : aucune
- résultat du healthcheck : non exécuté
