#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "MUSIQUE-0: ECHEC — exécuter ce script depuis un clone Git du projet." >&2
  exit 1
}

cd "$ROOT"

python3 tools/musique0/check_public_fixtures.py

LAB="lab/musique0"
PRIVATE_DIRS=(
  "$LAB/private-input"
  "$LAB/private-output"
  "$LAB/renders"
  "$LAB/reports-local"
)

for dir in "${PRIVATE_DIRS[@]}"; do
  mkdir -p "$dir"
  chmod 700 "$dir"
  sentinel="$dir/.local-only"
  : > "$sentinel"
  chmod 600 "$sentinel"

  if ! git check-ignore -q "$sentinel"; then
    echo "MUSIQUE-0: ECHEC — $sentinel n'est pas protégé par .gitignore" >&2
    exit 1
  fi
done

if git status --short --untracked-files=all -- "$LAB/private-input" "$LAB/private-output" "$LAB/renders" "$LAB/reports-local" | grep -q .; then
  echo "MUSIQUE-0: ECHEC — une zone locale apparaît dans git status" >&2
  exit 1
fi

cat <<'EOF'
MUSIQUE-0: terrain local prêt.
- fixtures publiques: valides
- zones privées: créées
- permissions: répertoires 700 / sentinelles 600
- protection Git: vérifiée

PROCHAINE ÉTAPE AUTORISÉE:
inspecter un export CŒUR-0 provenant d'une campagne close, sans le copier dans GitHub.
EOF
