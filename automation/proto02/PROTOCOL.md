# Protocole d’automatisation PROTO-0.2

Ce dossier appartient à la branche `automation/proto02-control` et sert de canal **commande → Codex**.

## Principe

Un watcher côté serveur peut interroger régulièrement cette branche. Il ne doit lancer Codex que lorsqu’un `TASK.json` nouveau ou modifié porte un statut exécutable.

Statuts de commande autorisés :

- `READY` : tâche à lancer ;
- `REVISION_REQUESTED` : reprendre la tâche après revue ;
- `HOLD` : ne rien lancer ;
- `CANCELLED` : ne rien lancer.

Le watcher doit mémoriser le SHA de commande déjà traité. Un même SHA ne doit jamais déclencher deux exécutions.

## Sécurité de concurrence

Avant lancement :

1. vérifier qu’aucun lock local n’indique une tâche déjà en cours ;
2. vérifier que la branche de travail attendue existe ou peut être créée depuis la base ;
3. vérifier l’état du worktree ;
4. ne jamais écraser des modifications inconnues ;
5. poser un lock local avec `task_id`, SHA de commande, PID et heure de début ;
6. lancer Codex ;
7. retirer/archiver le lock uniquement après fin contrôlée du processus.

## Sortie attendue

Codex écrit son code sur la branche de travail indiquée et met à jour le rapport prévu par la tâche.

Le canal de retour machine est `automation/proto02-status`. Un watcher de retour pourra y publier un `STATUS.json` contenant au minimum :

- `task_id` ;
- `status` ;
- `command_sha` ;
- `work_branch` ;
- `work_commit` ;
- résultats des validations ;
- décisions nécessaires ;
- heure de début/fin.

## Boucles

Le watcher n’interprète jamais un fichier de statut comme une nouvelle commande. Seule la branche `automation/proto02-control` déclenche du travail.

Une tâche peut être relancée seulement si :
- un nouveau SHA de commande existe ;
- son statut est `READY` ou `REVISION_REQUESTED` ;
- aucune exécution de cette commande n’est déjà active.

## Cadence

Le polling serveur peut être fréquent (par exemple quelques minutes), car il ne fait qu’un fetch/comparaison légère.

La revue humaine/ChatGPT peut être plus espacée. La cadence n’est pas codée dans le dépôt afin de pouvoir l’ajuster sans changer le protocole.
