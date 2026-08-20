#!/usr/bin/env bash
set -euo pipefail

TARGET=${1:-}
if [[ -z "$TARGET" ]]; then
  echo "usage: $0 /absolute/path/to/p5a-visuel" >&2
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

command -v git >/dev/null
command -v node >/dev/null
command -v npm >/dev/null

mkdir -p "$TARGET"
cd "$TARGET"

git init -b main >/dev/null

mkdir -p \
  src/contracts \
  src/input \
  src/session \
  src/replay \
  src/payload \
  src/grammar \
  src/presentation \
  src/renderers \
  test \
  fixtures \
  docs \
  reports-local

touch \
  src/contracts/.gitkeep \
  src/input/.gitkeep \
  src/session/.gitkeep \
  src/replay/.gitkeep \
  src/payload/.gitkeep \
  src/grammar/.gitkeep \
  src/presentation/.gitkeep \
  src/renderers/.gitkeep \
  fixtures/.gitkeep

cat > README.md <<'EOF'
# P5A VISUEL — Avelune

Dépôt local propre de fondation offline du chantier P5A VISUEL.

Principes :
- aucune lecture directe du Cœur ;
- aucune dépendance à O1 ;
- autorité amont durable : P1 / Lecteur du Cœur ;
- aucune copie automatique des anciens LAB VISUEL-0/1/Canvas ;
- aucun renderer final imposé ;
- qualité matérielle et préférences visuelles/sensorielles utilisateur restent deux axes distincts ;
- les préférences utilisateur changent la présentation, jamais le canon ;
- priorité VISUEL-0 : identité, ordre de publication, replay, resync, isolation multi-Avelune, confidentialité ;
- rebuild-first : le code historique n'est repris que s'il simplifie réellement la nouvelle architecture.
EOF

cat > .gitignore <<'EOF'
node_modules/
coverage/
reports-local/
private/
secrets/
*.log
.DS_Store
EOF

cat > package.json <<'EOF'
{
  "name": "avelune-p5a-visuel",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=24 <25"
  },
  "scripts": {
    "test": "node --test test/*.test.mjs"
  },
  "dependencies": {},
  "devDependencies": {}
}
EOF

cat > test/bootstrap.test.mjs <<'EOF'
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('bootstrap P5A ne dépend d’aucun package runtime', async () => {
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  assert.deepEqual(pkg.dependencies ?? {}, {});
  assert.deepEqual(pkg.devDependencies ?? {}, {});
});

test('bootstrap P5A fixe Node 24 comme environnement de qualification', async () => {
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.engines?.node, '>=24 <25');
});
EOF

cat > docs/BASELINE.md <<'EOF'
# P5A VISUEL — baseline locale initiale

Statut initial : terrain seulement, aucune qualification VISUEL-0 acquise.

## Autorité amont
P1 / Lecteur du Cœur est l'unique frontière durable de lecture.

## Séparation obligatoire
- publication_seq : continuité de publication ;
- state_revision : révision canonique représentée ;
- canonical_age : âge canonique ;
- event_history_exhaustive peut être faux : ne jamais inventer les événements absents.

## Préférences utilisateur
Les réglages concernés par P5A sont exclusivement visuels/sensoriels. Ils sont appliqués en aval de la grammaire identitaire et ne changent jamais le monde, son identité, ses faits ou sa chronologie.

## Non-buts du bootstrap
- aucun renderer final ;
- aucune grammaire morphologique définitive ;
- aucun mapping privé Cœur -> visuel ;
- aucun accès live ;
- aucune copie de l'ancien VISUEL-0/1/Canvas ;
- aucune dépendance P2/P3/P4/P6.
EOF

node_major=$(node --version | sed -E 's/^v([0-9]+).*/\1/')
echo "node=$(node --version)"
if [[ "$node_major" -ge 24 && "$node_major" -lt 25 ]]; then
  npm test
  qualification_node24=YES
else
  echo "WARN: Node 24.x absent; terrain créé mais qualification canonique différée"
  qualification_node24=NO
fi

git add README.md .gitignore package.json src test fixtures docs
git -c user.name='P5A Bootstrap' -c user.email='p5a-bootstrap@invalid.local' \
  commit -m "chore: bootstrap P5A VISUEL offline" >/dev/null

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
echo "NODE24_QUALIFICATION_READY=$qualification_node24"
echo "O1_TOUCH=NO"
echo "LEGACY_VISUEL_COPY=NO"
echo "P5A_BOOTSTRAP=PASS"
