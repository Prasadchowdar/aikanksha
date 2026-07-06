#!/bin/bash
# Verifier for csvlite-packaging-repair.
#
# Checks, in order:
#   1. Protected file untouched (sha256) and source layout preserved.
#   2. The documented offline install command succeeds from /app.
#   3. Version metadata is dynamic (no literal version in pyproject.toml).
#   4. CLI behavior: --version, stats output formatting, BOM handling,
#      error messages, and exit codes exactly as documented.
#
# Reward: 1 on full success, 0 otherwise, written to /logs/verifier/reward.txt.

APP_DIR="${APP_DIR:-/app}"
TESTS_DIR="${TESTS_DIR:-/tests}"
LOGS_DIR="${LOGS_DIR:-/logs/verifier}"
PYTHON="${PYTHON:-python3}"
PIP_INSTALL_FLAGS="${PIP_INSTALL_FLAGS:---no-build-isolation --no-index --force-reinstall --break-system-packages}"

mkdir -p "$LOGS_DIR"
echo 0 > "$LOGS_DIR/reward.txt"

fail() {
    echo "FAIL: $1"
    exit 0
}

cd "$APP_DIR" || fail "working directory $APP_DIR is missing"

# --- 1. Protected file and layout.
echo "9c788a838dc1f6bfd80fa39757a95f94260071c35011c9a05301da1c73507657  VERSION" | sha256sum -c - >/dev/null 2>&1 \
    || fail "protected file VERSION was modified"
[ -f lib/csvlite/__init__.py ] || fail "package must remain at lib/csvlite/"
[ ! -d csvlite ] || fail "a top-level csvlite/ directory is not allowed"

# --- 2. Offline install from source.
# shellcheck disable=SC2086
if ! "$PYTHON" -m pip install $PIP_INSTALL_FLAGS . > "$LOGS_DIR/install.log" 2>&1; then
    tail -30 "$LOGS_DIR/install.log"
    fail "offline pip install from /app failed"
fi

CSVLITE=$(command -v csvlite) || fail "no csvlite executable on PATH after install"

# --- 3. Version must come from the package attribute, not a literal in
#        pyproject.toml.
grep -Eq '^[[:space:]]*version[[:space:]]*=[[:space:]]*"[0-9]' pyproject.toml \
    && fail "pyproject.toml contains a static version; it must stay dynamic"
grep -Eq '__version__[[:space:]]*=[[:space:]]*"0\.7\.3"' lib/csvlite/__init__.py \
    || fail "lib/csvlite/__init__.py must define __version__ = \"0.7.3\""

# --- 4. CLI behavior.
check_output() {
    local desc="$1" expected="$2" actual="$3"
    if [ "$actual" != "$expected" ]; then
        echo "expected: $expected"
        echo "actual:   $actual"
        fail "$desc"
    fi
}

d="$TESTS_DIR/data"

out=$("$CSVLITE" --version)
rc=$?
[ "$rc" -eq 0 ] || fail "--version exited with $rc, expected 0"
check_output "--version" "csvlite 0.7.3" "$out"

expected_basic=$(printf 'count = 4\nmean = 3.750\nmin = -3.250\nmax = 10.500')
out=$("$CSVLITE" stats "$d/basic.csv" --col value)
rc=$?
[ "$rc" -eq 0 ] || fail "stats basic.csv exited with $rc, expected 0"
check_output "stats basic.csv --col value" "$expected_basic" "$out"

expected_bom=$(printf 'count = 2\nmean = 3.000\nmin = 2.500\nmax = 3.500')
out=$("$CSVLITE" stats "$d/bom.csv" --col value)
rc=$?
[ "$rc" -eq 0 ] || fail "stats bom.csv exited with $rc (is the UTF-8 BOM ignored?)"
check_output "stats bom.csv --col value (BOM handling)" "$expected_bom" "$out"

err=$("$CSVLITE" stats "$d/basic.csv" --col nope 2>&1 >/dev/null)
rc=$?
[ "$rc" -eq 1 ] || fail "missing column: exit code was $rc, expected 1"
check_output "missing column stderr" "csvlite: no such column: nope" "$err"

err=$("$CSVLITE" stats "$d/text.csv" --col value 2>&1 >/dev/null)
rc=$?
[ "$rc" -eq 1 ] || fail "non-numeric cell: exit code was $rc, expected 1"
check_output "non-numeric stderr" "csvlite: invalid number: abc" "$err"

"$CSVLITE" >/dev/null 2>&1
[ $? -eq 2 ] || fail "no arguments: expected exit code 2"
"$CSVLITE" frobnicate >/dev/null 2>&1
[ $? -eq 2 ] || fail "unknown subcommand: expected exit code 2"

echo 1 > "$LOGS_DIR/reward.txt"
echo "PASS: all checks passed"
