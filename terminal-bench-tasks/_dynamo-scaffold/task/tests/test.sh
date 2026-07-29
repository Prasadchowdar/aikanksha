#!/bin/bash
# Dynamo verifier entrypoint.
#
# Contract (differs from stock Terminal-Bench):
#   - Installs NOTHING. pytest and its plugins are pinned in
#     environment/Dockerfile and are already present in the image.
#   - Runs pytest over /tests/test_outputs.py.
#   - Writes BOTH /logs/verifier/ctrf.json and /logs/verifier/reward.txt.
#   - reward.txt is 1 only when every test passes, 0 otherwise.
#
# This file is copied to /tests/test.sh at verify time; it is not present
# during the agent run.

LOGS_DIR="${LOGS_DIR:-/logs/verifier}"
TESTS_DIR="${TESTS_DIR:-/tests}"

mkdir -p "$LOGS_DIR"
echo 0 > "$LOGS_DIR/reward.txt"

pytest \
    --ctrf "$LOGS_DIR/ctrf.json" \
    "$TESTS_DIR/test_outputs.py" \
    -rA
status=$?

if [ "$status" -eq 0 ]; then
    echo 1 > "$LOGS_DIR/reward.txt"
fi

exit "$status"
