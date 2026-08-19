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

printf 'P5B_PREFLIGHT target=%s\n' "$TARGET"

command -v git >/dev/null
command -v python3 >/dev/null

printf 'git=%s\n' "$(git --version)"
printf 'python=%s\n' "$(python3 --version 2>&1)"

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

# This preflight intentionally does not inspect, hash or read an active Cœur runtime.
echo "o1_touch=NO"
echo "legacy_musique0_copy=NO"
echo "network_required=NO"
echo "audio_dependency_required=NO"
echo "P5B_LOCAL_PREFLIGHT=PASS"
