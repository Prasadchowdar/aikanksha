"""Verifier tests for <task-name>.

Scoring rules that shape every test in this file:

* Score only OBSERVABLE ARTIFACTS -- files on disk under /app and process
  exit codes. Anything that existed only in the agent's stdout is gone by
  the time this runs and cannot be scored.
* Use absolute /app paths. The verifier's working directory is not
  guaranteed to be the same as the agent's.
* Each test states, in its name and docstring, exactly which required
  behavior it checks, so a reviewer can map tests to instruction.md
  one-to-one.
* Tests must be resistant to shortcuts: prefer freshly generated inputs
  and discriminating cases over fixtures the agent could have inspected
  and special-cased.
"""

import json
import subprocess
from pathlib import Path

import pytest

APP = Path("/app")


# --------------------------------------------------------------------------
# Artifact existence and shape
# --------------------------------------------------------------------------

def test_required_output_file_exists():
    """instruction.md requires the agent to produce /app/<output>."""
    out = APP / "REPLACE_ME_output.json"
    assert out.is_file(), f"missing required artifact: {out}"


def test_output_is_valid_json_with_required_schema():
    """The output must match the schema declared as normative in instruction.md."""
    out = APP / "REPLACE_ME_output.json"
    data = json.loads(out.read_text())

    assert isinstance(data, dict), "top level must be a JSON object"
    for key in ("REPLACE_ME_key_a", "REPLACE_ME_key_b"):
        assert key in data, f"required key missing from output: {key}"


# --------------------------------------------------------------------------
# Correctness on discriminating inputs
# --------------------------------------------------------------------------

@pytest.mark.parametrize(
    "case_input,expected",
    [
        ("REPLACE_ME_case_1", "REPLACE_ME_expected_1"),
        ("REPLACE_ME_case_2", "REPLACE_ME_expected_2"),
    ],
)
def test_behavior_on_discriminating_cases(case_input, expected):
    """Cases chosen so a plausible-but-wrong implementation gives a different answer."""
    proc = subprocess.run(
        [str(APP / "REPLACE_ME_entrypoint"), case_input],
        capture_output=True,
        text=True,
        timeout=60,
    )
    assert proc.returncode == 0, f"unexpected failure: {proc.stderr}"
    assert proc.stdout.strip() == expected


# --------------------------------------------------------------------------
# Error contract
# --------------------------------------------------------------------------

def test_invalid_input_exits_with_documented_code_and_message():
    """instruction.md documents the exact stderr text and exit code."""
    proc = subprocess.run(
        [str(APP / "REPLACE_ME_entrypoint"), "REPLACE_ME_bad_input"],
        capture_output=True,
        text=True,
        timeout=60,
    )
    assert proc.returncode == 1
    assert proc.stderr.strip() == "REPLACE_ME_error_message"


# --------------------------------------------------------------------------
# Anti-cheat / constraint enforcement
# --------------------------------------------------------------------------

def test_protected_files_unmodified():
    """Frozen inputs are checksummed so the agent cannot rewrite the problem."""
    import hashlib

    expected = {
        "REPLACE_ME_protected_file": "REPLACE_ME_sha256",
    }
    for rel, digest in expected.items():
        path = APP / rel
        assert path.is_file(), f"protected file is missing: {path}"
        actual = hashlib.sha256(path.read_bytes()).hexdigest()
        assert actual == digest, f"protected file was modified: {path}"
