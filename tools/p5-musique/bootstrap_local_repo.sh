#!/usr/bin/env bash
set -euo pipefail

TARGET=${1:-}
if [[ -z "$TARGET" ]]; then
  echo "usage: $0 /absolute/path/to/musique-avelune" >&2
  exit 2
fi

case "$TARGET" in
  /*) ;;
  *) echo "TARGET must be an absolute path" >&2; exit 2 ;;
esac

if [[ -e "$TARGET" && -n "$(find "$TARGET" -mindepth 1 -maxdepth 1 -print -quit)" ]]; then
  echo "FAIL: target must be absent or empty" >&2
  exit 1
fi

mkdir -p "$TARGET"
cd "$TARGET"

git init -b main >/dev/null

mkdir -p \
  src/avelune_music/contracts \
  src/avelune_music/input \
  src/avelune_music/session \
  src/avelune_music/replay \
  src/avelune_music/payload \
  tests \
  fixtures \
  docs \
  reports-local

touch \
  src/avelune_music/contracts/.gitkeep \
  src/avelune_music/input/.gitkeep \
  src/avelune_music/session/.gitkeep \
  src/avelune_music/replay/.gitkeep \
  src/avelune_music/payload/.gitkeep \
  fixtures/.gitkeep

cat > README.md <<'EOF'
# P5B MUSIQUE — Avelune

Dépôt local de fondation offline du chantier P5B MUSIQUE.

Principes :
- aucune lecture directe du Cœur ;
- aucune dépendance à O1 ;
- entrée durable : frontière P1 qualifiée ;
- priorité MUS-0 : identité, ordre de publication, replay, resync, isolation multi-Avelune, confidentialité ;
- aucune dépendance audio avant qualification du socle ;
- mémoire, grammaire, thèmes observateur et accessibilité restent aval du contrat monde.

Ce dépôt ne reprend pas le code historique `lab/musique0` par compatibilité implicite.
EOF

cat > .gitignore <<'EOF'
__pycache__/
*.py[cod]
.venv/
.pytest_cache/
.mypy_cache/
.coverage
htmlcov/
reports-local/
private/
secrets/
*.wav
*.flac
*.ogg
*.mp3
*.mid
*.midi
.DS_Store
EOF

cat > pyproject.toml <<'EOF'
[project]
name = "avelune-musique"
version = "0.0.0"
description = "P5B MUSIQUE offline foundation for Avelune"
requires-python = ">=3.11"
dependencies = []
EOF

cat > src/avelune_music/__init__.py <<'EOF'
"""P5B MUSIQUE offline foundation."""
EOF

cat > tests/test_smoke.py <<'EOF'
import unittest


class BootstrapSmokeTest(unittest.TestCase):
    def test_bootstrap(self) -> None:
        self.assertTrue(True)


if __name__ == "__main__":
    unittest.main()
EOF

cat > docs/BASELINE.md <<'EOF'
# P5B MUSIQUE — baseline locale initiale

Statut initial : terrain seulement, aucune qualification MUS-0 acquise.

## Autorité amont
P1 / Lecteur du Cœur est l'unique frontière durable de lecture.

## Séparation obligatoire
- publication_seq : continuité de publication ;
- state_revision : révision canonique représentée ;
- canonical_age : âge canonique ;
- event_history_exhaustive peut être faux : ne jamais inventer les événements absents.

## Non-buts du bootstrap
- aucun moteur audio ;
- aucune grammaire musicale ;
- aucun mapping Cœur -> musique ;
- aucun accès live ;
- aucune copie de l'ancien MUSIQUE-0.
EOF

python3 -m unittest discover -s tests -p 'test_*.py'

git add README.md .gitignore pyproject.toml src tests docs fixtures
git -c user.name='P5B Bootstrap' -c user.email='p5b-bootstrap@invalid.local' \
  commit -m "chore: bootstrap P5B MUSIQUE offline" >/dev/null

if [[ -n "$(git remote)" ]]; then
  echo "FAIL: unexpected remote configured" >&2
  exit 1
fi
if [[ -n "$(git status --porcelain)" ]]; then
  echo "FAIL: worktree is not clean" >&2
  exit 1
fi

printf 'HEAD=%s\n' "$(git rev-parse HEAD)"
echo "BRANCH=$(git branch --show-current)"
echo "REMOTES=NONE"
echo "STATUS=CLEAN"
echo "P5B_BOOTSTRAP=PASS"
