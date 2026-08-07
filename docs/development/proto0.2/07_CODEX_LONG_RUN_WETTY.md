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
PROMPT="$RUN_DIR/p02-$STAMP-prompt.txt"

if [ ! -d "$REPO/.git" ]; then
  echo "ERREUR: dépôt Git introuvable: $REPO"
elif ! command -v tmux >/dev/null 2>&1; then
  echo "ERREUR: tmux n'est pas disponible. Codex n'a pas été lancé."
elif ! command -v codex >/dev/null 2>&1; then
  echo "ERREUR: codex n'est pas disponible dans le PATH. Codex n'a pas été lancé."
elif tmux has-session -t "$SESSION" 2>/dev/null; then
  echo "Une session tmux $SESSION existe déjà. Ne pas lancer un second Codex en parallèle."
else
  mkdir -p "$RUN_DIR"

  if cd "$REPO" \
    && git fetch origin \
    && git switch develop/proto-0.2-ux-rules \
    && git pull --ff-only origin develop/proto-0.2-ux-rules; then

    cat > "$PROMPT" <<'CODEX_PROMPT'
Lis AGENTS.md et docs/development/proto0.2/CODEX_START_HERE.md, puis exécute entièrement docs/development/proto0.2/CURRENT_TASK.md.

Travaille de manière autonome sur tous les problèmes techniques, les mécaniques déjà arbitrées, l'architecture locale strictement nécessaire, les tests, les simulations, l'équilibrage de laboratoire, le responsive et le visuel.

Ne demande pas de confirmation pour les choix purement techniques. N'invente aucune règle de game design. Si une vraie décision de game design non couverte manque, consigne-la dans docs/development/proto0.2/DECISIONS_NEEDED.md, continue tout le travail indépendant, puis arrête seulement quand plus rien de sûr et utile ne reste.

Ne t'arrête pas après une première implémentation ni une première passe verte : poursuis jusqu'aux gates de docs/development/proto0.2/04_ACCEPTANCE.md. La partie visuelle fait partie du lot : utilise Gen3 comme référence de composition via 06_VISUAL_BRIEF_GEN3.md, reste dans l'identité Avelune et livre quelque chose de cohérent même si la direction artistique n'est pas finale.

Fais une passe finale de simplification, supprime le code mort et les contradictions historiques du parcours actif, puis mets à jour docs/development/proto0.2/IMPLEMENTATION_REPORT.md.

Ne push pas, ne merge pas main et ne déploie pas.
CODEX_PROMPT

    tmux new-session -d -s "$SESSION" \
      "cd '$REPO' && codex exec --sandbox workspace-write -C '$REPO' -o '$LAST' - < '$PROMPT' 2>&1 | tee '$LOG'"

    echo "Codex lancé dans tmux: $SESSION"
    echo "Journal: $LOG"
    echo "Message final: $LAST"
    echo "Prompt: $PROMPT"
  else
    echo "ERREUR: synchronisation Git impossible. Codex n'a pas été lancé."
  fi
fi

tmux list-sessions 2>/dev/null || true
```

## Vérification sans interrompre Codex

```bash
tmux capture-pane -pt avelune-p02-codex -S -80
```

ou, pour le dernier journal créé :

```bash
ls -1t /SSD-Sata/Projets/Avelune-Officiel/repository-proto0/.codex-runs/p02-*.log 2>/dev/null | head -n 1 | xargs -r tail -n 120
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
