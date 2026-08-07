# PROTO-0.2 — Lancement Codex long run depuis Wetty

But : lancer Codex depuis Wetty sans dépendre de la durée de la session SSH/Wetty, laisser l’agent travailler plusieurs heures, conserver un journal local et laisser les changements **non poussés** pour revue humaine.

## Préconditions

Dépôt local attendu :

```text
/SSD-Sata/Projets/Avelune-Officiel/repository-proto0
```

Branche :

```text
develop/proto-0.2-ux-rules
```

Codex doit lire `AGENTS.md` puis `docs/development/proto0.2/CODEX_START_HERE.md` et exécuter entièrement `CURRENT_TASK.md`.

## Lancement recommandé

Depuis Wetty, exécuter le bloc ci-dessous. Il ne contient pas `exit` et ne ferme pas le shell interactif.

```bash
REPO=/SSD-Sata/Projets/Avelune-Officiel/repository-proto0
SESSION=avelune-p02-codex
RUN_DIR="$REPO/.codex-runs"
STAMP="$(date +%Y%m%d-%H%M%S)"
LOG="$RUN_DIR/p02-$STAMP.log"
LAST="$RUN_DIR/p02-$STAMP-final.txt"

mkdir -p "$RUN_DIR"
cd "$REPO" || { echo "ERREUR: dépôt introuvable: $REPO"; false; }

git fetch origin && \
git switch develop/proto-0.2-ux-rules && \
git pull --ff-only origin develop/proto-0.2-ux-rules

if tmux has-session -t "$SESSION" 2>/dev/null; then
  echo "Une session tmux $SESSION existe déjà. Ne pas lancer un second Codex en parallèle."
else
  tmux new-session -d -s "$SESSION" \
    "cd '$REPO' && codex exec --sandbox workspace-write -C '$REPO' -o '$LAST' 'Lis AGENTS.md et docs/development/proto0.2/CODEX_START_HERE.md, puis exécute entièrement docs/development/proto0.2/CURRENT_TASK.md. Travaille de manière autonome sur tous les problèmes techniques, mécaniques déjà arbitrés, tests, simulations, responsive et visuel. Ne demande pas de confirmation pour les choix techniques. N invente aucune règle de game design. Si une vraie décision de game design manque, consigne-la dans DECISIONS_NEEDED.md, continue tout le travail indépendant, puis arrête seulement quand plus rien de sûr ne reste. Continue après une première passe verte jusqu aux gates de 04_ACCEPTANCE.md. Fais une passe finale de simplification et mets à jour IMPLEMENTATION_REPORT.md. Ne push pas, ne merge pas main et ne déploie pas.' 2>&1 | tee '$LOG'"
  echo "Codex lancé dans tmux: $SESSION"
  echo "Journal: $LOG"
  echo "Message final: $LAST"
fi

tmux list-sessions 2>/dev/null || true
```

## Vérification sans interrompre Codex

```bash
tmux capture-pane -pt avelune-p02-codex -S -80
```

ou :

```bash
tail -n 120 /SSD-Sata/Projets/Avelune-Officiel/repository-proto0/.codex-runs/p02-*.log
```

Le `tmux` continue après fermeture du navigateur/Wetty et déconnexion SSH tant que le serveur ne redémarre pas.

## Au retour

Ne pas lancer un second Codex avant d’avoir vérifié l’état du premier :

```bash
cd /SSD-Sata/Projets/Avelune-Officiel/repository-proto0

git status --short
git diff --stat
git log --oneline --decorate -8

tmux has-session -t avelune-p02-codex 2>/dev/null \
  && echo "Codex encore actif" \
  || echo "Session Codex terminée ou absente"
```

Lire ensuite :

```text
docs/development/proto0.2/IMPLEMENTATION_REPORT.md
docs/development/proto0.2/DECISIONS_NEEDED.md
```

Puis seulement effectuer revue, commit/push et mise en ligne selon l’état réel.

## Note Codex CLI

Le mode non interactif `codex exec` est utilisé pour éviter une dépendance au terminal. Le sandbox `workspace-write` autorise le travail dans le dépôt tout en conservant une limite d’écriture. Le run ne reçoit aucune autorisation de déploiement ou de push.
