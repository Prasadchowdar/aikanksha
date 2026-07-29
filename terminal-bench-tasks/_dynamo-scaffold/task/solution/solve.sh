#!/bin/bash
# Golden reference solution -- thin wrapper only.
#
# Dynamo convention: keep the real logic in a helper (solve.py) and have
# this script call it. The oracle agent runs this; it must take the task
# from its seeded state to a state where every test in
# tests/test_outputs.py passes, writing outputs to absolute /app paths.
#
# This file lives in the repo for review. It is NEVER baked into the image.

set -euo pipefail

python3 /solution/solve.py
