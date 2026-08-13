#!/usr/bin/env python3
"""Contrôle minimal et autonome des fixtures publiques neutres de MUSIQUE-0.

Ce script ne charge aucun code du Cœur, aucun code du jeu et aucune recette de
traduction. Il vérifie uniquement l'intégrité du corpus synthétique et les
invariants publics de l'enveloppe expérimentale.
"""

from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
MANIFEST_PATH = ROOT / "docs/contracts/musique0-fixtures/manifest.json"
KEY_RE = re.compile(r"^[a-z][a-z0-9_.-]{2,63}$")
VERSION_RE = re.compile(r"^0\.[0-9]+\.[0-9]+$")


class FixtureError(RuntimeError):
    """Erreur de validation du corpus MUSIQUE-0."""


def load_json(path: Path) -> dict[str, Any]:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise FixtureError(f"{path}: lecture JSON impossible: {exc}") from exc
    if not isinstance(value, dict):
        raise FixtureError(f"{path}: l'objet racine doit être un objet JSON")
    return value


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(65536), b""):
            digest.update(chunk)
    return digest.hexdigest()


def require(condition: bool, message: str) -> None:
    if not condition:
        raise FixtureError(message)


def number_in_range(value: Any, low: float, high: float) -> bool:
    return (
        isinstance(value, (int, float))
        and not isinstance(value, bool)
        and low <= float(value) <= high
    )


def non_empty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def exact_keys(value: dict[str, Any], allowed: set[str], label: str) -> None:
    extras = sorted(set(value) - allowed)
    require(not extras, f"{label}: propriétés inattendues: {', '.join(extras)}")


def validate_fixture(data: dict[str, Any], expected_version: str, label: str) -> int:
    exact_keys(
        data,
        {
            "contract_id",
            "schema_version",
            "projection_profile",
            "source",
            "frame",
            "descriptors",
            "events",
            "extensions",
        },
        label,
    )

    require(
        data.get("contract_id") == "avelune.representation.semantic",
        f"{label}: contract_id invalide",
    )

    version = data.get("schema_version")
    require(
        isinstance(version, str) and VERSION_RE.fullmatch(version) is not None,
        f"{label}: schema_version invalide",
    )
    require(version == expected_version, f"{label}: version différente du manifeste")
    require(non_empty_string(data.get("projection_profile")), f"{label}: projection_profile absent")

    source = data.get("source")
    require(isinstance(source, dict), f"{label}: source doit être un objet")
    exact_keys(
        source,
        {"kind", "source_id", "source_version", "adapter_version", "replay_id"},
        f"{label}.source",
    )
    require(source.get("kind") == "synthetic", f"{label}: une fixture publique doit être synthetic")
    for key in ("source_id", "source_version", "adapter_version", "replay_id"):
        require(non_empty_string(source.get(key)), f"{label}: source.{key} invalide")

    frame = data.get("frame")
    require(isinstance(frame, dict), f"{label}: frame doit être un objet")
    exact_keys(
        frame,
        {"state_id", "sequence", "logical_time", "mode", "base_sequence", "scope"},
        f"{label}.frame",
    )
    require(non_empty_string(frame.get("state_id")), f"{label}: frame.state_id invalide")

    sequence = frame.get("sequence")
    require(
        isinstance(sequence, int) and not isinstance(sequence, bool) and sequence >= 0,
        f"{label}: frame.sequence invalide",
    )
    require(
        number_in_range(frame.get("logical_time"), 0, float("inf")),
        f"{label}: frame.logical_time invalide",
    )
    require(frame.get("mode") in {"full", "delta"}, f"{label}: frame.mode invalide")
    if frame.get("mode") == "delta":
        base_sequence = frame.get("base_sequence")
        require(
            isinstance(base_sequence, int)
            and not isinstance(base_sequence, bool)
            and base_sequence >= 0,
            f"{label}: base_sequence requis en mode delta",
        )

    scope = frame.get("scope")
    require(isinstance(scope, dict), f"{label}: frame.scope doit être un objet")
    exact_keys(scope, {"kind", "id"}, f"{label}.frame.scope")
    require(scope.get("kind") in {"world", "region", "scene"}, f"{label}: scope.kind invalide")
    require(non_empty_string(scope.get("id")), f"{label}: scope.id invalide")

    descriptors = data.get("descriptors")
    require(isinstance(descriptors, dict), f"{label}: descriptors doit être un objet")
    for key, descriptor in descriptors.items():
        require(isinstance(key, str) and KEY_RE.fullmatch(key) is not None, f"{label}: clé descriptor invalide: {key!r}")
        require(isinstance(descriptor, dict), f"{label}: descriptor {key} doit être un objet")
        exact_keys(descriptor, {"value", "trend"}, f"{label}.descriptors.{key}")
        require(number_in_range(descriptor.get("value"), 0, 1), f"{label}: {key}.value hors [0,1]")
        if "trend" in descriptor:
            require(number_in_range(descriptor["trend"], -1, 1), f"{label}: {key}.trend hors [-1,1]")

    events = data.get("events")
    require(isinstance(events, list), f"{label}: events doit être une liste")
    for index, event in enumerate(events):
        event_label = f"{label}.events[{index}]"
        require(isinstance(event, dict), f"{event_label}: doit être un objet")
        exact_keys(event, {"event_id", "type", "phase", "intensity"}, event_label)
        require(non_empty_string(event.get("event_id")), f"{event_label}: event_id invalide")
        event_type = event.get("type")
        require(
            isinstance(event_type, str) and KEY_RE.fullmatch(event_type) is not None,
            f"{event_label}: type invalide",
        )
        if "phase" in event:
            require(event["phase"] in {"start", "active", "end"}, f"{event_label}: phase invalide")
        if "intensity" in event:
            require(number_in_range(event["intensity"], 0, 1), f"{event_label}: intensity hors [0,1]")

    extensions = data.get("extensions", {})
    require(isinstance(extensions, dict), f"{label}: extensions doit être un objet")
    for key in extensions:
        require(isinstance(key, str) and KEY_RE.fullmatch(key) is not None, f"{label}: clé extension invalide: {key!r}")

    return sequence


