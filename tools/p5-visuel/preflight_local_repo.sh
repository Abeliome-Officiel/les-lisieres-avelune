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
command -v node >/dev/null

printf 'git=%s\n' "$(git --version)"
printf 'node=%s\n' "$(node --version 2>&1)"

node_major=$(node --version | sed -E 's/^v([0-9]+).*/\1/')
if [[ "$node_major" -lt 24 ]]; then
  echo "WARN: Node < 24; bootstrap Git possible, canonical P5A tests require Node 24.x"
  echo "node24_ready=NO"
else
  echo "node24_ready=YES"
fi

if [[ -e "$TARGET" ]]; then
  if [[ ! -d "$TARGET" ]]; then
    echo "FAIL: target exists and is not a directory" >&2
    exit 1
  fi
  if [[ -n "$(find "$TARGET" -mindepth 1 -maxdepth 1 -print -quit)" ]]; then
    echo "FAIL: target exists and is not empty; clean bootstrap requires a new/empty directory" >&2
    exit 1
  fi
fi

parent=$(dirname "$TARGET")
if [[ ! -d "$parent" ]]; then
  echo "FAIL: parent directory does not exist: $parent" >&2
  exit 1
fi
if [[ ! -w "$parent" ]]; then
  echo "FAIL: parent directory is not writable: $parent" >&2
  exit 1
fi

# O1 / Cœur active runtime must not be inspected by this preflight.
echo "o1_touch=NO"
echo "coeur_sqlite_touch=NO"
echo "legacy_visuel_copy=NO"
echo "network_required_for_preflight=NO"
echo "renderer_dependency_required=NO"
echo "P5A_VISUEL_LOCAL_PREFLIGHT=PASS"
