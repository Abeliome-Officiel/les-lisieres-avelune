# PROTO-0.2 — Lancement Codex long run depuis Wetty

But : lancer Codex depuis Wetty sans dépendre de la durée de la session SSH/Wetty, conserver un journal local et laisser les changements **non poussés** jusqu’à la revue humaine.

## Worktree et branche corrects

Worktree actif :

```text
/SSD-Sata/Projets/Avelune-Officiel/repository-proto02
```

Branche :

```text
develop/proto-0.2-ux-rules
```

`repository-proto0` n’est pas le worktree de cette branche.

Comme il s’agit d’un Git worktree, `.git` peut être un **fichier** et non un dossier. Ne pas tester l’existence du dépôt avec `[ -d .git ]` ; utiliser `git rev-parse`.

## Avant lancement

Vérifier :

```bash
REPO=/SSD-Sata/Projets/Avelune-Officiel/repository-proto02

git -C "$REPO" rev-parse --is-inside-work-tree
git -C "$REPO" branch --show-current
git -C "$REPO" status --short
```

La branche attendue est `develop/proto-0.2-ux-rules`.

Ne pas lancer Codex si des modifications non commitées inconnues sont présentes.

## Synchronisation lorsque local et GitHub divergent

Une divergence peut être normale : le worktree local peut contenir des commits d’implémentation pendant que GitHub reçoit des mises à jour documentaires.

Ne pas utiliser `reset --hard`, rebase destructif ou force-push pour résoudre ce cas.

Si l’arbre de travail est propre :

```bash
REPO=/SSD-Sata/Projets/Avelune-Officiel/repository-proto02
BRANCH=develop/proto-0.2-ux-rules

git -C "$REPO" fetch origin

git -C "$REPO" log --oneline --left-right --graph \
  HEAD...origin/"$BRANCH" -20

git -C "$REPO" merge --no-edit origin/"$BRANCH"
```

Cette fusion conserve les commits locaux et ajoute les commits distants. En cas de conflit, ne pas lancer Codex avant résolution.

## Lancement détaché

Codex doit lire :

1. `/AGENTS.md`
2. `CODEX_START_HERE.md`
3. `CURRENT_TASK.md`
4. le reste du cahier selon l’ordre défini dans `README.md`.

Le lancement recommandé utilise `tmux` :

```bash
REPO=/SSD-Sata/Projets/Avelune-Officiel/repository-proto02
SESSION=avelune-p02-codex
RUN_DIR="$REPO/.codex-runs"
STAMP="$(date +%Y%m%d-%H%M%S)"
LOG="$RUN_DIR/p02-$STAMP.log"
LAST="$RUN_DIR/p02-$STAMP-final.txt"
PROMPT="$RUN_DIR/p02-$STAMP-prompt.txt"

mkdir -p "$RUN_DIR"

cat > "$PROMPT" <<'CODEX_PROMPT'
Lis AGENTS.md et docs/development/proto0.2/CODEX_START_HERE.md, puis exécute entièrement docs/development/proto0.2/CURRENT_TASK.md.

Travaille de manière autonome sur tout le périmètre déjà arbitré : mécanique, architecture locale nécessaire, tests, simulations, équilibrage de laboratoire, responsive, accessibilité et visuel.

Ne t'arrête pas après une première implémentation ni après une première passe verte. Continue jusqu'aux gates de docs/development/proto0.2/04_ACCEPTANCE.md ou jusqu'à ce qu'aucun travail sûr et utile ne reste.

La partie visuelle est obligatoire. Utilise docs/development/proto0.2/06_VISUAL_BRIEF_GEN3.md : Gen3 est une référence de composition, pas une direction artistique à recopier.

Pour les problèmes purement techniques, décide, corrige, teste et poursuis sans demander confirmation.

Pour une véritable décision de game design non couverte, écris-la dans docs/development/proto0.2/DECISIONS_NEEDED.md puis continue tout le travail indépendant.

Avant de terminer, fais une passe de simplification et mets à jour docs/development/proto0.2/IMPLEMENTATION_REPORT.md.

Ne push pas. Ne merge pas main. Ne déploie pas.
CODEX_PROMPT

if tmux has-session -t "$SESSION" 2>/dev/null; then
  echo "ERREUR: une session $SESSION existe déjà."
elif ! git -C "$REPO" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "ERREUR: worktree Git invalide: $REPO"
elif [ "$(git -C "$REPO" branch --show-current)" != "develop/proto-0.2-ux-rules" ]; then
  echo "ERREUR: mauvaise branche."
elif [ -n "$(git -C "$REPO" status --porcelain)" ]; then
  echo "ERREUR: arbre de travail non propre."
elif ! command -v tmux >/dev/null 2>&1; then
  echo "ERREUR: tmux absent."
elif ! command -v codex >/dev/null 2>&1; then
  echo "ERREUR: codex absent du PATH."
else
  tmux new-session -d -s "$SESSION" \
    "cd '$REPO' && codex exec --sandbox workspace-write -C '$REPO' -o '$LAST' - < '$PROMPT' 2>&1 | tee '$LOG'"

  sleep 3

  if tmux has-session -t "$SESSION" 2>/dev/null; then
    echo "CODEX EST LANCE ET DETACHE"
    echo "Session : $SESSION"
    echo "Log     : $LOG"
    echo "Final   : $LAST"
  else
    echo "ERREUR: Codex s'est arrêté immédiatement."
    tail -n 80 "$LOG" 2>/dev/null || true
  fi
fi
```

Aucune commande ci-dessus n’utilise `exit` et aucune n’est destinée à fermer le shell Wetty.

## Vérification sans interrompre Codex

```bash
tmux capture-pane -pt avelune-p02-codex -S -100
```

Dernier journal :

```bash
ls -1t /SSD-Sata/Projets/Avelune-Officiel/repository-proto02/.codex-runs/p02-*.log 2>/dev/null \
  | head -n 1 \
  | xargs -r tail -n 150
```

Le processus lancé dans `tmux` continue après fermeture de Wetty et déconnexion SSH tant que le serveur et la session tmux restent actifs.

## Au retour

```bash
REPO=/SSD-Sata/Projets/Avelune-Officiel/repository-proto02

git -C "$REPO" status --short
git -C "$REPO" diff --stat
git -C "$REPO" log --oneline --decorate -12

tmux has-session -t avelune-p02-codex 2>/dev/null \
  && echo "Codex encore actif" \
  || echo "Session Codex terminée ou absente"
```

Lire ensuite :

```text
docs/development/proto0.2/IMPLEMENTATION_REPORT.md
docs/development/proto0.2/DECISIONS_NEEDED.md
```

Puis comparer le local et `origin/develop/proto-0.2-ux-rules`, intégrer les éventuels commits documentaires distants, exécuter la revue finale, puis seulement pousser et déployer selon l’état réel.