def main() -> int:
    manifest = load_json(MANIFEST_PATH)
    require(
        manifest.get("manifest_id") == "avelune.musique0.public-neutral-fixtures",
        "manifest: manifest_id invalide",
    )
    expected_version = manifest.get("schema_version")
    require(
        isinstance(expected_version, str) and VERSION_RE.fullmatch(expected_version) is not None,
        "manifest: schema_version invalide",
    )
    require(
        manifest.get("classification") == "shareable-neutral-synthetic",
        "manifest: classification inattendue",
    )

    schema_path = manifest.get("schema_path")
    require(non_empty_string(schema_path), "manifest: schema_path absent")
    schema_file = (ROOT / str(schema_path)).resolve()
    require(ROOT in schema_file.parents, "manifest: schema_path sort du dépôt")
    require(schema_file.is_file(), f"manifest: schéma absent: {schema_path}")

    fixtures = manifest.get("fixtures")
    require(isinstance(fixtures, list) and fixtures, "manifest: aucune fixture")

    sequences: list[int] = []
    seen_ids: set[str] = set()
    for entry in fixtures:
        require(isinstance(entry, dict), "manifest: entrée fixture invalide")
        fixture_id = entry.get("id")
        fixture_path = entry.get("path")
        expected_digest = entry.get("sha256")
        require(non_empty_string(fixture_id), "manifest: id fixture invalide")
        require(fixture_id not in seen_ids, f"manifest: id dupliqué: {fixture_id}")
        seen_ids.add(str(fixture_id))
        require(non_empty_string(fixture_path), f"{fixture_id}: path invalide")
        require(
            isinstance(expected_digest, str) and re.fullmatch(r"[0-9a-f]{64}", expected_digest) is not None,
            f"{fixture_id}: sha256 invalide",
        )

        path = (ROOT / str(fixture_path)).resolve()
        require(ROOT in path.parents, f"{fixture_id}: path sort du dépôt")
        require(path.is_file(), f"{fixture_id}: fichier absent: {fixture_path}")
        actual_digest = sha256(path)
        require(actual_digest == expected_digest, f"{fixture_id}: SHA-256 différent du manifeste")

        data = load_json(path)
        sequences.append(validate_fixture(data, str(expected_version), str(fixture_id)))

    require(sequences == sorted(sequences), "manifest: séquences de fixtures non croissantes")
    require(len(sequences) == len(set(sequences)), "manifest: séquences de fixtures dupliquées")

    print(f"MUSIQUE-0: {len(fixtures)} fixtures publiques neutres valides — contrat {expected_version}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except FixtureError as exc:
        print(f"MUSIQUE-0: ECHEC — {exc}", file=sys.stderr)
        raise SystemExit(1)
