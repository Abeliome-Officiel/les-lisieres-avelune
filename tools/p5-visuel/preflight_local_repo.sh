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

printf 'P5A_VISUEL_PREFLIGHT target=%s\n' "$TARGET"

command -v git >/dev/null
printf 'GIT=%s\n' "$(git --version)"

# Prefer an explicit P5A node, then a user-local Node 24, then PATH.
NODE_BIN=${P5A_NODE_BIN:-}
if [[ -z "$NODE_BIN" ]]; then
  shopt -s nullglob
  candidates=("$HOME"/.local/node-v24*-linux-x64/bin/node)
  shopt -u nullglob
  if ((${#candidates[@]})); then
    NODE_BIN=$(printf '%s\n' "${candidates[@]}" | sort -V | tail -n 1)
  elif command -v node >/dev/null 2>&1; then
    NODE_BIN=$(command -v node)
  fi
fi

if [[ -z "$NODE_BIN" || ! -x "$NODE_BIN" ]]; then
  echo "NODE=ABSENT"
  echo "NODE24_READY=NO"
  exit 1
fi

NODE_VERSION=$($NODE_BIN --version 2>&1)
NODE_MAJOR=$(printf '%s' "$NODE_VERSION" | sed -E 's/^v([0-9]+).*/\1/')
printf 'NODE_BIN=%s\n' "$NODE_BIN"
printf 'NODE=%s\n' "$NODE_VERSION"

if [[ "$NODE_MAJOR" -lt 24 ]]; then
  echo "NODE24_READY=NO"
  exit 1
fi
echo "NODE24_READY=YES"

TARGET_STATE=ABSENT
if [[ -e "$TARGET" ]]; then
  if [[ ! -d "$TARGET" ]]; then
    echo "FAIL: target exists and is not a directory" >&2
    exit 1
  fi

  if [[ -z "$(find "$TARGET" -mindepth 1 -maxdepth 1 -print -quit)" ]]; then
    TARGET_STATE=EMPTY
  elif [[ -d "$TARGET/.git" \
       && -f "$TARGET/package.json" \
       && -f "$TARGET/README.md" \
       && -f "$TARGET/test/bootstrap.test.mjs" \
       && -d "$TARGET/src/contracts" \
       && -d "$TARGET/src/input" \
       && -d "$TARGET/src/session" \
       && -d "$TARGET/src/replay" \
       && -d "$TARGET/src/payload" \
       && -d "$TARGET/src/grammar" \
       && -d "$TARGET/src/presentation" \
       && -d "$TARGET/src/renderers" ]]; then
    TARGET_STATE=BOOTSTRAPPED
  else
    echo "TARGET_STATE=UNKNOWN_NONEMPTY"
    echo "FAIL: non-empty target is not a recognized P5A bootstrap" >&2
    exit 1
  fi
fi

echo "TARGET_STATE=$TARGET_STATE"

parent=$(dirname "$TARGET")
if [[ ! -d "$parent" ]]; then
  echo "FAIL: parent directory does not exist: $parent" >&2
  exit 1
fi
if [[ ! -w "$parent" ]]; then
  echo "FAIL: parent directory is not writable: $parent" >&2
  exit 1
fi

if [[ "$TARGET_STATE" == "BOOTSTRAPPED" ]]; then
  branch=$(git -C "$TARGET" branch --show-current)
  remote_count=$(git -C "$TARGET" remote | wc -l)
  dirty=$(git -C "$TARGET" status --porcelain)
  printf 'TARGET_BRANCH=%s\n' "$branch"
  printf 'TARGET_REMOTE_COUNT=%s\n' "$remote_count"
  if [[ "$branch" != "main" ]]; then
    echo "FAIL: bootstrapped target must be on local main" >&2
    exit 1
  fi
  if [[ "$remote_count" -ne 0 ]]; then
    echo "FAIL: bootstrapped target must have no remote" >&2
    exit 1
  fi
  if [[ -n "$dirty" ]]; then
    echo "FAIL: bootstrapped target worktree is dirty" >&2
    exit 1
  fi
  (
    cd "$TARGET"
    PATH="$(dirname "$NODE_BIN"):$PATH" npm test
  )
  echo "TARGET_BOOTSTRAP_TESTS=PASS"
fi

# O1 / Cœur active runtime must not be inspected by this preflight.
echo "O1_TOUCH=NO"
echo "COEUR_SQLITE_TOUCH=NO"
echo "LEGACY_VISUEL_COPY=NO"
echo "NETWORK_REQUIRED_FOR_PREFLIGHT=NO"
echo "RENDERER_DEPENDENCY_REQUIRED=NO"
echo "P5A_VISUEL_LOCAL_PREFLIGHT=PASS"
